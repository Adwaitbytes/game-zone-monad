import { motion, AnimatePresence } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { GlowButton } from "@/components/ui/GlowButton";
import { Zap, Timer, Trophy, Target, AlertCircle } from "lucide-react";
import { soundManager } from "@/lib/soundManager";
import { cn } from "@/lib/utils";

interface ReactionGameState {
  isPlaying: boolean;
  phase: "waiting" | "ready" | "go" | "result";
  targetTime: number;
  reactionTime: number | null;
  multiplier: number;
}

interface ReactionGameProps {
  gameState: ReactionGameState;
  currentBet: number;
  balance: number;
  onStart: () => void;
  onHit: () => void;
  onBetChange: (amount: number) => void;
}

const REWARD_TIERS = [
  { maxMs: 150, mult: 5.0, label: "LEGENDARY", color: "from-amber-400 to-yellow-500", icon: "⚡" },
  { maxMs: 200, mult: 3.0, label: "EPIC", color: "from-purple-400 to-violet-500", icon: "🔥" },
  { maxMs: 250, mult: 2.0, label: "GREAT", color: "from-blue-400 to-cyan-500", icon: "✨" },
  { maxMs: 350, mult: 1.5, label: "GOOD", color: "from-emerald-400 to-green-500", icon: "👍" },
  { maxMs: 500, mult: 1.2, label: "OK", color: "from-gray-400 to-slate-500", icon: "👌" },
];

const ReactionGame = ({
  gameState,
  currentBet,
  balance,
  onStart,
  onHit,
  onBetChange,
}: ReactionGameProps) => {
  const { isPlaying, phase, reactionTime } = gameState;
  const betPresets = [50, 100, 250, 500];
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleStart = () => {
    soundManager.play('start');
    onStart();
  };

  const handleHit = () => {
    if (phase === "go") {
      soundManager.play('click');
    }
    onHit();
  };

  const handleBetChange = (amount: number) => {
    soundManager.play('click');
    onBetChange(amount);
  };

  const getPhaseStyles = () => {
    switch (phase) {
      case "ready":
        return {
          bg: "bg-gradient-to-br from-rose-900/50 to-red-950/50",
          border: "border-red-500/50",
          text: "text-red-400",
          glow: "shadow-[0_0_100px_rgba(239,68,68,0.3)]",
        };
      case "go":
        return {
          bg: "bg-gradient-to-br from-emerald-900/50 to-green-950/50",
          border: "border-emerald-500/50",
          text: "text-emerald-400",
          glow: "shadow-[0_0_100px_rgba(16,185,129,0.5)]",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-muted/30 to-muted/10",
          border: "border-border/50",
          text: "text-muted-foreground",
          glow: "",
        };
    }
  };

  const styles = getPhaseStyles();

  return (
    <div className="space-y-6">
      {/* Reward Tiers */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Reaction Time Rewards</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {REWARD_TIERS.map((tier, index) => (
            <motion.div
              key={tier.label}
              className={cn(
                "relative p-2 rounded-xl text-center overflow-hidden",
                `bg-gradient-to-br ${tier.color} bg-opacity-20`
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative z-10">
                <span className="text-lg">{tier.icon}</span>
                <p className="text-lg font-bold text-white">{tier.mult}x</p>
                <p className="text-[10px] text-white/70">&lt;{tier.maxMs}ms</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Game Area */}
      <motion.button
        className={cn(
          "w-full h-72 sm:h-96 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 relative overflow-hidden",
          styles.bg,
          styles.border,
          styles.glow,
          (phase === "ready" || phase === "go") && "cursor-pointer",
          phase === "waiting" && "cursor-default"
        )}
        onClick={handleHit}
        disabled={!isPlaying || phase === "waiting"}
        whileTap={isPlaying && phase !== "waiting" ? { scale: 0.98 } : {}}
      >
        {/* Animated background rings */}
        {phase === "go" && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2 border-emerald-400/30"
                initial={{ width: 50, height: 50, opacity: 0.8 }}
                animate={{ 
                  width: [50, 400], 
                  height: [50, 400], 
                  opacity: [0.8, 0] 
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}

        <AnimatePresence mode="wait">
          {phase === "waiting" ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full bg-muted/30 border border-border flex items-center justify-center mx-auto mb-4">
                <Zap className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-xl text-muted-foreground">Ready to test your reflexes?</p>
              <p className="text-sm text-muted-foreground mt-2">Place your bet and start!</p>
            </motion.div>
          ) : phase === "ready" ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <motion.div
                className="w-28 h-28 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertCircle className="w-14 h-14 text-red-500" />
              </motion.div>
              <p className="text-3xl font-bold text-red-400">WAIT...</p>
              <p className="text-lg text-red-300 mt-2">Don't tap yet!</p>
            </motion.div>
          ) : phase === "go" ? (
            <motion.div
              key="go"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="text-center relative z-10"
            >
              <motion.div
                className="w-32 h-32 rounded-full bg-emerald-500/30 border-4 border-emerald-400 flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                <Zap className="w-16 h-16 text-emerald-400" />
              </motion.div>
              <motion.p 
                className="text-5xl font-black text-emerald-400"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              >
                TAP NOW!
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Timer className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">Game Over</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Controls */}
      <GlassCard variant="elevated" className="p-6 space-y-4">
        {!isPlaying ? (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Bet Amount</span>
                <span className="text-sm text-muted-foreground">{balance.toLocaleString()} available</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {betPresets.map((preset) => (
                  <GlowButton
                    key={preset}
                    variant={currentBet === preset ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => handleBetChange(Math.min(preset, balance))}
                    disabled={preset > balance}
                  >
                    {preset}
                  </GlowButton>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <GlowButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBetChange(Math.floor(balance / 2))}
                  disabled={balance < 20}
                >
                  ½ Half
                </GlowButton>
                <GlowButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBetChange(balance)}
                >
                  Max
                </GlowButton>
              </div>
            </div>

            <GlowButton
              variant="primary"
              size="xl"
              className="w-full h-14 text-lg"
              onClick={handleStart}
              disabled={currentBet > balance || currentBet <= 0}
              pulse
            >
              <Zap className="w-5 h-5" />
              Test Your Reflexes
            </GlowButton>

            <p className="text-xs text-center text-muted-foreground">
              ⚡ Wait for green, then tap as fast as you can! Faster reactions = higher multipliers
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <p className={cn(
              "text-lg font-medium",
              phase === "ready" ? "text-red-400" : "text-emerald-400"
            )}>
              {phase === "ready" ? "🔴 Wait for green..." : "🟢 TAP NOW!"}
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default memo(ReactionGame);