import { motion } from "framer-motion";
import Cup from "./Cup";

interface GameTableProps {
  cups: number;
  selectedCup: number | null;
  revealedCups: number[];
  lethalCup: number | null;
  onSelectCup: (index: number) => void;
  isPlaying: boolean;
  round: number;
}

const GameTable = ({
  cups,
  selectedCup,
  revealedCups,
  lethalCup,
  onSelectCup,
  isPlaying,
  round,
}: GameTableProps) => {
  const intensity = Math.min(round / 10, 1); // Intensity increases with rounds

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Table surface */}
      <motion.div
        className="relative rounded-3xl p-8 md:p-12"
        style={{
          background: `
            radial-gradient(ellipse at center, hsl(var(--card-elevated)) 0%, hsl(var(--card)) 50%, hsl(var(--background)) 100%)
          `,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Table edge glow */}
        <div 
          className="absolute inset-0 rounded-3xl border border-primary/20 pointer-events-none"
          style={{
            boxShadow: `
              inset 0 0 60px hsl(var(--primary) / ${0.05 + intensity * 0.1}),
              0 0 ${20 + intensity * 40}px hsl(var(--primary) / ${0.1 + intensity * 0.2})
            `,
          }}
        />

        {/* Cups container */}
        <div className="relative flex items-center justify-center gap-6 md:gap-12 py-8">
          {Array.from({ length: cups }).map((_, index) => (
            <Cup
              key={index}
              index={index}
              isSelected={selectedCup === index}
              isRevealed={revealedCups.includes(index)}
              isLethal={lethalCup === index}
              isDisabled={!isPlaying || revealedCups.includes(index)}
              onSelect={() => onSelectCup(index)}
              intensity={intensity}
            />
          ))}
        </div>

        {/* Table reflection */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)`,
          }}
        />
      </motion.div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GameTable;
