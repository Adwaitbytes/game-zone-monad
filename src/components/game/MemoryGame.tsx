import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { GlowButton } from "@/components/ui/GlowButton";
import { Brain, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryGameState {
  isPlaying: boolean;
  phase: "showing" | "input" | "result";
  sequence: number[];
  userSequence: number[];
  currentShowIndex: number;
  level: number;
  multiplier: number;
}

interface MemoryGameProps {
  gameState: MemoryGameState;
  currentBet: number;
  balance: number;
  onStart: () => void;
  onInput: (index: number) => void;
  onCashOut: () => void;
  onBetChange: (amount: number) => void;
}

const COLORS = [
  { bg: "bg-blue-500", active: "bg-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)]" },
  { bg: "bg-green-500", active: "bg-green-400 shadow-[0_0_30px_rgba(34,197,94,0.5)]" },
  { bg: "bg-yellow-500", active: "bg-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.5)]" },
  { bg: "bg-red-500", active: "bg-red-400 shadow-[0_0_30px_rgba(239,68,68,0.5)]" },
];

const MemoryGame = ({
  gameState,
  currentBet,
  balance,
  onStart,
  onInput,
  onCashOut,
  onBetChange,
}: MemoryGameProps) => {
  const { isPlaying, phase, currentShowIndex, level, multiplier, sequence, userSequence } = gameState;
  const betPresets = [50, 100, 250, 500];
  const potentialWin = Math.floor(currentBet * multiplier);

  const isButtonActive = (index: number) => {
    if (phase === "showing") {
      return sequence[currentShowIndex] === index;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Game info */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <GlassCard className="py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Level</p>
          <NeonText variant="accent" className="text-2xl">{isPlaying ? level : "-"}</NeonText>
        </GlassCard>
        <GlassCard variant="primary" className="py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Multiplier</p>
          <NeonText variant="primary" className="text-2xl">{multiplier.toFixed(2)}x</NeonText>
        </GlassCard>
        <GlassCard className="py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Sequence</p>
          <NeonText variant="accent" className="text-2xl">{isPlaying ? `${userSequence.length}/${sequence.length}` : "-"}</NeonText>
        </GlassCard>
      </div>

      {/* Game board */}
      <GlassCard variant="elevated" className="p-6">
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          {COLORS.map((color, index) => (
            <motion.button
              key={index}
              className={cn(
                "aspect-square rounded-2xl transition-all duration-150",
                isButtonActive(index) ? color.active : color.bg,
                phase === "input" && "cursor-pointer hover:scale-105",
                phase !== "input" && "cursor-not-allowed opacity-70"
              )}
              onClick={() => phase === "input" && onInput(index)}
              whileTap={phase === "input" ? { scale: 0.95 } : {}}
              animate={isButtonActive(index) ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.2 }}
              disabled={phase !== "input"}
            />
          ))}
        </div>

        {/* Game status */}
        <motion.p
          className="text-center mt-6 text-muted-foreground"
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {!isPlaying && "Watch the pattern, then repeat it"}
          {phase === "showing" && "Watch carefully..."}
          {phase === "input" && "Your turn! Repeat the pattern"}
        </motion.p>
      </GlassCard>

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
              <Brain className="w-5 h-5" />
              Start Memory Game
            </GlowButton>
          </>
        ) : (
          <GlowButton
            variant="accent"
            size="xl"
            className="w-full"
            onClick={onCashOut}
            disabled={level < 2 || phase === "showing"}
            pulse={level >= 2 && phase === "input"}
          >
            <Wallet className="w-5 h-5" />
            Cash Out {potentialWin.toLocaleString()}
          </GlowButton>
        )}
      </GlassCard>
    </div>
  );
};

export default MemoryGame;