import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CupProps {
  index: number;
  isSelected: boolean;
  isRevealed: boolean;
  isLethal: boolean;
  isDisabled: boolean;
  onSelect: () => void;
  intensity: number; // 0-1 for visual intensity based on round
}

const Cup = ({ 
  index, 
  isSelected, 
  isRevealed, 
  isLethal, 
  isDisabled,
  onSelect,
  intensity 
}: CupProps) => {
  const glowIntensity = 20 + (intensity * 40);
  
  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={() => !isDisabled && onSelect()}
      whileHover={isDisabled ? {} : { scale: 1.05, y: -5 }}
      whileTap={isDisabled ? {} : { scale: 0.95 }}
    >
      {/* Cup base glow */}
      <motion.div
        className={cn(
          "absolute -inset-4 rounded-full blur-2xl transition-all duration-500",
          isRevealed && isLethal ? "bg-primary/60" : "bg-primary/20",
          isRevealed && !isLethal && "bg-secondary/40",
          isSelected && !isRevealed && "bg-accent/40"
        )}
        animate={{
          opacity: isSelected || isRevealed ? 1 : 0.5,
          scale: isSelected ? 1.1 : 1,
        }}
      />
      
      {/* Cup body */}
      <motion.div
        className={cn(
          "relative w-24 h-28 md:w-32 md:h-36 rounded-t-full rounded-b-lg",
          "flex items-end justify-center pb-4",
          "transition-all duration-300",
          "border-2",
          isRevealed && isLethal 
            ? "bg-gradient-to-b from-primary/80 to-primary/40 border-primary shadow-neon-primary" 
            : isRevealed && !isLethal 
              ? "bg-gradient-to-b from-secondary/40 to-secondary/20 border-secondary shadow-neon-secondary"
              : "bg-gradient-to-b from-primary/30 to-primary/10 border-primary/50",
          isSelected && !isRevealed && "border-accent shadow-neon-accent",
          !isDisabled && !isRevealed && "hover:border-primary hover:shadow-neon-primary",
          isDisabled && !isRevealed && "opacity-50 cursor-not-allowed"
        )}
        style={{
          boxShadow: isRevealed && isLethal 
            ? `0 0 ${glowIntensity}px hsl(var(--primary) / 0.6), 0 0 ${glowIntensity * 2}px hsl(var(--primary) / 0.3)` 
            : undefined
        }}
        animate={{
          rotateY: isRevealed ? 180 : 0,
          y: isRevealed ? -20 : 0,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Inner highlight */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-foreground/10 to-transparent rounded-full blur-sm" />
        
        {/* Cup number */}
        <span className={cn(
          "font-display text-2xl font-bold transition-all duration-300",
          isRevealed && isLethal ? "text-primary-foreground" : "text-foreground/80"
        )}>
          {index + 1}
        </span>
      </motion.div>
      
      {/* Revealed content */}
      {isRevealed && (
        <motion.div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "pointer-events-none"
          )}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {isLethal ? (
            <motion.div
              className="text-5xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              💀
            </motion.div>
          ) : (
            <motion.div
              className="text-4xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.3 }}
            >
              ✨
            </motion.div>
          )}
        </motion.div>
      )}
      
      {/* Selection indicator */}
      {isSelected && !isRevealed && (
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse shadow-neon-accent" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Cup;
