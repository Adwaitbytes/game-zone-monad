import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Trophy, Medal, Award } from "lucide-react";
import { LeaderboardEntry } from "@/types/tournament";
import { cn } from "@/lib/utils";

interface TournamentLeaderboardProps {
  entries: LeaderboardEntry[];
  prizePool: number;
}

export const TournamentLeaderboard = ({ entries, prizePool }: TournamentLeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-500/10 border-amber-500/50';
      case 2:
        return 'bg-gray-400/10 border-gray-400/50';
      case 3:
        return 'bg-amber-700/10 border-amber-700/50';
      default:
        return '';
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          Live Leaderboard
        </h3>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total Prize</p>
          <p className="text-lg font-bold text-primary">{prizePool} MON</p>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={`${entry.address}-${entry.rank}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg transition-all",
              entry.isCurrentUser ? "bg-primary/20 border border-primary/50" : "bg-black/20",
              getRankColor(entry.rank)
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 flex justify-center">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <p className="font-mono text-sm">
                  {entry.isCurrentUser ? 'You' : `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                </p>
                <p className="text-xs text-muted-foreground">Score: {entry.score.toLocaleString()}</p>
              </div>
            </div>
            
            {entry.prize > 0 && (
              <div className="text-right">
                <p className="font-bold text-primary">+{entry.prize} MON</p>
                <p className="text-xs text-muted-foreground">Prize</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};
