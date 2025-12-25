import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { GlowButton } from "@/components/ui/GlowButton";
import { Rocket, Wallet } from "lucide-react";
import { useEffect, useState, memo } from "react";
import { soundManager } from "@/lib/soundManager";

interface CrashGameState {
  isPlaying: boolean;
  phase: "betting" | "running" | "crashed";
  multiplier: number;
  crashPoint: number;
  cashedOut: boolean;
  cashOutMultiplier: number;
}

interface CrashGameProps {
  gameState: CrashGameState;
  currentBet: number;
  balance: number;
  onStart: () => void;
  onCashOut: () => void;
  onBetChange: (amount: number) => void;
}

const CrashGame = ({
  gameState,
  currentBet,
  balance,
  onStart,
  onCashOut,
  onBetChange,
}: CrashGameProps) => {
  const { isPlaying, phase, multiplier, cashedOut, cashOutMultiplier } = gameState;
  const betPresets = [50, 100, 250, 500];
  const potentialWin = Math.floor(currentBet * multiplier);
  
  // Local multiplier for smooth animation
  const [displayMultiplier, setDisplayMultiplier] = useState(1.0);
  
  useEffect(() => {
    if (phase === "running" && !cashedOut) {
      const interval = setInterval(() => {
        setDisplayMultiplier(multiplier);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [multiplier, phase, cashedOut]);

  const getMultiplierColor = () => {
    if (phase === "crashed" && !cashedOut) return "text-secondary";
    if (multiplier < 2) return "text-foreground";
    if (multiplier < 5) return "text-primary";
    if (multiplier < 10) return "text-accent";
    return "text-primary";
  };

  return (
    <div className="space-y-6">
      {/* Chart area */}
      <GlassCard variant="elevated" className="h-64 sm:h-80 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full border-t border-foreground/20"
              style={{ top: `${i * 10}%` }}
            />
          ))}
        </div>

        {/* Multiplier display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            animate={phase === "crashed" && !cashedOut ? { 
              x: [-5, 5, -5, 5, 0],
              transition: { duration: 0.4 }
            } : {}}
          >
            {phase === "crashed" && !cashedOut ? (
              <>
                <p className="text-secondary text-lg mb-2">CRASHED</p>
                <NeonText variant="secondary" className="text-6xl sm:text-8xl">
                  {multiplier.toFixed(2)}x
                </NeonText>
              </>
            ) : cashedOut ? (
              <>
                <p className="text-primary text-lg mb-2">CASHED OUT</p>
                <NeonText variant="primary" className="text-6xl sm:text-8xl">
                  {cashOutMultiplier.toFixed(2)}x
                </NeonText>
              </>
            ) : phase === "running" ? (
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <NeonText variant="primary" className={`text-6xl sm:text-8xl ${getMultiplierColor()}`}>
                  {displayMultiplier.toFixed(2)}x
                </NeonText>
              </motion.div>
            ) : (
              <>
                <Rocket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Place bet to launch</p>
              </>
            )}
          </motion.div>
        </div>

        {/* Rising effect */}
        {phase === "running" && !cashedOut && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/20 to-transparent"
            animate={{ height: `${Math.min(multiplier * 10, 100)}%` }}
            transition={{ duration: 0.1 }}
          />
        )}

        {/* Crash effect */}
        {phase === "crashed" && !cashedOut && (
          <motion.div
            className="absolute inset-0 bg-secondary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.5 }}
          />
        )}
      </GlassCard>

      {/* Controls */}
      <GlassCard variant="elevated" className="p-6 space-y-4">
        {phase === "betting" ? (
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
              <Rocket className="w-5 h-5" />
              Launch
            </GlowButton>
          </>
        ) : phase === "running" && !cashedOut ? (
          <GlowButton
            variant="accent"
            size="xl"
            className="w-full heartbeat"
            onClick={onCashOut}
            pulse
          >
            <Wallet className="w-5 h-5" />
            Cash Out {potentialWin.toLocaleString()}
          </GlowButton>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              {cashedOut ? "Nice! You cashed out in time." : "The rocket crashed!"}
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default memo(CrashGame);