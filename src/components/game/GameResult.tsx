import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { GlowButton } from "@/components/ui/GlowButton";
import { RotateCcw, Share2, X } from "lucide-react";
import { GameType } from "@/hooks/useGameState";

interface GameResultProps {
  isVisible: boolean;
  isWin: boolean;
  amount: number;
  multiplier: number;
  gameType: GameType;
  message?: string;
  onPlayAgain: () => void;
  onClose: () => void;
}

const GAME_NAMES: Record<GameType, string> = {
  cups: "Cup Game",
  reaction: "Reflex Test",
  memory: "Memory Game",
  crash: "Crash",
};

const GameResult = ({
  isVisible,
  isWin,
  amount,
  multiplier,
  gameType,
  message,
  onPlayAgain,
  onClose,
}: GameResultProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Result Card */}
          <motion.div
            className="relative w-full max-w-sm"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <GlassCard 
              variant={isWin ? "primary" : "danger"} 
              className="p-8 text-center"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Icon */}
              <motion.div
                className="text-7xl mb-4"
                animate={isWin ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                } : {
                  scale: [1, 0.95, 1],
                }}
                transition={{ duration: 0.5 }}
              >
                {isWin ? "🎉" : "💔"}
              </motion.div>

              {/* Title */}
              <NeonText 
                variant={isWin ? "primary" : "secondary"} 
                className="text-3xl mb-1"
                as="h2"
              >
                {isWin ? "You Won!" : "You Lost"}
              </NeonText>
              
              <p className="text-muted-foreground text-sm mb-6">
                {GAME_NAMES[gameType]} {message && `• ${message}`}
              </p>

              {/* Amount */}
              <div className="py-4 px-6 rounded-xl bg-muted/30 mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <NeonText 
                    variant={isWin ? "primary" : "secondary"}
                    className="text-4xl font-bold"
                  >
                    {isWin ? "+" : "-"}{amount.toLocaleString()}
                  </NeonText>
                </motion.div>
                {multiplier > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {multiplier.toFixed(2)}x multiplier
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <GlowButton
                  variant={isWin ? "primary" : "danger"}
                  size="lg"
                  className="flex-1"
                  onClick={onPlayAgain}
                >
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </GlowButton>
                <GlowButton
                  variant="ghost"
                  size="lg"
                  onClick={onClose}
                >
                  <Share2 className="w-4 h-4" />
                </GlowButton>
              </div>
            </GlassCard>
          </motion.div>

          {/* Win particles */}
          {isWin && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                  style={{
                    left: `${30 + Math.random() * 40}%`,
                    top: "50%",
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    y: [0, -150 - Math.random() * 100],
                    x: [(Math.random() - 0.5) * 100],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameResult;