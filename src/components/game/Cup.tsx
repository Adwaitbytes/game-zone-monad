import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface CupProps {
  index: number;
  isSelected: boolean;
  isRevealed: boolean;
  isBomb: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

const CUP_COLORS = [
  { bg: "from-rose-500/20 to-pink-600/20", border: "border-rose-500", glow: "shadow-[0_0_30px_rgba(244,63,94,0.5)]" },
  { bg: "from-amber-500/20 to-orange-600/20", border: "border-amber-500", glow: "shadow-[0_0_30px_rgba(245,158,11,0.5)]" },
  { bg: "from-emerald-500/20 to-green-600/20", border: "border-emerald-500", glow: "shadow-[0_0_30px_rgba(16,185,129,0.5)]" },
];

const Cup = memo(({ 
  index, 
  isSelected, 
  isRevealed, 
  isBomb, 
  isDisabled,
  onSelect,
}: CupProps) => {
  const color = CUP_COLORS[index % CUP_COLORS.length];

  return (
    <motion.button
      className={cn(
        "relative w-24 h-28 sm:w-32 sm:h-36 md:w-40 md:h-44 rounded-3xl transition-all duration-300",
        "flex flex-col items-center justify-center",
        "border-2 backdrop-blur-xl overflow-hidden",
        isRevealed && isBomb && "bg-gradient-to-br from-red-600/30 to-red-900/30 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]",
        isRevealed && !isBomb && "bg-gradient-to-br from-green-500/30 to-emerald-600/30 border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.6)]",
        !isRevealed && isSelected && `bg-gradient-to-br ${color.bg} ${color.border} ${color.glow}`,
        !isRevealed && !isSelected && "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-600/50 hover:border-slate-500",
        isDisabled && !isRevealed && "opacity-50 cursor-not-allowed",
        !isDisabled && "cursor-pointer group"
      )}
      onClick={() => !isDisabled && onSelect()}
      whileHover={isDisabled ? {} : { scale: 1.05, y: -8 }}
      whileTap={isDisabled ? {} : { scale: 0.95 }}
      disabled={isDisabled}
      layout
    >
      {/* Shine effect */}
      {!isDisabled && !isRevealed && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
        />
      )}

      {/* Cup lid */}
      <motion.div
        className={cn(
          "absolute -top-1 w-16 sm:w-20 md:w-24 h-3 sm:h-4 rounded-t-full",
          isRevealed && isBomb ? "bg-red-500" : isRevealed && !isBomb ? "bg-green-500" : "bg-gradient-to-r from-slate-500 to-slate-600"
        )}
        animate={isRevealed ? { y: -20, rotateZ: -15, opacity: 0 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      />

      {/* Cup body with 3D effect */}
      <div className={cn(
        "relative w-14 h-16 sm:w-18 sm:h-20 md:w-22 md:h-24 rounded-b-2xl mt-2",
        "bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600",
        isSelected && "from-slate-300 via-slate-400 to-slate-500"
      )}>
        {/* Straw */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -top-8 w-2 h-12 rounded-full"
          style={{
            background: isRevealed && isBomb 
              ? "linear-gradient(to bottom, #ef4444, #dc2626)" 
              : isRevealed && !isBomb 
                ? "linear-gradient(to bottom, #22c55e, #16a34a)"
                : "linear-gradient(to bottom, #f472b6, #db2777)"
          }}
          animate={isRevealed ? { scaleY: 1.2, y: -5 } : { scaleY: 1 }}
        />
        
        {/* Inner shadow */}
        <div className="absolute inset-2 rounded-b-xl bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* Reveal content */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <span className="text-5xl sm:text-6xl md:text-7xl drop-shadow-2xl">
              {isBomb ? "💣" : "💎"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection ring */}
      <AnimatePresence>
        {isSelected && !isRevealed && (
          <>
            <motion.div
              className={cn("absolute inset-0 rounded-3xl border-4", color.border, "opacity-50")}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: [0.5, 0.2, 0.5] }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2"
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
            >
              <span className="text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full">
                SELECTED
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cup number badge */}
      <motion.div
        className={cn(
          "absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold",
          isRevealed && isBomb ? "bg-red-500 text-white" : 
          isRevealed && !isBomb ? "bg-green-500 text-white" :
          "bg-white/20 text-white/80"
        )}
      >
        {index + 1}
      </motion.div>

      {/* Floating particles on win */}
      {isRevealed && !isBomb && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-400"
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={{
                x: Math.cos(i * 45 * Math.PI / 180) * 60,
                y: Math.sin(i * 45 * Math.PI / 180) * 60 - 30,
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 1, delay: i * 0.05 }}
            />
          ))}
        </>
      )}

      {/* Explosion particles on bomb */}
      {isRevealed && isBomb && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: i % 2 === 0 ? "#ef4444" : "#f97316" }}
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={{
                x: Math.cos(i * 30 * Math.PI / 180) * 80,
                y: Math.sin(i * 30 * Math.PI / 180) * 80,
                scale: [0, 1.5, 0],
                opacity: [1, 0.8, 0]
              }}
              transition={{ duration: 0.8, delay: i * 0.03 }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
});

Cup.displayName = "Cup";

export default Cup;