import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import Cup from "./Cup";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { GlowButton } from "@/components/ui/GlowButton";
import { Wallet, Zap, Trophy, Target, Sparkles } from "lucide-react";
import { soundManager } from "@/lib/soundManager";

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

interface CupGameProps {
  gameState: CupGameState;
  currentBet: number;
  balance: number;
  onSelectCup: (index: number) => void;
  onStart: () => void;
  onCashOut: () => void;
  onBetChange: (amount: number) => void;
}

// Multiplier progression for display
const ROUND_MULTIPLIERS = [
  { round: 1, multiplier: 1.47, color: "from-blue-500 to-cyan-500" },
  { round: 2, multiplier: 2.21, color: "from-green-500 to-emerald-500" },
  { round: 3, multiplier: 3.31, color: "from-yellow-500 to-orange-500" },
  { round: 4, multiplier: 4.97, color: "from-orange-500 to-red-500" },
  { round: 5, multiplier: 7.45, color: "from-red-500 to-pink-500" },
  { round: 6, multiplier: 11.18, color: "from-purple-500 to-violet-500" },
];

const CupGame = ({
  gameState,
  currentBet,
  balance,
  onSelectCup,
  onStart,
  onCashOut,
  onBetChange,
}: CupGameProps) => {
  const { round, multiplier, isPlaying, selectedCup, revealedCup, bombPosition, cupsCount, canCashOut } = gameState;
  const potentialWin = Math.floor(currentBet * multiplier);
  const betPresets = [50, 100, 250, 500];

  const handleStart = () => {
    soundManager.play('start');
    onStart();
  };

  const handleCashOut = () => {
    soundManager.play('cashout');
    onCashOut();
  };

  const handleBetChange = (amount: number) => {
    soundManager.play('click');
    onBetChange(amount);
  };

  const handleSelectCup = (index: number) => {
    soundManager.play('click');
    onSelectCup(index);
  };

  return (
    <div className="space-y-6">
      {/* Multiplier ladder */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {ROUND_MULTIPLIERS.map((item, i) => (
            <motion.div
              key={item.round}
              className={`relative flex-1 h-12 sm:h-14 rounded-xl flex flex-col items-center justify-center overflow-hidden ${
                round === item.round && isPlaying
                  ? `bg-gradient-to-br ${item.color}`
                  : round > item.round && isPlaying
                    ? "bg-green-600/40 border-2 border-green-500"
                    : "bg-slate-800/60"
              }`}
              animate={round === item.round && isPlaying ? {
                scale: [1, 1.05, 1],
                boxShadow: ["0 0 0 rgba(255,255,255,0)", "0 0 20px rgba(255,255,255,0.3)", "0 0 0 rgba(255,255,255,0)"]
              } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {round > item.round && isPlaying && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-green-400 text-lg">✓</span>
                </motion.div>
              )}
              <span className={`text-xs font-bold ${round >= item.round && isPlaying ? "text-white" : "text-slate-500"}`}>
                R{item.round}
              </span>
              <span className={`text-xs sm:text-sm font-bold ${round >= item.round && isPlaying ? "text-white" : "text-slate-400"}`}>
                {item.multiplier}x
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Main game stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <GlassCard className="py-4 px-2 text-center relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <div className="relative">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-3 h-3 text-purple-400" />
              <p className="text-[10px] sm:text-xs text-purple-300 uppercase tracking-wider">Round</p>
            </div>
            <NeonText variant="accent" className="text-2xl sm:text-3xl font-black">
              {isPlaying ? round : "-"}
            </NeonText>
          </div>
        </GlassCard>

        <GlassCard variant="primary" className="py-4 px-2 text-center relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent"
            animate={{ opacity: isPlaying ? [0.3, 0.7, 0.3] : 0.3 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <div className="relative">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <p className="text-[10px] sm:text-xs text-emerald-300 uppercase tracking-wider">Multiplier</p>
            </div>
            <NeonText variant="primary" className="text-2xl sm:text-3xl font-black">
              {multiplier.toFixed(2)}x
            </NeonText>
          </div>
        </GlassCard>

        <GlassCard className="py-4 px-2 text-center relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent"
            animate={{ opacity: canCashOut ? [0.3, 0.8, 0.3] : 0.3 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <div className="relative">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <p className="text-[10px] sm:text-xs text-amber-300 uppercase tracking-wider">Win</p>
            </div>
            <NeonText variant="accent" className="text-2xl sm:text-3xl font-black text-amber-400">
              {isPlaying ? potentialWin.toLocaleString() : "-"}
            </NeonText>
          </div>
        </GlassCard>
      </div>

      {/* Cups arena */}
      <GlassCard variant="elevated" className="py-8 sm:py-12 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 blur-3xl"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ rotate: { repeat: Infinity, duration: 20, ease: "linear" }, scale: { repeat: Infinity, duration: 5 } }}
          />
        </div>

        {/* Table surface */}
        <div className="relative mb-8">
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-900/80 to-transparent rounded-b-3xl" />
          
          <div className="flex items-end justify-center gap-3 sm:gap-6 md:gap-8 pb-4">
            {Array.from({ length: cupsCount }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                <Cup
                  index={index}
                  isSelected={selectedCup === index}
                  isRevealed={revealedCup === index}
                  isBomb={bombPosition === index && revealedCup === index}
                  isDisabled={!isPlaying || revealedCup !== null}
                  onSelect={() => handleSelectCup(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Game status with animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isPlaying ? (revealedCup !== null ? "revealed" : "playing") : "idle"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            {!isPlaying && (
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <Sparkles className="w-4 h-4" />
                <span>Place your bet and start the game</span>
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            {isPlaying && revealedCup === null && (
              <div className="space-y-2">
                <motion.p
                  className="text-lg font-semibold bg-gradient-to-r from-rose-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  🎯 Choose wisely! One cup hides a bomb 💣
                </motion.p>
                <p className="text-xs text-slate-500">Click on a cup to make your choice</p>
              </div>
            )}
            {isPlaying && revealedCup !== null && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-2xl"
                >
                  ⏳
                </motion.span>
                <span className="text-slate-300">Revealing...</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </GlassCard>

      {/* Controls */}
      <GlassCard variant="elevated" className="p-5 sm:p-6 space-y-5">
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div
              key="betting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Bet amount header */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Bet Amount</span>
                <span className="text-sm text-slate-400">
                  <span className="text-emerald-400 font-semibold">{balance.toLocaleString()}</span> available
                </span>
              </div>
              
              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2">
                {betPresets.map((preset) => (
                  <motion.button
                    key={preset}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${
                      currentBet === preset
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700"
                    }`}
                    onClick={() => handleBetChange(Math.min(preset, balance))}
                    disabled={preset > balance}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {preset}
                  </motion.button>
                ))}
              </div>

              {/* Half / Max buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  className="py-3 rounded-xl font-semibold text-sm bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-slate-700"
                  onClick={() => handleBetChange(Math.floor(balance / 2))}
                  disabled={balance < 20}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ½ Half
                </motion.button>
                <motion.button
                  className="py-3 rounded-xl font-semibold text-sm bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-slate-700"
                  onClick={() => handleBetChange(balance)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Max
                </motion.button>
              </div>

              {/* Current bet display */}
              <div className="flex items-center justify-center gap-2 py-3 bg-slate-900/50 rounded-xl border border-slate-700">
                <span className="text-slate-400">Your bet:</span>
                <span className="text-xl font-bold text-white">{currentBet.toLocaleString()}</span>
              </div>

              {/* Start button */}
              <GlowButton
                variant="primary"
                size="xl"
                className="w-full py-4 text-lg font-bold"
                onClick={handleStart}
                disabled={currentBet > balance || currentBet <= 0}
                pulse
              >
                <Sparkles className="w-5 h-5" />
                Start Game
              </GlowButton>
            </motion.div>
          ) : (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GlowButton
                variant="accent"
                size="xl"
                className="w-full py-4 text-lg font-bold"
                onClick={handleCashOut}
                disabled={!canCashOut}
                pulse={canCashOut}
              >
                <Wallet className="w-5 h-5" />
                Cash Out {potentialWin.toLocaleString()}
              </GlowButton>

              {!canCashOut && (
                <p className="text-center text-xs text-slate-500 mt-3">
                  Complete at least one round to cash out
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
};

export default memo(CupGame);