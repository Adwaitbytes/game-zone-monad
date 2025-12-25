import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { useState, useEffect } from "react";

interface RecentWin {
  id: string;
  username: string;
  amount: number;
  multiplier: number;
  timestamp: Date;
}

const generateRandomWin = (): RecentWin => {
  const usernames = [
    "CryptoWhale", "DegenKing", "MonadPro", "LuckyShot", 
    "DiamondGrip", "RiskRunner", "BigWins99", "CupMaster"
  ];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    username: usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 100),
    amount: Math.floor(Math.random() * 5000) + 100,
    multiplier: Math.floor(Math.random() * 800 + 100) / 100,
    timestamp: new Date(),
  };
};

const RecentWins = () => {
  const [wins, setWins] = useState<RecentWin[]>([
    generateRandomWin(),
    generateRandomWin(),
    generateRandomWin(),
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWins((prev) => {
        const newWin = generateRandomWin();
        return [newWin, ...prev.slice(0, 4)];
      });
    }, 5000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard variant="elevated" className="h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">
          Recent Wins
        </h3>
        <span className="text-xs text-secondary animate-pulse">● Live Feed</span>
      </div>

      <div className="space-y-2 relative">
        <AnimatePresence mode="popLayout">
          {wins.map((win) => (
            <motion.div
              key={win.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-secondary/10 border border-secondary/20"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-xs font-bold text-secondary-foreground">
                {win.username.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{win.username}</p>
                <p className="text-xs text-muted-foreground">
                  {win.multiplier}x multiplier
                </p>
              </div>
              
              <motion.div 
                className="text-right"
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
              >
                <NeonText variant="secondary" className="text-sm font-bold">
                  +{win.amount.toLocaleString()}
                </NeonText>
                <p className="text-xs text-muted-foreground">MON</p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};

export default RecentWins;
