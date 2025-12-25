import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { Crown, Medal, Trophy } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  winnings: number;
  games: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "CryptoKing_99", winnings: 125000, games: 342 },
  { rank: 2, username: "DiamondHands", winnings: 89500, games: 256 },
  { rank: 3, username: "MonadMaster", winnings: 67200, games: 189 },
  { rank: 4, username: "RiskTaker_X", winnings: 45800, games: 167 },
  { rank: 5, username: "LuckyDegen", winnings: 34200, games: 134 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-4 h-4 text-accent" />;
    case 2:
      return <Medal className="w-4 h-4 text-foreground/60" />;
    case 3:
      return <Trophy className="w-4 h-4 text-secondary" />;
    default:
      return <span className="text-xs text-muted-foreground font-mono w-4 text-center">{rank}</span>;
  }
};

const Leaderboard = () => {
  return (
    <GlassCard variant="elevated" className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Top Players</h3>
        <span className="text-xs text-muted-foreground">This Week</span>
      </div>

      <div className="space-y-2">
        {mockLeaderboard.map((entry, index) => (
          <motion.div
            key={entry.username}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="w-6 flex justify-center">
              {getRankIcon(entry.rank)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{entry.username}</p>
              <p className="text-xs text-muted-foreground">
                {entry.games} games
              </p>
            </div>
            
            <div className="text-right">
              <NeonText 
                variant={entry.rank === 1 ? "accent" : "primary"} 
                className="text-sm"
              >
                {entry.winnings.toLocaleString()}
              </NeonText>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default Leaderboard;