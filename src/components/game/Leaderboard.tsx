import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { Crown, Medal, Trophy } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  winnings: number;
  multiplier: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "CryptoKing_99", winnings: 125000, multiplier: 12.5 },
  { rank: 2, username: "DiamondHands", winnings: 89500, multiplier: 8.95 },
  { rank: 3, username: "MonadMaster", winnings: 67200, multiplier: 6.72 },
  { rank: 4, username: "RiskTaker_X", winnings: 45800, multiplier: 4.58 },
  { rank: 5, username: "LuckyDegen", winnings: 34200, multiplier: 3.42 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-4 h-4 text-warning" />;
    case 2:
      return <Medal className="w-4 h-4 text-foreground/60" />;
    case 3:
      return <Trophy className="w-4 h-4 text-primary" />;
    default:
      return <span className="text-xs text-muted-foreground font-mono">#{rank}</span>;
  }
};

const Leaderboard = () => {
  return (
    <GlassCard variant="elevated" className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">
          Top Players
        </h3>
        <span className="text-xs text-primary animate-pulse">● Live</span>
      </div>

      <div className="space-y-2">
        {mockLeaderboard.map((entry, index) => (
          <motion.div
            key={entry.username}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="w-6 flex justify-center">
              {getRankIcon(entry.rank)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{entry.username}</p>
              <p className="text-xs text-muted-foreground">
                {entry.multiplier}x max
              </p>
            </div>
            
            <div className="text-right">
              <NeonText 
                variant={entry.rank <= 3 ? "secondary" : "primary"} 
                className="text-sm"
              >
                {entry.winnings.toLocaleString()}
              </NeonText>
              <p className="text-xs text-muted-foreground">MON</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default Leaderboard;
