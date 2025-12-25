import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { NeonText } from "@/components/ui/NeonText";
import { Wallet, Volume2, VolumeX, Settings } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  walletAddress?: string;
  balance: number;
}

const Header = ({ isConnected, onConnect, walletAddress, balance }: HeaderProps) => {
  const [isMuted, setIsMuted] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass-elevated border-b border-border/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-danger flex items-center justify-center shadow-neon-primary">
              <span className="text-xl">🎰</span>
            </div>
            <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md -z-10" />
          </div>
          <div>
            <NeonText variant="primary" className="text-xl tracking-wider">
              MONAD
            </NeonText>
            <p className="text-xs text-muted-foreground -mt-1 font-display tracking-widest">
              ARCADE
            </p>
          </div>
        </motion.div>

        {/* Center - Game Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {["Cup Game", "Reaction", "Memory", "Extraction"].map((game, i) => (
            <motion.button
              key={game}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                i === 0 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {game}
              {i > 0 && (
                <span className="ml-1 text-xs text-muted-foreground/50">Soon</span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Right - Wallet & Controls */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <motion.button
            onClick={() => setIsMuted(!isMuted)}
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

          {/* Settings */}
          <motion.button
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors hidden md:block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          {/* Wallet */}
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-display text-foreground">
                  {balance.toLocaleString()} <span className="text-muted-foreground">MON</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatAddress(walletAddress || "")}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <Wallet className="w-5 h-5 text-secondary-foreground" />
              </div>
            </div>
          ) : (
            <GlowButton variant="secondary" size="md" onClick={onConnect}>
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Connect</span>
            </GlowButton>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
