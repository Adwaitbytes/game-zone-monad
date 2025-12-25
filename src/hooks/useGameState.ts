import { useState, useCallback } from "react";
import { toast } from "sonner";

interface GameState {
  balance: number;
  currentBet: number;
  multiplier: number;
  round: number;
  isPlaying: boolean;
  selectedCup: number | null;
  revealedCups: number[];
  lethalCup: number | null;
  streak: number;
  xp: number;
  level: number;
  gameResult: {
    isVisible: boolean;
    isWin: boolean;
    amount: number;
    multiplier: number;
    round: number;
  };
}

const INITIAL_STATE: GameState = {
  balance: 10000,
  currentBet: 100,
  multiplier: 1.0,
  round: 0,
  isPlaying: false,
  selectedCup: null,
  revealedCups: [],
  lethalCup: null,
  streak: 0,
  xp: 0,
  level: 1,
  gameResult: {
    isVisible: false,
    isWin: false,
    amount: 0,
    multiplier: 1,
    round: 0,
  },
};

const CUPS_COUNT = 3;

const calculateMultiplier = (round: number): number => {
  // Multiplier increases exponentially with each round
  return Number((1 + round * 0.5 + Math.pow(round, 1.3) * 0.1).toFixed(2));
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const setBetAmount = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, currentBet: amount }));
  }, []);

  const startGame = useCallback(() => {
    if (state.currentBet > state.balance) {
      toast.error("Insufficient balance");
      return;
    }

    // Determine lethal cup
    const lethal = Math.floor(Math.random() * CUPS_COUNT);

    setState((prev) => ({
      ...prev,
      isPlaying: true,
      round: 1,
      multiplier: calculateMultiplier(1),
      balance: prev.balance - prev.currentBet,
      selectedCup: null,
      revealedCups: [],
      lethalCup: lethal,
    }));

    toast("Game started! Select a cup...", {
      icon: "🎰",
    });
  }, [state.currentBet, state.balance]);

  const selectCup = useCallback((cupIndex: number) => {
    if (!state.isPlaying || state.revealedCups.includes(cupIndex)) return;

    setState((prev) => ({ ...prev, selectedCup: cupIndex }));

    // Check if selected cup is lethal
    if (cupIndex === state.lethalCup) {
      // Player loses
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          revealedCups: [...prev.revealedCups, cupIndex],
          isPlaying: false,
          streak: 0,
          gameResult: {
            isVisible: true,
            isWin: false,
            amount: prev.currentBet,
            multiplier: prev.multiplier,
            round: prev.round,
          },
        }));
      }, 500);
    } else {
      // Player survives - advance to next round
      setTimeout(() => {
        const newRound = state.round + 1;
        const newMultiplier = calculateMultiplier(newRound);
        
        // Generate new lethal cup for next round
        const newLethal = Math.floor(Math.random() * CUPS_COUNT);

        setState((prev) => ({
          ...prev,
          revealedCups: [...prev.revealedCups, cupIndex],
          round: newRound,
          multiplier: newMultiplier,
          lethalCup: newLethal,
          selectedCup: null,
          xp: prev.xp + 50,
          level: Math.floor((prev.xp + 50) / 1000) + 1,
        }));

        toast.success(`Round ${newRound}! Multiplier: ${newMultiplier}x`, {
          icon: "⚡",
        });
      }, 800);
    }
  }, [state.isPlaying, state.revealedCups, state.lethalCup, state.round]);

  const cashOut = useCallback(() => {
    if (!state.isPlaying || state.round < 1) return;

    const winAmount = Math.floor(state.currentBet * state.multiplier);

    setState((prev) => ({
      ...prev,
      isPlaying: false,
      balance: prev.balance + winAmount,
      streak: prev.streak + 1,
      xp: prev.xp + 100 + state.round * 20,
      level: Math.floor((prev.xp + 100 + state.round * 20) / 1000) + 1,
      gameResult: {
        isVisible: true,
        isWin: true,
        amount: winAmount,
        multiplier: prev.multiplier,
        round: prev.round,
      },
    }));

    toast.success(`Cashed out ${winAmount.toLocaleString()} MON!`, {
      icon: "💰",
    });
  }, [state.isPlaying, state.round, state.currentBet, state.multiplier]);

  const closeResult = useCallback(() => {
    setState((prev) => ({
      ...prev,
      gameResult: { ...prev.gameResult, isVisible: false },
      revealedCups: [],
      selectedCup: null,
    }));
  }, []);

  const playAgain = useCallback(() => {
    closeResult();
    setTimeout(() => startGame(), 300);
  }, [closeResult, startGame]);

  const connectWallet = useCallback(() => {
    // Mock wallet connection
    toast.success("Wallet connected!", {
      icon: "🔗",
      description: "0x1234...5678",
    });
  }, []);

  return {
    ...state,
    cupsCount: CUPS_COUNT,
    setBetAmount,
    startGame,
    selectCup,
    cashOut,
    closeResult,
    playAgain,
    connectWallet,
    canCashOut: state.isPlaying && state.round >= 1,
    isConnected: true, // Mock connected state
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
  };
};
