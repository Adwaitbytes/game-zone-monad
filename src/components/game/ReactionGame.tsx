import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { GlowButton } from "@/components/ui/GlowButton";
import { Zap } from "lucide-react";

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

const ReactionGame = ({
  gameState,
  currentBet,
  balance,
  onStart,
  onHit,
  onBetChange,
}: ReactionGameProps) => {
  const { isPlaying, phase } = gameState;
  const betPresets = [50, 100, 250, 500];

  const getPhaseColor = () => {
    if (phase === "ready") return "bg-secondary/20 border-secondary";
    if (phase === "go") return "bg-primary/30 border-primary animate-pulse";
    return "bg-card border-border";
  };

  const getPhaseText = () => {
    if (phase === "waiting") return "Get ready to test your reflexes";
    if (phase === "ready") return "Wait for green...";
    if (phase === "go") return "NOW! TAP!";
    return "Game Over";
  };

  return (
    <div className="space-y-6">
      {/* Multiplier table */}
      <GlassCard className="p-4">
        <p className="text-sm text-muted-foreground mb-3 text-center">Reaction Time Rewards</p>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 bg-primary/20 rounded-lg">
            <p className="text-primary font-bold">5x</p>
            <p className="text-muted-foreground">&lt;150ms</p>
          </div>
          <div className="p-2 bg-primary/15 rounded-lg">
            <p className="text-primary font-bold">3x</p>
            <p className="text-muted-foreground">&lt;200ms</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <p className="text-primary font-bold">2x</p>
            <p className="text-muted-foreground">&lt;250ms</p>
          </div>
          <div className="p-2 bg-accent/10 rounded-lg">
            <p className="text-accent font-bold">1.5x</p>
            <p className="text-muted-foreground">&lt;350ms</p>
          </div>
          <div className="p-2 bg-muted rounded-lg">
            <p className="text-muted-foreground font-bold">1.2x</p>
            <p className="text-muted-foreground">&lt;500ms</p>
          </div>
        </div>
      </GlassCard>

      {/* Game area */}
      <motion.button
        className={`w-full h-64 sm:h-80 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-4 ${getPhaseColor()}`}
        onClick={onHit}
        disabled={!isPlaying || phase === "waiting"}
        whileTap={isPlaying && phase !== "waiting" ? { scale: 0.98 } : {}}
      >
        <motion.div
          key={phase}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          {phase === "go" ? (
            <Zap className="w-20 h-20 text-primary mx-auto mb-4" />
          ) : phase === "ready" ? (
            <div className="w-20 h-20 rounded-full bg-secondary/30 border-2 border-secondary mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">⏳</span>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted/50 mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
          )}
          <p className={`text-xl font-bold ${phase === "go" ? "text-primary" : phase === "ready" ? "text-secondary" : "text-muted-foreground"}`}>
            {getPhaseText()}
          </p>
        </motion.div>
      </motion.button>

      {/* Controls */}
      <GlassCard variant="elevated" className="p-6 space-y-4">
        {!isPlaying ? (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bet Amount</span>
                <span className="text-sm text-muted-foreground">{balance.toLocaleString()} available</span>
              </div>
              
              <div className="flex gap-2">
                {betPresets.map((preset) => (
                  <GlowButton
                    key={preset}
                    variant={currentBet === preset ? "primary" : "ghost"}
                    size="sm"
                    className="flex-1"
                    onClick={() => onBetChange(Math.min(preset, balance))}
                    disabled={preset > balance}
                  >
                    {preset}
                  </GlowButton>
                ))}
              </div>
            </div>

            <GlowButton
              variant="primary"
              size="xl"
              className="w-full"
              onClick={onStart}
              disabled={currentBet > balance || currentBet <= 0}
              pulse
            >
              <Zap className="w-5 h-5" />
              Test Reflexes
            </GlowButton>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              {phase === "ready" ? "Wait for the signal..." : "TAP NOW!"}
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default ReactionGame;