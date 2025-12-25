import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { TrendingUp, Zap, Target, Trophy } from "lucide-react";

interface StatsPanelProps {
  balance: number;
  currentBet: number;
  multiplier: number;
  round: number;
  streak: number;
  xp: number;
  level: number;
}

const StatsPanel = ({
  balance,
  currentBet,
  multiplier,
  round,
  streak,
  xp,
  level,
}: StatsPanelProps) => {
  const xpProgress = (xp % 1000) / 1000;
  const potentialWin = currentBet * multiplier;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {/* Balance */}
      <GlassCard variant="elevated" className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-secondary/20">
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Balance</span>
        </div>
        <NeonText variant="secondary" className="text-xl md:text-2xl">
          {balance.toLocaleString()}
        </NeonText>
        <span className="text-xs text-muted-foreground">MON</span>
      </GlassCard>

      {/* Current Multiplier */}
      <GlassCard variant="danger" className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-primary/20">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Multiplier</span>
        </div>
        <motion.div
          key={multiplier}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-baseline gap-1"
        >
          <NeonText variant="primary" className="text-2xl md:text-3xl">
            {multiplier.toFixed(2)}
          </NeonText>
          <span className="text-primary text-sm">x</span>
        </motion.div>
      </GlassCard>

      {/* Potential Win */}
      <GlassCard variant="elevated" className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-accent/20">
            <Target className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Potential</span>
        </div>
        <motion.div
          key={potentialWin}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <NeonText variant="accent" className="text-xl md:text-2xl">
            {potentialWin.toLocaleString()}
          </NeonText>
        </motion.div>
        <span className="text-xs text-muted-foreground">MON</span>
      </GlassCard>

      {/* Level & XP */}
      <GlassCard variant="elevated" className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-warning/20">
            <Trophy className="w-4 h-4 text-warning" />
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Level {level}</span>
        </div>
        
        {/* XP Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-1">
          <motion.div
            className="h-full bg-gradient-to-r from-warning to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {xp % 1000} / 1000 XP
          </span>
          {streak > 0 && (
            <span className="text-xs text-primary font-bold">
              🔥 {streak}
            </span>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default StatsPanel;
