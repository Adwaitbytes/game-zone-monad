import { motion, AnimatePresence } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { NeonText } from "@/components/ui/NeonText";
import { RotateCcw, Share2 } from "lucide-react";

interface GameResultProps {
  isVisible: boolean;
  isWin: boolean;
  amount: number;
  multiplier: number;
  round: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

const GameResult = ({
  isVisible,
  isWin,
  amount,
  multiplier,
  round,
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
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Result Card */}
          <motion.div
            className={`relative glass-elevated rounded-3xl p-8 md:p-12 text-center max-w-md w-full border ${
              isWin ? "border-secondary/50" : "border-primary/50"
            }`}
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Glow effect */}
            <div 
              className={`absolute -inset-4 rounded-3xl blur-3xl ${
                isWin ? "bg-secondary/20" : "bg-primary/20"
              }`}
            />

            {/* Content */}
            <div className="relative space-y-6">
              {/* Icon */}
              <motion.div
                className="text-8xl"
                animate={isWin ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {
                  scale: [1, 0.9, 1],
                }}
                transition={{ duration: 0.5, repeat: isWin ? 2 : 0 }}
              >
                {isWin ? "🎉" : "💀"}
              </motion.div>

              {/* Title */}
              <div>
                <NeonText 
                  variant={isWin ? "secondary" : "primary"} 
                  className="text-4xl md:text-5xl"
                  as="h2"
                >
                  {isWin ? "CASHED OUT!" : "ELIMINATED"}
                </NeonText>
                <p className="text-muted-foreground mt-2">
                  {isWin 
                    ? `You survived ${round} rounds!` 
                    : `Eliminated at round ${round}`
                  }
                </p>
              </div>

              {/* Amount */}
              <div className="py-4 px-6 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">
                  {isWin ? "You won" : "You lost"}
                </p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <NeonText 
                    variant={isWin ? "secondary" : "primary"}
                    className="text-5xl font-black"
                  >
                    {isWin ? "+" : "-"}{amount.toLocaleString()}
                  </NeonText>
                </motion.div>
                <p className="text-sm text-muted-foreground mt-1">MON</p>
                {isWin && (
                  <p className="text-xs text-accent mt-2">
                    {multiplier}x multiplier achieved
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <GlowButton
                  variant={isWin ? "secondary" : "primary"}
                  size="lg"
                  className="flex-1"
                  onClick={onPlayAgain}
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </GlowButton>
                <GlowButton
                  variant="ghost"
                  size="lg"
                  className="flex-1"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </GlowButton>
              </div>

              {/* Near-miss message for losses */}
              {!isWin && round > 2 && (
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  So close! You were {round - 1} rounds away from a {(multiplier * 1.5).toFixed(2)}x payout
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Win particles */}
          {isWin && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-secondary rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    y: [-20, -100],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
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
