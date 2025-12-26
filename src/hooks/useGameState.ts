import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";

export type GameType = "cups" | "reaction" | "memory" | "crash";

interface SharedGameState {
  balance: number;
  currentBet: number;
  xp: number;
  level: number;
  streak: number;
  totalWagered: number;
  totalWon: number;
  gamesPlayed: number;
  biggestWin: number;
}

interface CupGameState {
  round: number;
  multiplier: number;
  isPlaying: boolean;
  selectedCup: number | null;
  revealedCup: number | null;
  bombPosition: number;
  cupsCount: number;
  canCashOut: boolean;
}

interface ReactionGameState {
  isPlaying: boolean;
  phase: "waiting" | "ready" | "go" | "result";
  targetTime: number;
  reactionTime: number | null;
  multiplier: number;
}

interface MemoryGameState {
  isPlaying: boolean;
  phase: "showing" | "input" | "result";
  sequence: number[];
  userSequence: number[];
  currentShowIndex: number;
  level: number;
  multiplier: number;
}

interface CrashGameState {
  isPlaying: boolean;
  phase: "betting" | "running" | "crashed";
  multiplier: number;
  crashPoint: number;
  cashedOut: boolean;
  cashOutMultiplier: number;
}

interface GameResult {
  isVisible: boolean;
  isWin: boolean;
  amount: number;
  multiplier: number;
  gameType: GameType;
  message?: string;
}

interface GameHistoryEntry {
  id: string;
  gameType: GameType;
  bet: number;
  won: boolean;
  amount: number;
  multiplier: number;
  timestamp: number;
}

const INITIAL_BALANCE = 10000;
const XP_PER_LEVEL = 1000;
const STORAGE_KEY = "neon-arcade-state";
const HISTORY_KEY = "neon-arcade-history";

// Load state from localStorage
const loadState = (): SharedGameState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, currentBet: Math.min(parsed.currentBet, parsed.balance) };
    }
  } catch (e) {
    console.error("Failed to load state:", e);
  }
  return {
    balance: INITIAL_BALANCE,
    currentBet: 100,
    xp: 0,
    level: 1,
    streak: 0,
    totalWagered: 0,
    totalWon: 0,
    gamesPlayed: 0,
    biggestWin: 0,
  };
};

// Save state to localStorage
const saveState = (state: SharedGameState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
};

// Load game history
const loadHistory = (): GameHistoryEntry[] => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load history:", e);
  }
  return [];
};

// Save game history
const saveHistory = (history: GameHistoryEntry[]) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50
  } catch (e) {
    console.error("Failed to save history:", e);
  }
};

export const useGameState = () => {
  // Shared state with persistence
  const [shared, setShared] = useState<SharedGameState>(loadState);
  const [activeGame, setActiveGame] = useState<GameType>("cups");
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>(loadHistory);
  
  // Game states
  const [cupGame, setCupGame] = useState<CupGameState>({
    round: 0,
    multiplier: 1.0,
    isPlaying: false,
    selectedCup: null,
    revealedCup: null,
    bombPosition: -1,
    cupsCount: 3,
    canCashOut: false,
  });

  const [reactionGame, setReactionGame] = useState<ReactionGameState>({
    isPlaying: false,
    phase: "waiting",
    targetTime: 0,
    reactionTime: null,
    multiplier: 1.0,
  });

  const [memoryGame, setMemoryGame] = useState<MemoryGameState>({
    isPlaying: false,
    phase: "showing",
    sequence: [],
    userSequence: [],
    currentShowIndex: -1,
    level: 1,
    multiplier: 1.0,
  });

  const [crashGame, setCrashGame] = useState<CrashGameState>({
    isPlaying: false,
    phase: "betting",
    multiplier: 1.0,
    crashPoint: 0,
    cashedOut: false,
    cashOutMultiplier: 1.0,
  });

  const [gameResult, setGameResult] = useState<GameResult>({
    isVisible: false,
    isWin: false,
    amount: 0,
    multiplier: 1,
    gameType: "cups",
  });

  // Refs for timers and game loops - CRITICAL FOR CLEANUP
  const reactionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reactionStartRef = useRef<number>(0);
  const memoryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const memoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const crashRAFRef = useRef<number | null>(null);
  const crashStartTimeRef = useRef<number>(0);
  const isCrashRunningRef = useRef(false);

  // Persist state changes
  useEffect(() => {
    saveState(shared);
  }, [shared]);

  // Persist history changes
  useEffect(() => {
    saveHistory(gameHistory);
  }, [gameHistory]);

  // Cleanup on unmount - PREVENT MEMORY LEAKS
  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      if (memoryIntervalRef.current) clearInterval(memoryIntervalRef.current);
      if (memoryTimeoutRef.current) clearTimeout(memoryTimeoutRef.current);
      if (crashRAFRef.current) cancelAnimationFrame(crashRAFRef.current);
      isCrashRunningRef.current = false;
    };
  }, []);

  // Memoized calculations
  const winRate = useMemo(() => {
    if (shared.gamesPlayed === 0) return "0.0";
    const wins = gameHistory.filter(g => g.won).length;
    return (wins / shared.gamesPlayed * 100).toFixed(1);
  }, [shared.gamesPlayed, gameHistory]);

  // Add game to history
  const addToHistory = useCallback((entry: Omit<GameHistoryEntry, "id" | "timestamp">) => {
    const newEntry: GameHistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    setGameHistory(prev => [newEntry, ...prev]);
  }, []);

  // Calculate multiplier for cup game
  const calculateCupMultiplier = useCallback((round: number, cupsCount: number): number => {
    const baseMultiplier = Math.pow(cupsCount / (cupsCount - 1), round);
    const houseEdge = 0.97;
    return Number((baseMultiplier * houseEdge).toFixed(2));
  }, []);

  // Memoized callbacks for bet management
  const setBetAmount = useCallback((amount: number) => {
    setShared(prev => ({ ...prev, currentBet: Math.max(10, Math.min(prev.balance, amount)) }));
  }, []);

  const addXP = useCallback((amount: number) => {
    setShared(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      if (newLevel > prev.level) {
        toast.success(`Level Up! Now level ${newLevel}`, { icon: "🎊" });
      }
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  const closeResult = useCallback(() => {
    setGameResult(prev => ({ ...prev, isVisible: false }));
  }, []);

  // ====== CUP GAME LOGIC ======
  const startCupGame = useCallback(() => {
    if (shared.currentBet > shared.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setShared(prev => ({ 
      ...prev, 
      balance: prev.balance - prev.currentBet,
      totalWagered: prev.totalWagered + prev.currentBet,
      gamesPlayed: prev.gamesPlayed + 1,
    }));

    const bombPos = Math.floor(Math.random() * 3);

    setCupGame({
      round: 1,
      multiplier: calculateCupMultiplier(1, 3),
      isPlaying: true,
      selectedCup: null,
      revealedCup: null,
      bombPosition: bombPos,
      cupsCount: 3,
      canCashOut: false,
    });

    toast("Choose wisely...", { icon: "🎲" });
  }, [shared.currentBet, shared.balance, calculateCupMultiplier]);

  const selectCup = useCallback((cupIndex: number) => {
    if (!cupGame.isPlaying || cupGame.revealedCup !== null) return;

    setCupGame(prev => ({ ...prev, selectedCup: cupIndex }));

    setTimeout(() => {
      const hitBomb = cupIndex === cupGame.bombPosition;

      if (hitBomb) {
        setCupGame(prev => ({ ...prev, revealedCup: cupIndex, isPlaying: false }));
        setShared(prev => ({ ...prev, streak: 0 }));
        
        addToHistory({
          gameType: "cups",
          bet: shared.currentBet,
          won: false,
          amount: shared.currentBet,
          multiplier: cupGame.multiplier,
        });

        setTimeout(() => {
          setGameResult({
            isVisible: true,
            isWin: false,
            amount: shared.currentBet,
            multiplier: cupGame.multiplier,
            gameType: "cups",
            message: `Round ${cupGame.round}`,
          });
        }, 800);
      } else {
        // Max 10 rounds to prevent infinite gameplay
        if (cupGame.round >= 10) {
          const winAmount = Math.floor(shared.currentBet * cupGame.multiplier);
          setShared(prev => ({
            ...prev,
            balance: prev.balance + winAmount,
            totalWon: prev.totalWon + winAmount,
            biggestWin: Math.max(prev.biggestWin, winAmount),
            streak: prev.streak + 1,
          }));

          setCupGame(prev => ({ ...prev, revealedCup: cupIndex, isPlaying: false }));
          addXP(100);

          addToHistory({
            gameType: "cups",
            bet: shared.currentBet,
            won: true,
            amount: winAmount,
            multiplier: cupGame.multiplier,
          });

          setTimeout(() => {
            setGameResult({
              isVisible: true,
              isWin: true,
              amount: winAmount,
              multiplier: cupGame.multiplier,
              gameType: "cups",
              message: "Max rounds reached!",
            });
          }, 800);
          return;
        }

        const newRound = cupGame.round + 1;
        const newMultiplier = calculateCupMultiplier(newRound, 3);
        const newBombPos = Math.floor(Math.random() * 3);

        setCupGame(prev => ({ ...prev, revealedCup: cupIndex }));

        setTimeout(() => {
          setCupGame({
            round: newRound,
            multiplier: newMultiplier,
            isPlaying: true,
            selectedCup: null,
            revealedCup: null,
            bombPosition: newBombPos,
            cupsCount: 3,
            canCashOut: true,
          });

          addXP(25 * newRound);
          toast.success(`Round ${newRound} - ${newMultiplier}x`, { icon: "✨" });
        }, 600);
      }
    }, 400);
  }, [cupGame, shared.currentBet, addXP, calculateCupMultiplier, addToHistory]);

  const cashOutCups = useCallback(() => {
    if (!cupGame.isPlaying || !cupGame.canCashOut) return;

    const winAmount = Math.floor(shared.currentBet * cupGame.multiplier);

    setShared(prev => ({
      ...prev,
      balance: prev.balance + winAmount,
      totalWon: prev.totalWon + winAmount,
      biggestWin: Math.max(prev.biggestWin, winAmount),
      streak: prev.streak + 1,
    }));

    setCupGame(prev => ({ ...prev, isPlaying: false, canCashOut: false }));
    addXP(50 * cupGame.round);

    addToHistory({
      gameType: "cups",
      bet: shared.currentBet,
      won: true,
      amount: winAmount,
      multiplier: cupGame.multiplier,
    });

    setGameResult({
      isVisible: true,
      isWin: true,
      amount: winAmount,
      multiplier: cupGame.multiplier,
      gameType: "cups",
      message: `Survived ${cupGame.round} rounds`,
    });
  }, [cupGame, shared.currentBet, addXP, addToHistory]);

  // ====== REACTION GAME LOGIC - FIXED TIMING ======
  const startReactionGame = useCallback(() => {
    if (shared.currentBet > shared.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setShared(prev => ({ 
      ...prev, 
      balance: prev.balance - prev.currentBet,
      totalWagered: prev.totalWagered + prev.currentBet,
      gamesPlayed: prev.gamesPlayed + 1,
    }));

    setReactionGame({
      isPlaying: true,
      phase: "ready",
      targetTime: 0,
      reactionTime: null,
      multiplier: 1.0,
    });

    // Clear any existing timer
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);

    const delay = 1500 + Math.random() * 3000;
    
    reactionTimerRef.current = setTimeout(() => {
      reactionStartRef.current = performance.now();
      setReactionGame(prev => ({ ...prev, phase: "go" }));
    }, delay);
  }, [shared.currentBet, shared.balance]);

  const hitReaction = useCallback(() => {
    if (reactionGame.phase === "ready") {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      
      setReactionGame({
        isPlaying: false,
        phase: "result",
        targetTime: 0,
        reactionTime: -1,
        multiplier: 0,
      });

      setShared(prev => ({ ...prev, streak: 0 }));

      addToHistory({
        gameType: "reaction",
        bet: shared.currentBet,
        won: false,
        amount: shared.currentBet,
        multiplier: 0,
      });

      setGameResult({
        isVisible: true,
        isWin: false,
        amount: shared.currentBet,
        multiplier: 0,
        gameType: "reaction",
        message: "Too early!",
      });
      return;
    }

    if (reactionGame.phase === "go") {
      const reactionTime = performance.now() - reactionStartRef.current;
      
      let multiplier = 0;
      if (reactionTime < 150) multiplier = 5.0;
      else if (reactionTime < 200) multiplier = 3.0;
      else if (reactionTime < 250) multiplier = 2.0;
      else if (reactionTime < 350) multiplier = 1.5;
      else if (reactionTime < 500) multiplier = 1.2;
      else multiplier = 0;

      const isWin = multiplier > 0;
      const winAmount = isWin ? Math.floor(shared.currentBet * multiplier) : 0;

      setReactionGame({
        isPlaying: false,
        phase: "result",
        targetTime: 0,
        reactionTime: Math.round(reactionTime),
        multiplier,
      });

      if (isWin) {
        setShared(prev => ({
          ...prev,
          balance: prev.balance + winAmount,
          totalWon: prev.totalWon + winAmount,
          biggestWin: Math.max(prev.biggestWin, winAmount),
          streak: prev.streak + 1,
        }));
        addXP(30 * multiplier);
      } else {
        setShared(prev => ({ ...prev, streak: 0 }));
      }

      addToHistory({
        gameType: "reaction",
        bet: shared.currentBet,
        won: isWin,
        amount: isWin ? winAmount : shared.currentBet,
        multiplier,
      });

      setGameResult({
        isVisible: true,
        isWin,
        amount: isWin ? winAmount : shared.currentBet,
        multiplier,
        gameType: "reaction",
        message: `${Math.round(reactionTime)}ms`,
      });
    }
  }, [reactionGame.phase, shared.currentBet, addXP, addToHistory]);

  // ====== MEMORY GAME LOGIC - FIXED INTERVALS ======
  const startMemoryGame = useCallback(() => {
    if (shared.currentBet > shared.balance) {
      toast.error("Insufficient balance");
      return;
    }

    // Clear any existing intervals/timeouts
    if (memoryIntervalRef.current) clearInterval(memoryIntervalRef.current);
    if (memoryTimeoutRef.current) clearTimeout(memoryTimeoutRef.current);

    setShared(prev => ({ 
      ...prev, 
      balance: prev.balance - prev.currentBet,
      totalWagered: prev.totalWagered + prev.currentBet,
      gamesPlayed: prev.gamesPlayed + 1,
    }));

    const sequence = Array.from({ length: 3 }, () => Math.floor(Math.random() * 4));

    setMemoryGame({
      isPlaying: true,
      phase: "showing",
      sequence,
      userSequence: [],
      currentShowIndex: 0,
      level: 1,
      multiplier: 1.5,
    });

    // Show sequence with proper cleanup
    let index = 0;
    memoryIntervalRef.current = setInterval(() => {
      setMemoryGame(prev => ({ ...prev, currentShowIndex: index }));
      index++;
      if (index >= sequence.length) {
        if (memoryIntervalRef.current) clearInterval(memoryIntervalRef.current);
        memoryTimeoutRef.current = setTimeout(() => {
          setMemoryGame(prev => ({ ...prev, phase: "input", currentShowIndex: -1 }));
        }, 600);
      }
    }, 800);
  }, [shared.currentBet, shared.balance]);

  const inputMemory = useCallback((buttonIndex: number) => {
    if (memoryGame.phase !== "input") return;

    const newUserSequence = [...memoryGame.userSequence, buttonIndex];
    const currentIndex = newUserSequence.length - 1;

    if (buttonIndex !== memoryGame.sequence[currentIndex]) {
      setMemoryGame(prev => ({ ...prev, isPlaying: false, phase: "result" }));
      setShared(prev => ({ ...prev, streak: 0 }));

      addToHistory({
        gameType: "memory",
        bet: shared.currentBet,
        won: false,
        amount: shared.currentBet,
        multiplier: memoryGame.multiplier,
      });

      setGameResult({
        isVisible: true,
        isWin: false,
        amount: shared.currentBet,
        multiplier: memoryGame.multiplier,
        gameType: "memory",
        message: `Level ${memoryGame.level}`,
      });
      return;
    }

    setMemoryGame(prev => ({ ...prev, userSequence: newUserSequence }));

    if (newUserSequence.length === memoryGame.sequence.length) {
      const newLevel = memoryGame.level + 1;
      const newMultiplier = Number((1.5 * Math.pow(1.5, memoryGame.level)).toFixed(2));

      if (newLevel > 5) {
        const winAmount = Math.floor(shared.currentBet * newMultiplier);
        setShared(prev => ({
          ...prev,
          balance: prev.balance + winAmount,
          totalWon: prev.totalWon + winAmount,
          biggestWin: Math.max(prev.biggestWin, winAmount),
          streak: prev.streak + 1,
        }));
        addXP(100);

        setMemoryGame(prev => ({ ...prev, isPlaying: false }));

        addToHistory({
          gameType: "memory",
          bet: shared.currentBet,
          won: true,
          amount: winAmount,
          multiplier: newMultiplier,
        });
        
        setGameResult({
          isVisible: true,
          isWin: true,
          amount: winAmount,
          multiplier: newMultiplier,
          gameType: "memory",
          message: "Perfect memory!",
        });
        return;
      }

      const newSequence = [...memoryGame.sequence, Math.floor(Math.random() * 4)];

      setMemoryGame({
        isPlaying: true,
        phase: "showing",
        sequence: newSequence,
        userSequence: [],
        currentShowIndex: 0,
        level: newLevel,
        multiplier: newMultiplier,
      });

      addXP(20);
      toast.success(`Level ${newLevel}! ${newMultiplier}x`, { icon: "🧠" });

      // Clear previous intervals
      if (memoryIntervalRef.current) clearInterval(memoryIntervalRef.current);
      if (memoryTimeoutRef.current) clearTimeout(memoryTimeoutRef.current);

      let index = 0;
      memoryTimeoutRef.current = setTimeout(() => {
        memoryIntervalRef.current = setInterval(() => {
          setMemoryGame(prev => ({ ...prev, currentShowIndex: index }));
          index++;
          if (index >= newSequence.length) {
            if (memoryIntervalRef.current) clearInterval(memoryIntervalRef.current);
            memoryTimeoutRef.current = setTimeout(() => {
              setMemoryGame(prev => ({ ...prev, phase: "input", currentShowIndex: -1 }));
            }, 600);
          }
        }, 700);
      }, 500);
    }
  }, [memoryGame, shared.currentBet, addXP, addToHistory]);

  const cashOutMemory = useCallback(() => {
    if (!memoryGame.isPlaying || memoryGame.level < 2) return;

    // Clear intervals
    if (memoryIntervalRef.current) clearInterval(memoryIntervalRef.current);
    if (memoryTimeoutRef.current) clearTimeout(memoryTimeoutRef.current);

    const winAmount = Math.floor(shared.currentBet * memoryGame.multiplier);

    setShared(prev => ({
      ...prev,
      balance: prev.balance + winAmount,
      totalWon: prev.totalWon + winAmount,
      biggestWin: Math.max(prev.biggestWin, winAmount),
      streak: prev.streak + 1,
    }));

    setMemoryGame(prev => ({ ...prev, isPlaying: false }));
    addXP(30 * memoryGame.level);

    addToHistory({
      gameType: "memory",
      bet: shared.currentBet,
      won: true,
      amount: winAmount,
      multiplier: memoryGame.multiplier,
    });

    setGameResult({
      isVisible: true,
      isWin: true,
      amount: winAmount,
      multiplier: memoryGame.multiplier,
      gameType: "memory",
      message: `Level ${memoryGame.level}`,
    });
  }, [memoryGame, shared.currentBet, addXP, addToHistory]);

  // ====== CRASH GAME LOGIC - COMPLETELY FIXED ======
  const startCrashGame = useCallback(() => {
    if (shared.currentBet > shared.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setShared(prev => ({ 
      ...prev, 
      balance: prev.balance - prev.currentBet,
      totalWagered: prev.totalWagered + prev.currentBet,
      gamesPlayed: prev.gamesPlayed + 1,
    }));

    const random = Math.random();
    const crashPoint = Math.max(1.0, Number((0.99 / (1 - random * 0.99)).toFixed(2)));

    setCrashGame({
      isPlaying: true,
      phase: "running",
      multiplier: 1.0,
      crashPoint,
      cashedOut: false,
      cashOutMultiplier: 1.0,
    });

    crashStartTimeRef.current = performance.now();
    isCrashRunningRef.current = true;

    const tick = () => {
      if (!isCrashRunningRef.current) return;

      const elapsed = (performance.now() - crashStartTimeRef.current) / 1000;
      const currentMult = Number((1 + elapsed * 0.5 + Math.pow(elapsed, 1.5) * 0.1).toFixed(2));

      if (currentMult >= crashPoint) {
        isCrashRunningRef.current = false;
        
        setCrashGame(prev => {
          const cashedOut = prev.cashedOut;
          
          if (!cashedOut) {
            setShared(prevShared => ({ ...prevShared, streak: 0 }));
            
            addToHistory({
              gameType: "crash",
              bet: shared.currentBet,
              won: false,
              amount: shared.currentBet,
              multiplier: crashPoint,
            });

            setTimeout(() => {
              setGameResult({
                isVisible: true,
                isWin: false,
                amount: shared.currentBet,
                multiplier: crashPoint,
                gameType: "crash",
                message: `Crashed at ${crashPoint}x`,
              });
            }, 100);
          }

          return {
            ...prev,
            isPlaying: false,
            phase: "crashed",
            multiplier: crashPoint,
          };
        });
        return;
      }

      setCrashGame(prev => {
        if (!prev.cashedOut && prev.phase === "running") {
          return { ...prev, multiplier: currentMult };
        }
        return prev;
      });

      if (isCrashRunningRef.current) {
        crashRAFRef.current = requestAnimationFrame(tick);
      }
    };

    crashRAFRef.current = requestAnimationFrame(tick);
  }, [shared.currentBet, shared.balance, addToHistory]);

  const cashOutCrash = useCallback(() => {
    setCrashGame(prev => {
      if (!prev.isPlaying || prev.cashedOut || prev.phase !== "running") return prev;

      const winAmount = Math.floor(shared.currentBet * prev.multiplier);

      isCrashRunningRef.current = false;
      if (crashRAFRef.current) cancelAnimationFrame(crashRAFRef.current);

      setShared(prevShared => ({
        ...prevShared,
        balance: prevShared.balance + winAmount,
        totalWon: prevShared.totalWon + winAmount,
        biggestWin: Math.max(prevShared.biggestWin, winAmount),
        streak: prevShared.streak + 1,
      }));

      addXP(Math.floor(prev.multiplier * 20));

      addToHistory({
        gameType: "crash",
        bet: shared.currentBet,
        won: true,
        amount: winAmount,
        multiplier: prev.multiplier,
      });

      setGameResult({
        isVisible: true,
        isWin: true,
        amount: winAmount,
        multiplier: prev.multiplier,
        gameType: "crash",
        message: `Cashed out at ${prev.multiplier}x`,
      });

      return {
        ...prev,
        cashedOut: true,
        cashOutMultiplier: prev.multiplier,
      };
    });
  }, [shared.currentBet, addXP, addToHistory]);

  // Play again handlers
  const playAgain = useCallback(() => {
    closeResult();
    setTimeout(() => {
      switch (activeGame) {
        case "cups":
          startCupGame();
          break;
        case "reaction":
          startReactionGame();
          break;
        case "memory":
          startMemoryGame();
          break;
        case "crash":
          startCrashGame();
          break;
      }
    }, 300);
  }, [activeGame, closeResult, startCupGame, startReactionGame, startMemoryGame, startCrashGame]);

  // Refill balance
  const refillBalance = useCallback(() => {
    setShared(prev => ({
      ...prev,
      balance: INITIAL_BALANCE,
      currentBet: Math.min(100, INITIAL_BALANCE),
    }));
    toast.success("Balance refilled!", { 
      description: `${INITIAL_BALANCE.toLocaleString()} credits added`,
      icon: "💰" 
    });
  }, []);

  // Mock wallet
  const connectWallet = useCallback(() => {
    toast.success("Wallet connected!", { description: "0x1234...5678" });
  }, []);

  return {
    // Shared
    ...shared,
    activeGame,
    setActiveGame,
    setBetAmount,
    gameResult,
    closeResult,
    playAgain,
    refillBalance,
    connectWallet,
    isConnected: true,
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    winRate,
    gameHistory,
    
    // Cup game
    cupGame,
    startCupGame,
    selectCup,
    cashOutCups,
    
    // Reaction game
    reactionGame,
    startReactionGame,
    hitReaction,
    
    // Memory game
    memoryGame,
    startMemoryGame,
    inputMemory,
    cashOutMemory,
    
    // Crash game
    crashGame,
    startCrashGame,
    cashOutCrash,
  };
};
