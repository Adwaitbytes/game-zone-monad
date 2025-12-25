import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export type GameType = "cups" | "reaction" | "memory" | "crash";

interface SharedGameState {
  balance: number;
  currentBet: number;
  xp: number;
  level: number;
  streak: number;
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

const INITIAL_BALANCE = 10000;
const XP_PER_LEVEL = 1000;

export const useGameState = () => {
  // Shared state
  const [shared, setShared] = useState<SharedGameState>({
    balance: INITIAL_BALANCE,
    currentBet: 100,
    xp: 0,
    level: 1,
    streak: 0,
  });

  const [activeGame, setActiveGame] = useState<GameType>("cups");
  
  // Cup game state
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

  // Reaction game state
  const [reactionGame, setReactionGame] = useState<ReactionGameState>({
    isPlaying: false,
    phase: "waiting",
    targetTime: 0,
    reactionTime: null,
    multiplier: 1.0,
  });

  // Memory game state  
  const [memoryGame, setMemoryGame] = useState<MemoryGameState>({
    isPlaying: false,
    phase: "showing",
    sequence: [],
    userSequence: [],
    currentShowIndex: -1,
    level: 1,
    multiplier: 1.0,
  });

  // Crash game state
  const [crashGame, setCrashGame] = useState<CrashGameState>({
    isPlaying: false,
    phase: "betting",
    multiplier: 1.0,
    crashPoint: 0,
    cashedOut: false,
    cashOutMultiplier: 1.0,
  });

  // Game result modal
  const [gameResult, setGameResult] = useState<GameResult>({
    isVisible: false,
    isWin: false,
    amount: 0,
    multiplier: 1,
    gameType: "cups",
  });

  // Timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Calculate multiplier for cup game (higher risk, higher reward)
  const calculateCupMultiplier = (round: number, cupsCount: number): number => {
    // Base: 1/(cupsCount-1) chance of survival per round
    // Multiplier = (cupsCount/(cupsCount-1))^round with house edge
    const baseMultiplier = Math.pow(cupsCount / (cupsCount - 1), round);
    const houseEdge = 0.97; // 3% house edge
    return Number((baseMultiplier * houseEdge).toFixed(2));
  };

  // Shared functions
  const setBetAmount = useCallback((amount: number) => {
    setShared(prev => ({ ...prev, currentBet: Math.max(10, Math.min(prev.balance, amount)) }));
  }, []);

  const addXP = useCallback((amount: number) => {
    setShared(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  // Close result modal
  const closeResult = useCallback(() => {
    setGameResult(prev => ({ ...prev, isVisible: false }));
  }, []);

  // ====== CUP GAME LOGIC ======
  const startCupGame = useCallback(() => {
    if (shared.currentBet > shared.balance) {
      toast.error("Insufficient balance");
      return;
    }

    // Place bet
    setShared(prev => ({ ...prev, balance: prev.balance - prev.currentBet }));

    // Generate bomb position
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
  }, [shared.currentBet, shared.balance]);

  const selectCup = useCallback((cupIndex: number) => {
    if (!cupGame.isPlaying || cupGame.revealedCup !== null) return;

    setCupGame(prev => ({ ...prev, selectedCup: cupIndex }));

    // Reveal after short delay
    setTimeout(() => {
      const hitBomb = cupIndex === cupGame.bombPosition;

      if (hitBomb) {
        // LOSS
        setCupGame(prev => ({ ...prev, revealedCup: cupIndex, isPlaying: false }));
        setShared(prev => ({ ...prev, streak: 0 }));
        
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
        // Survived - advance round
        const newRound = cupGame.round + 1;
        const newMultiplier = calculateCupMultiplier(newRound, 3);
        const newBombPos = Math.floor(Math.random() * 3);

        setCupGame(prev => ({
          ...prev,
          revealedCup: cupIndex,
        }));

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
  }, [cupGame, shared.currentBet, addXP]);

  const cashOutCups = useCallback(() => {
    if (!cupGame.isPlaying || !cupGame.canCashOut) return;

    const winAmount = Math.floor(shared.currentBet * cupGame.multiplier);

    setShared(prev => ({
      ...prev,
      balance: prev.balance + winAmount,
      streak: prev.streak + 1,
    }));

    setCupGame(prev => ({ ...prev, isPlaying: false, canCashOut: false }));
    addXP(50 * cupGame.round);

    setGameResult({
      isVisible: true,
      isWin: true,
      amount: winAmount,
      multiplier: cupGame.multiplier,
      gameType: "cups",
      message: `Survived ${cupGame.round} rounds`,
    });
  }, [cupGame, shared.currentBet, addXP]);

  // ====== REACTION GAME LOGIC ======
  const startReactionGame = useCallback(() => {
    if (shared.currentBet > shared.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setShared(prev => ({ ...prev, balance: prev.balance - prev.currentBet }));

    setReactionGame({
      isPlaying: true,
      phase: "ready",
      targetTime: 0,
      reactionTime: null,
      multiplier: 1.0,
    });

    // Random delay before "GO"
    const delay = 1500 + Math.random() * 3000;
    
    timerRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setReactionGame(prev => ({ ...prev, phase: "go" }));
    }, delay);
  }, [shared.currentBet, shared.balance]);

  const hitReaction = useCallback(() => {
    if (reactionGame.phase === "ready") {
      // Too early!
      if (timerRef.current) clearTimeout(timerRef.current);
      
      setReactionGame(prev => ({
        ...prev,
        isPlaying: false,
        phase: "result",
        reactionTime: -1,
        multiplier: 0,
      }));

      setShared(prev => ({ ...prev, streak: 0 }));

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
      const reactionTime = Date.now() - startTimeRef.current;
      
      // Calculate multiplier based on reaction time
      // < 150ms = 5x, 150-200ms = 3x, 200-300ms = 2x, 300-400ms = 1.5x, 400-500ms = 1.2x, >500ms = lose
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
        reactionTime,
        multiplier,
      });

      if (isWin) {
        setShared(prev => ({
          ...prev,
          balance: prev.balance + winAmount,
          streak: prev.streak + 1,
        }));
        addXP(30 * multiplier);
      } else {
        setShared(prev => ({ ...prev, streak: 0 }));
      }

      setGameResult({
        isVisible: true,
        isWin,
        amount: isWin ? winAmount : shared.currentBet,
        multiplier,
        gameType: "reaction",
        message: `${reactionTime}ms`,
      });
    }
  }, [reactionGame.phase, shared.currentBet, addXP]);

  // ====== MEMORY GAME LOGIC ======
  const startMemoryGame = useCallback(() => {
    if (shared.currentBet > shared.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setShared(prev => ({ ...prev, balance: prev.balance - prev.currentBet }));

    // Generate initial sequence (3 elements)
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

    // Show sequence
    let index = 0;
    const showInterval = setInterval(() => {
      setMemoryGame(prev => ({ ...prev, currentShowIndex: index }));
      index++;
      if (index >= sequence.length) {
        clearInterval(showInterval);
        setTimeout(() => {
          setMemoryGame(prev => ({ ...prev, phase: "input", currentShowIndex: -1 }));
        }, 600);
      }
    }, 800);
  }, [shared.currentBet, shared.balance]);

  const inputMemory = useCallback((buttonIndex: number) => {
    if (memoryGame.phase !== "input") return;

    const newUserSequence = [...memoryGame.userSequence, buttonIndex];
    const currentIndex = newUserSequence.length - 1;

    // Check if correct
    if (buttonIndex !== memoryGame.sequence[currentIndex]) {
      // Wrong!
      setMemoryGame(prev => ({ ...prev, isPlaying: false, phase: "result" }));
      setShared(prev => ({ ...prev, streak: 0 }));

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

    // Completed sequence?
    if (newUserSequence.length === memoryGame.sequence.length) {
      const newLevel = memoryGame.level + 1;
      const newMultiplier = Number((1.5 * Math.pow(1.5, memoryGame.level)).toFixed(2));

      if (newLevel > 5) {
        // Max level reached - auto win
        const winAmount = Math.floor(shared.currentBet * newMultiplier);
        setShared(prev => ({
          ...prev,
          balance: prev.balance + winAmount,
          streak: prev.streak + 1,
        }));
        addXP(100);

        setMemoryGame(prev => ({ ...prev, isPlaying: false }));
        
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

      // Next level - add to sequence
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

      // Show new sequence
      let index = 0;
      setTimeout(() => {
        const showInterval = setInterval(() => {
          setMemoryGame(prev => ({ ...prev, currentShowIndex: index }));
          index++;
          if (index >= newSequence.length) {
            clearInterval(showInterval);
            setTimeout(() => {
              setMemoryGame(prev => ({ ...prev, phase: "input", currentShowIndex: -1 }));
            }, 600);
          }
        }, 700);
      }, 500);
    }
  }, [memoryGame, shared.currentBet, addXP]);

  const cashOutMemory = useCallback(() => {
    if (!memoryGame.isPlaying || memoryGame.level < 2) return;

    const winAmount = Math.floor(shared.currentBet * memoryGame.multiplier);

    setShared(prev => ({
      ...prev,
      balance: prev.balance + winAmount,
      streak: prev.streak + 1,
    }));

    setMemoryGame(prev => ({ ...prev, isPlaying: false }));
    addXP(30 * memoryGame.level);

    setGameResult({
      isVisible: true,
      isWin: true,
      amount: winAmount,
      multiplier: memoryGame.multiplier,
      gameType: "memory",
      message: `Level ${memoryGame.level}`,
    });
  }, [memoryGame, shared.currentBet, addXP]);

  // ====== CRASH GAME LOGIC ======
  const startCrashGame = useCallback(() => {
    if (shared.currentBet > shared.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setShared(prev => ({ ...prev, balance: prev.balance - prev.currentBet }));

    // Generate crash point (house edge built in)
    // Using formula: crashPoint = 0.99 / (1 - random)
    // This creates an exponential distribution favoring lower values
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

    // Start multiplier climb
    const startTime = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentMult = Number((1 + elapsed * 0.5 + Math.pow(elapsed, 1.5) * 0.1).toFixed(2));

      if (currentMult >= crashPoint) {
        // CRASH!
        setCrashGame(prev => ({
          ...prev,
          isPlaying: false,
          phase: "crashed",
          multiplier: crashPoint,
        }));

        if (!crashGame.cashedOut) {
          setShared(prev => ({ ...prev, streak: 0 }));
          setGameResult({
            isVisible: true,
            isWin: false,
            amount: shared.currentBet,
            multiplier: crashPoint,
            gameType: "crash",
            message: `Crashed at ${crashPoint}x`,
          });
        }
        return;
      }

      setCrashGame(prev => {
        if (prev.cashedOut || prev.phase === "crashed") return prev;
        return { ...prev, multiplier: currentMult };
      });

      if (!crashGame.cashedOut && crashGame.phase === "running") {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [shared.currentBet, shared.balance, crashGame.cashedOut, crashGame.phase]);

  const cashOutCrash = useCallback(() => {
    if (!crashGame.isPlaying || crashGame.cashedOut || crashGame.phase !== "running") return;

    const winAmount = Math.floor(shared.currentBet * crashGame.multiplier);

    setCrashGame(prev => ({
      ...prev,
      cashedOut: true,
      cashOutMultiplier: prev.multiplier,
    }));

    setShared(prev => ({
      ...prev,
      balance: prev.balance + winAmount,
      streak: prev.streak + 1,
    }));

    addXP(Math.floor(crashGame.multiplier * 20));

    setGameResult({
      isVisible: true,
      isWin: true,
      amount: winAmount,
      multiplier: crashGame.multiplier,
      gameType: "crash",
      message: `Cashed out at ${crashGame.multiplier}x`,
    });
  }, [crashGame, shared.currentBet, addXP]);

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
    connectWallet,
    isConnected: true,
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    
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