import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { NeonText } from "@/components/ui/NeonText";
import { Minus, Plus, RotateCcw, Wallet } from "lucide-react";

interface ControlPanelProps {
  betAmount: number;
  onBetChange: (amount: number) => void;
  onPlay: () => void;
  onCashOut: () => void;
  isPlaying: boolean;
  canCashOut: boolean;
  balance: number;
  round: number;
  multiplier: number;
}

const ControlPanel = ({
  betAmount,
  onBetChange,
  onPlay,
  onCashOut,
  isPlaying,
  canCashOut,
  balance,
  round,
  multiplier,
}: ControlPanelProps) => {
  const betPresets = [10, 50, 100, 500];

  const adjustBet = (delta: number) => {
    const newAmount = Math.max(10, Math.min(balance, betAmount + delta));
    onBetChange(newAmount);
  };

  return (
    <motion.div
      className="glass-elevated rounded-2xl p-4 md:p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {!isPlaying ? (
        <>
          {/* Bet Amount Section */}
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground uppercase tracking-wider font-display">
              Bet Amount
            </label>
            
            <div className="flex items-center gap-3">
              <GlowButton
                variant="ghost"
                size="sm"
                onClick={() => adjustBet(-10)}
                disabled={betAmount <= 10}
              >
                <Minus className="w-4 h-4" />
              </GlowButton>
              
              <div className="flex-1 text-center">
                <NeonText variant="secondary" className="text-3xl">
                  {betAmount}
                </NeonText>
                <span className="text-muted-foreground text-sm ml-2">MON</span>
              </div>
              
              <GlowButton
                variant="ghost"
                size="sm"
                onClick={() => adjustBet(10)}
                disabled={betAmount >= balance}
              >
                <Plus className="w-4 h-4" />
              </GlowButton>
            </div>

            {/* Preset buttons */}
            <div className="grid grid-cols-4 gap-2">
              {betPresets.map((preset) => (
                <GlowButton
                  key={preset}
                  variant={betAmount === preset ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onBetChange(Math.min(preset, balance))}
                  disabled={preset > balance}
                  className="text-xs"
                >
                  {preset}
                </GlowButton>
              ))}
            </div>

            {/* Max/Half buttons */}
            <div className="grid grid-cols-2 gap-2">
              <GlowButton
                variant="ghost"
                size="sm"
                onClick={() => onBetChange(Math.floor(balance / 2))}
                disabled={balance < 20}
              >
                ½ Half
              </GlowButton>
              <GlowButton
                variant="ghost"
                size="sm"
                onClick={() => onBetChange(balance)}
              >
                Max
              </GlowButton>
            </div>
          </div>

          {/* Play Button */}
          <GlowButton
            variant="danger"
            size="xl"
            className="w-full"
            onClick={onPlay}
            disabled={betAmount > balance || betAmount <= 0}
            pulse
          >
            <span className="text-xl">⚡</span>
            Start Game
          </GlowButton>
        </>
      ) : (
        <>
          {/* In-Game Controls */}
          <div className="text-center space-y-2">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">
              Round {round}
            </span>
            <div className="flex items-center justify-center gap-2">
              <NeonText variant="primary" className="text-4xl">
                {multiplier.toFixed(2)}x
              </NeonText>
            </div>
            <p className="text-sm text-muted-foreground">
              Select a cup to continue or cash out now
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <GlowButton
              variant="secondary"
              size="xl"
              className="w-full"
              onClick={onCashOut}
              disabled={!canCashOut}
              pulse={canCashOut}
            >
              <Wallet className="w-5 h-5" />
              Cash Out {(betAmount * multiplier).toLocaleString()} MON
            </GlowButton>
          </div>

          {/* Round Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Risk Level</span>
              <span>{Math.min(round * 10, 100)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-secondary via-warning to-primary"
                animate={{ width: `${Math.min(round * 10, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ControlPanel;
