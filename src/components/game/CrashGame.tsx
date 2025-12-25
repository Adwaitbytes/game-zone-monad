import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { GlowButton } from "@/components/ui/GlowButton";
import { Rocket, Wallet, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { useEffect, useState, memo, useRef } from "react";
import { soundManager } from "@/lib/soundManager";
import { cn } from "@/lib/utils";

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

// History for the graph
interface HistoryPoint {
  time: number;
  mult: number;
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
  
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [displayMultiplier, setDisplayMultiplier] = useState(1.0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number>(0);
  
  // Update display multiplier smoothly
  useEffect(() => {
    if (phase === "running" && !cashedOut) {
      setDisplayMultiplier(multiplier);
      setHistory(prev => [...prev, { time: Date.now() - startTimeRef.current, mult: multiplier }]);
    }
  }, [multiplier, phase, cashedOut]);

  // Reset on new game
  useEffect(() => {
    if (phase === "running" && !cashedOut && history.length === 0) {
      startTimeRef.current = Date.now();
      setHistory([{ time: 0, mult: 1 }]);
    }
    if (phase === "betting") {
      setHistory([]);
      setDisplayMultiplier(1.0);
    }
  }, [phase, cashedOut, history.length]);

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (history.length < 2) return;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (rect.height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Calculate scale
    const maxMult = Math.max(...history.map(h => h.mult), 2);
    const maxTime = Math.max(...history.map(h => h.time), 1000);

    // Draw line
    const gradient = ctx.createLinearGradient(0, rect.height, 0, 0);
    if (phase === "crashed" && !cashedOut) {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.8)');
    } else {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.8)');
    }

    ctx.strokeStyle = phase === "crashed" && !cashedOut ? '#ef4444' : '#10b981';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    history.forEach((point, i) => {
      const x = (point.time / maxTime) * rect.width;
      const y = rect.height - ((point.mult - 1) / (maxMult - 1)) * (rect.height - 20);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Fill under the line
    ctx.lineTo(rect.width, rect.height);
    ctx.lineTo(0, rect.height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

  }, [history, phase, cashedOut]);

  const getMultiplierColor = () => {
    if (phase === "crashed" && !cashedOut) return "text-red-500";
    if (cashedOut) return "text-emerald-400";
    if (displayMultiplier < 2) return "text-foreground";
    if (displayMultiplier < 5) return "text-emerald-400";
    if (displayMultiplier < 10) return "text-amber-400";
    return "text-primary";
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

  return (
    <div className="space-y-6">
      {/* Chart area */}
      <GlassCard variant="elevated" className="relative overflow-hidden">
        <div className="h-72 sm:h-80 relative">
          {/* Canvas for graph */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
          />

          {/* Multiplier display */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <AnimatePresence mode="wait">
              {phase === "crashed" && !cashedOut ? (
                <motion.div
                  key="crashed"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, x: [-5, 5, -5, 5, 0] }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <span className="text-red-500 text-xl font-bold">CRASHED!</span>
                  </div>
                  <p className={cn("text-7xl sm:text-8xl font-black", getMultiplierColor())}>
                    {multiplier.toFixed(2)}x
                  </p>
                </motion.div>
              ) : cashedOut ? (
                <motion.div
                  key="cashout"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                    <span className="text-emerald-400 text-xl font-bold">CASHED OUT!</span>
                  </div>
                  <p className={cn("text-7xl sm:text-8xl font-black", getMultiplierColor())}>
                    {cashOutMultiplier.toFixed(2)}x
                  </p>
                  <p className="text-2xl text-emerald-400 mt-2">
                    +{Math.floor(currentBet * cashOutMultiplier).toLocaleString()}
                  </p>
                </motion.div>
              ) : phase === "running" ? (
                <motion.div
                  key="running"
                  className="text-center"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <Rocket className="w-8 h-8 text-primary" />
                    </motion.div>
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className={cn("text-7xl sm:text-8xl font-black tabular-nums", getMultiplierColor())}>
                    {displayMultiplier.toFixed(2)}x
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rocket className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                  </motion.div>
                  <p className="text-xl text-muted-foreground">Place your bet to launch!</p>
                  <p className="text-sm text-muted-foreground mt-1">Cash out before the rocket crashes</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Rising effect overlay */}
          {phase === "running" && !cashedOut && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none"
              animate={{ height: `${Math.min(displayMultiplier * 8, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          )}

          {/* Crash explosion effect */}
          {phase === "crashed" && !cashedOut && (
            <>
              <motion.div
                className="absolute inset-0 bg-red-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-red-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: [0, (Math.random() - 0.5) * 200],
                      y: [0, (Math.random() - 0.5) * 200],
                      opacity: [1, 0],
                    }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </GlassCard>

      {/* Controls */}
      <GlassCard variant="elevated" className="p-6 space-y-4">
        {phase === "betting" ? (
          <>
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

            <GlowButton
              variant="primary"
              size="xl"
              className="w-full h-14 text-lg"
              onClick={handleStart}
              disabled={currentBet > balance || currentBet <= 0}
              pulse
            >
              <Rocket className="w-5 h-5" />
              Launch Rocket
            </GlowButton>

            <p className="text-xs text-center text-muted-foreground">
              🚀 The multiplier increases until it crashes. Cash out before it does!
            </p>
          </>
        ) : phase === "running" && !cashedOut ? (
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <GlowButton
              variant="accent"
              size="xl"
              className="w-full h-16 text-xl font-bold"
              onClick={handleCashOut}
              pulse
            >
              <Wallet className="w-6 h-6" />
              CASH OUT {potentialWin.toLocaleString()}
            </GlowButton>
          </motion.div>
        ) : (
          <div className="text-center py-4">
            <p className={cn(
              "text-lg font-medium",
              cashedOut ? "text-emerald-400" : "text-red-400"
            )}>
              {cashedOut 
                ? `🎉 Nice! You won ${Math.floor(currentBet * cashOutMultiplier).toLocaleString()}!` 
                : "💥 The rocket crashed! Better luck next time."}
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default memo(CrashGame);