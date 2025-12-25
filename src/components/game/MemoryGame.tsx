import { motion, AnimatePresence } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { GlowButton } from "@/components/ui/GlowButton";
import { Brain, Wallet, Sparkles, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { soundManager } from "@/lib/soundManager";

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

const PADS = [
  { 
    color: "from-blue-500 to-blue-600", 
    activeColor: "from-blue-400 to-blue-500",
    glow: "shadow-[0_0_60px_rgba(59,130,246,0.8)]",
    icon: "🔵"
  },
  { 
    color: "from-emerald-500 to-emerald-600", 
    activeColor: "from-emerald-400 to-emerald-500",
    glow: "shadow-[0_0_60px_rgba(16,185,129,0.8)]",
    icon: "🟢"
  },
  { 
    color: "from-amber-500 to-amber-600", 
    activeColor: "from-amber-400 to-amber-500",
    glow: "shadow-[0_0_60px_rgba(245,158,11,0.8)]",
    icon: "🟡"
  },
  { 
    color: "from-rose-500 to-rose-600", 
    activeColor: "from-rose-400 to-rose-500",
    glow: "shadow-[0_0_60px_rgba(244,63,94,0.8)]",
    icon: "🔴"
  },
];

const MULTIPLIER_LADDER = [
  { level: 1, mult: 1.5, label: "Level 1" },
  { level: 2, mult: 2.25, label: "Level 2" },
  { level: 3, mult: 3.38, label: "Level 3" },
  { level: 4, mult: 5.06, label: "Level 4" },
  { level: 5, mult: 7.59, label: "Level 5" },
  { level: 6, mult: 11.39, label: "MAX WIN" },
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
  const [lastClickedPad, setLastClickedPad] = useState<number | null>(null);

  const isButtonActive = (index: number) => {
    if (phase === "showing") {
      return sequence[currentShowIndex] === index;
    }
    return false;
  };

  const handlePadClick = (index: number) => {
    if (phase !== "input") return;
    
    setLastClickedPad(index);
    soundManager.play('click');
    onInput(index);
    
    setTimeout(() => setLastClickedPad(null), 200);
  };

  const handleStart = () => {
    soundManager.play('start');
    onStart();
  };

  const handleCashOut = () => {
    soundManager.play('cashout');
    onCashOut();
  };

  const handleBetChange = (amount: number) => {
    soundManager.play('click');
    onBetChange(amount);
  };

  // Play sound when showing sequence
  useEffect(() => {
    if (phase === "showing" && currentShowIndex >= 0 && currentShowIndex < sequence.length) {
      soundManager.play('click');
    }
  }, [currentShowIndex, phase, sequence.length]);

  return (
    <div className="space-y-6">
      {/* Multiplier Ladder */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Multiplier Ladder</span>
          </div>
          <span className="text-xs text-muted-foreground">Complete levels to increase multiplier</span>
        </div>
        <div className="flex gap-1">
          {MULTIPLIER_LADDER.map((step) => (
            <motion.div
              key={step.level}
              className={cn(
                "flex-1 py-2 px-1 rounded-lg text-center transition-all duration-300",
                level >= step.level 
                  ? "bg-primary/30 border border-primary/50" 
                  : level === step.level - 1 && isPlaying
                    ? "bg-primary/10 border border-primary/30 animate-pulse"
                    : "bg-muted/30 border border-border/30"
              )}
              animate={level === step.level && isPlaying ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: level === step.level && isPlaying ? Infinity : 0 }}
            >
              <p className={cn(
                "text-lg font-bold",
                level >= step.level ? "text-primary" : "text-muted-foreground"
              )}>
                {step.mult}x
              </p>
              <p className="text-[10px] text-muted-foreground">{step.label}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Level</span>
          </div>
          <NeonText variant="accent" className="text-3xl font-black">
            {isPlaying ? level : "-"}
          </NeonText>
        </GlassCard>
        
        <GlassCard variant="primary" className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Multiplier</span>
          </div>
          <NeonText variant="primary" className="text-3xl font-black">
            {multiplier.toFixed(2)}x
          </NeonText>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Brain className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Progress</span>
          </div>
          <NeonText variant="accent" className="text-3xl font-black">
            {isPlaying ? `${userSequence.length}/${sequence.length}` : "-"}
          </NeonText>
        </GlassCard>
      </div>

      {/* Simon Says Game Board */}
      <GlassCard variant="elevated" className="p-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative">
          {/* Circular Layout for Simon Says style */}
          <div className="relative w-72 h-72 mx-auto">
            {/* Center display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-24 h-24 rounded-full bg-background border-2 border-border flex flex-col items-center justify-center"
                animate={phase === "showing" ? { 
                  boxShadow: ["0 0 20px rgba(var(--primary), 0.3)", "0 0 40px rgba(var(--primary), 0.5)", "0 0 20px rgba(var(--primary), 0.3)"]
                } : {}}
                transition={{ duration: 1, repeat: phase === "showing" ? Infinity : 0 }}
              >
                <Brain className={cn(
                  "w-8 h-8 mb-1 transition-colors",
                  phase === "showing" ? "text-primary" : phase === "input" ? "text-accent" : "text-muted-foreground"
                )} />
                <span className="text-xs font-medium text-muted-foreground">
                  {!isPlaying ? "START" : phase === "showing" ? "WATCH" : "GO!"}
                </span>
              </motion.div>
            </div>

            {/* Quadrant pads */}
            {PADS.map((pad, index) => {
              const isActive = isButtonActive(index);
              const isClicked = lastClickedPad === index;
              const angle = (index * 90 - 45) * (Math.PI / 180);
              const radius = 90;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.button
                  key={index}
                  className={cn(
                    "absolute w-24 h-24 rounded-2xl transition-all duration-100",
                    `bg-gradient-to-br ${isActive || isClicked ? pad.activeColor : pad.color}`,
                    isActive || isClicked ? pad.glow : "",
                    phase === "input" ? "cursor-pointer hover:brightness-110 active:scale-95" : "cursor-not-allowed",
                    !isPlaying && "opacity-50"
                  )}
                  style={{
                    left: `calc(50% + ${x}px - 48px)`,
                    top: `calc(50% + ${y}px - 48px)`,
                  }}
                  onClick={() => handlePadClick(index)}
                  disabled={phase !== "input"}
                  animate={isActive ? { 
                    scale: [1, 1.15, 1],
                    brightness: [1, 1.5, 1],
                  } : {}}
                  whileTap={phase === "input" ? { scale: 0.9 } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-3xl opacity-80">{pad.icon}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Status message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center mt-6"
            >
              <p className={cn(
                "text-lg font-medium",
                phase === "showing" ? "text-primary" : phase === "input" ? "text-accent" : "text-muted-foreground"
              )}>
                {!isPlaying && "🧠 Test your memory - Watch and repeat the pattern!"}
                {phase === "showing" && "👀 Watch the sequence carefully..."}
                {phase === "input" && "🎯 Your turn! Repeat the pattern exactly"}
              </p>
              {isPlaying && phase === "input" && (
                <p className="text-sm text-muted-foreground mt-1">
                  Tap {sequence.length - userSequence.length} more to complete this level
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </GlassCard>

      {/* Controls */}
      <GlassCard variant="elevated" className="p-6 space-y-4">
        {!isPlaying ? (
          <>
            {/* Bet selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Bet Amount</span>
                <span className="text-sm text-muted-foreground">{balance.toLocaleString()} available</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {betPresets.map((preset) => (
                  <GlowButton
                    key={preset}
                    variant={currentBet === preset ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => handleBetChange(Math.min(preset, balance))}
                    disabled={preset > balance}
                  >
                    {preset}
                  </GlowButton>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <GlowButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBetChange(Math.floor(balance / 2))}
                  disabled={balance < 20}
                >
                  ½ Half
                </GlowButton>
                <GlowButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBetChange(balance)}
                >
                  Max
                </GlowButton>
              </div>
            </div>

            {/* Start button */}
            <GlowButton
              variant="primary"
              size="xl"
              className="w-full h-14 text-lg"
              onClick={handleStart}
              disabled={currentBet > balance || currentBet <= 0}
              pulse
            >
              <Brain className="w-5 h-5" />
              Start Memory Challenge
            </GlowButton>

            {/* Info */}
            <p className="text-xs text-center text-muted-foreground">
              Watch the pattern and repeat it. Each level adds one more to the sequence.
              Cash out anytime after Level 2!
            </p>
          </>
        ) : (
          <GlowButton
            variant="accent"
            size="xl"
            className="w-full h-14 text-lg"
            onClick={handleCashOut}
            disabled={level < 2 || phase === "showing"}
            pulse={level >= 2 && phase === "input"}
          >
            <Wallet className="w-5 h-5" />
            Cash Out {potentialWin.toLocaleString()} ({multiplier}x)
          </GlowButton>
        )}
      </GlassCard>
    </div>
  );
};

export default memo(MemoryGame);