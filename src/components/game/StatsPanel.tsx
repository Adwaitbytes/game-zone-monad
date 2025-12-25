import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { TrendingUp, Zap, Target, Trophy } from "lucide-react";

interface StatsPanelProps {
  balance: number;
  streak: number;
  xp: number;
  level: number;
}

const StatsPanel = ({ balance, streak, xp, level }: StatsPanelProps) => {
  const xpProgress = (xp % 1000) / 1000;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Balance */}
      <GlassCard className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Balance</span>
        </div>
        <NeonText variant="primary" className="text-xl">
          {balance.toLocaleString()}
        </NeonText>
      </GlassCard>

      {/* Streak */}
      <GlassCard className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-xs text-muted-foreground">Streak</span>
        </div>
        <NeonText variant="accent" className="text-xl">
          {streak > 0 ? `🔥 ${streak}` : "-"}
        </NeonText>
      </GlassCard>

      {/* Level */}
      <GlassCard className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-xs text-muted-foreground">Level {level}</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-gold"
            animate={{ width: `${xpProgress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{xp % 1000}/1000 XP</p>
      </GlassCard>

      {/* Games Played placeholder */}
      <GlassCard className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
        <p className="text-xl font-bold text-foreground">12</p>
        <p className="text-xs text-muted-foreground">games</p>
      </GlassCard>
    </div>
  );
};

export default StatsPanel;