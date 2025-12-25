import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CupProps {
  index: number;
  isSelected: boolean;
  isRevealed: boolean;
  isBomb: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

const Cup = ({ 
  index, 
  isSelected, 
  isRevealed, 
  isBomb, 
  isDisabled,
  onSelect,
}: CupProps) => {
  return (
    <motion.button
      className={cn(
        "relative w-28 h-32 sm:w-36 sm:h-40 rounded-2xl transition-all duration-300",
        "flex flex-col items-center justify-center gap-2",
        "border-2 backdrop-blur-sm",
        isRevealed && isBomb && "bg-secondary/20 border-secondary shadow-glow-secondary",
        isRevealed && !isBomb && "bg-primary/20 border-primary shadow-glow",
        !isRevealed && isSelected && "bg-accent/10 border-accent shadow-glow-accent",
        !isRevealed && !isSelected && "bg-card border-border hover:border-primary/50 hover:bg-card-elevated",
        isDisabled && !isRevealed && "opacity-40 cursor-not-allowed",
        !isDisabled && "cursor-pointer"
      )}
      onClick={() => !isDisabled && onSelect()}
      whileHover={isDisabled ? {} : { scale: 1.03, y: -4 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      disabled={isDisabled}
    >
      {/* Cup visual */}
      <div className={cn(
        "text-5xl sm:text-6xl transition-transform duration-500",
        isRevealed && "scale-110"
      )}>
        {isRevealed ? (isBomb ? "💥" : "✨") : "🥤"}
      </div>
      
      {/* Cup number */}
      <span className={cn(
        "text-sm font-semibold",
        isRevealed && isBomb && "text-secondary",
        isRevealed && !isBomb && "text-primary",
        !isRevealed && "text-muted-foreground"
      )}>
        Cup {index + 1}
      </span>
      
      {/* Selection indicator */}
      {isSelected && !isRevealed && (
        <motion.div
          className="absolute -bottom-2 w-2 h-2 bg-accent rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        />
      )}
    </motion.button>
  );
};

export default Cup;