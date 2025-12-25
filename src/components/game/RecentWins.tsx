import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { useState, useEffect } from "react";

interface RecentWin {
  id: string;
  username: string;
  amount: number;
  multiplier: number;
  game: string;
}

const GAMES = ["🥤 Cups", "⚡ Reflex", "🧠 Memory", "🚀 Crash"];
const USERNAMES = [
  "CryptoKing", "DiamondHands", "LuckyDegen", "MonadPro", 
  "RiskRunner", "BigWins", "CupMaster", "FastFingers"
];

const generateRandomWin = (): RecentWin => ({
  id: Math.random().toString(36).substr(2, 9),
  username: USERNAMES[Math.floor(Math.random() * USERNAMES.length)] + Math.floor(Math.random() * 100),
  amount: Math.floor(Math.random() * 5000) + 100,
  multiplier: Math.floor(Math.random() * 800 + 100) / 100,
  game: GAMES[Math.floor(Math.random() * GAMES.length)],
});

const RecentWins = () => {
  const [wins, setWins] = useState<RecentWin[]>([
    generateRandomWin(),
    generateRandomWin(),
    generateRandomWin(),
    generateRandomWin(),
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWins((prev) => [generateRandomWin(), ...prev.slice(0, 3)]);
    }, 4000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard variant="elevated" className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Live Wins</h3>
        <span className="flex items-center gap-1.5 text-xs text-primary">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          Live
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {wins.map((win) => (
            <motion.div
              key={win.id}
              layout
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                {win.username.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{win.username}</p>
                <p className="text-xs text-muted-foreground">{win.game}</p>
              </div>
              
              <div className="text-right shrink-0">
                <NeonText variant="primary" className="text-sm font-bold">
                  +{win.amount.toLocaleString()}
                </NeonText>
                <p className="text-xs text-muted-foreground">{win.multiplier}x</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};

export default RecentWins;