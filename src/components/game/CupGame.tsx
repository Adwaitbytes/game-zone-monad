import { motion } from "framer-motion";
import Cup from "./Cup";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { GlowButton } from "@/components/ui/GlowButton";
import { Wallet } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Game info */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <GlassCard className="py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Round</p>
          <NeonText variant="accent" className="text-2xl">{isPlaying ? round : "-"}</NeonText>
        </GlassCard>
        <GlassCard variant="primary" className="py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Multiplier</p>
          <NeonText variant="primary" className="text-2xl">{multiplier.toFixed(2)}x</NeonText>
        </GlassCard>
        <GlassCard className="py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Potential</p>
          <NeonText variant="accent" className="text-2xl">{potentialWin.toLocaleString()}</NeonText>
        </GlassCard>
      </div>

      {/* Cups */}
      <GlassCard variant="elevated" className="py-10 px-6">
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          {Array.from({ length: cupsCount }).map((_, index) => (
            <Cup
              key={index}
              index={index}
              isSelected={selectedCup === index}
              isRevealed={revealedCup === index}
              isBomb={bombPosition === index && revealedCup === index}
              isDisabled={!isPlaying || revealedCup !== null}
              onSelect={() => onSelectCup(index)}
            />
          ))}
        </div>

        {/* Game status */}
        <motion.p
          className="text-center mt-8 text-muted-foreground"
          key={isPlaying ? "playing" : "idle"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {!isPlaying && "Place your bet and start the game"}
          {isPlaying && revealedCup === null && "Pick a cup. One has a bomb!"}
          {isPlaying && revealedCup !== null && "Revealing..."}
        </motion.p>
      </GlassCard>

      {/* Controls */}
      <GlassCard variant="elevated" className="p-6 space-y-4">
        {!isPlaying ? (
          <>
            {/* Bet controls */}
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

              <div className="flex gap-2">
                <GlowButton
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => onBetChange(Math.floor(balance / 2))}
                  disabled={balance < 20}
                >
                  ½ Half
                </GlowButton>
                <GlowButton
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => onBetChange(balance)}
                >
                  Max
                </GlowButton>
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
              Start Game
            </GlowButton>
          </>
        ) : (
          <GlowButton
            variant="accent"
            size="xl"
            className="w-full"
            onClick={onCashOut}
            disabled={!canCashOut}
            pulse={canCashOut}
          >
            <Wallet className="w-5 h-5" />
            Cash Out {potentialWin.toLocaleString()}
          </GlowButton>
        )}
      </GlassCard>
    </div>
  );
};

export default CupGame;