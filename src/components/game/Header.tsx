import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonText } from "@/components/ui/NeonText";
import { Wallet, Volume2, VolumeX, Trophy, Home, Star } from "lucide-react";
import { useState } from "react";
import { GameType } from "@/hooks/useGameState";
import { soundManager } from "@/lib/soundManager";
import { useWeb3 } from "@/hooks/useWeb3";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  activeGame?: GameType;
  onGameChange?: (game: GameType) => void;
  showGameNav?: boolean;
}

const GAMES: { id: GameType; name: string; icon: string }[] = [
  { id: "cups", name: "Cups", icon: "🥤" },
  { id: "reaction", name: "Reflex", icon: "⚡" },
  { id: "memory", name: "Memory", icon: "🧠" },
  { id: "crash", name: "Crash", icon: "🚀" },
];

const Header = ({ activeGame, onGameChange, showGameNav = true }: HeaderProps) => {
  const [isMuted, setIsMuted] = useState(!soundManager.isEnabled());
  const { address, isConnected, balanceFormatted, symbol, connect } = useWeb3();
  const navigate = useNavigate();

  const toggleSound = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    soundManager.setEnabled(!newMutedState);
    if (!newMutedState) {
      soundManager.play('click');
    }
  };

  const handleGameChange = (game: GameType) => {
    soundManager.play('click');
    onGameChange?.(game);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass-elevated border-b border-border/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3 shrink-0 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-lg">🎮</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground tracking-tight">Game Zone</h1>
            <p className="text-xs text-muted-foreground">Powered by Monad</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <motion.button
            onClick={() => navigate('/')}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/tournaments')}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Tournaments</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/rewards')}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Rewards</span>
          </motion.button>
        </nav>

        {/* Game Navigation (only on play page) */}
        {showGameNav && activeGame && (
          <nav className="flex items-center gap-1 bg-muted/30 rounded-xl p-1">
            {GAMES.map((game) => (
              <motion.button
                key={game.id}
                onClick={() => handleGameChange(game.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeGame === game.id 
                    ? "bg-primary/20 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{game.icon}</span>
                <span className="hidden sm:inline">{game.name}</span>
              </motion.button>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound Toggle */}
          <motion.button
            onClick={toggleSound}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-foreground" />
            )}
          </motion.button>

          {/* Wallet/Balance */}
          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-xl border border-primary/20">
                <NeonText variant="primary" className="text-sm font-bold">
                  {parseFloat(balanceFormatted).toFixed(4)} {symbol}
                </NeonText>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {formatAddress(address)}
                </span>
              </div>
            </div>
          ) : (
            <motion.button
              onClick={connect}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-xl font-medium text-sm shadow-glow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;