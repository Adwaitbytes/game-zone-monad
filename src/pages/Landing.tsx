import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlowButton } from "@/components/ui/GlowButton";
import { NeonText } from "@/components/ui/NeonText";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Gamepad2, Trophy, Zap, Brain, Rocket, Shield, 
  Sparkles, ChevronDown, Wallet, TrendingUp, Users,
  Star, Play, ArrowRight
} from "lucide-react";
import { soundManager } from "@/lib/soundManager";
import { useWeb3 } from "@/hooks/useWeb3";
import { analytics } from "@/lib/analytics";
import Header from "@/components/game/Header";

const FEATURED_GAMES = [
  {
    id: "cups",
    name: "Shell Game",
    icon: "🥤",
    description: "Test your luck! Find the safe cup and multiply your winnings up to 50x",
    color: "from-violet-500 to-purple-600",
    multiplier: "Up to 50x",
    players: "2.4k playing",
  },
  {
    id: "reaction",
    name: "Lightning Reflex",
    icon: "⚡",
    description: "How fast can you react? Sub-150ms gets you 5x your bet!",
    color: "from-amber-500 to-orange-600",
    multiplier: "Up to 5x",
    players: "1.8k playing",
  },
  {
    id: "memory",
    name: "Mind Palace",
    icon: "🧠",
    description: "Remember the sequence. Each level increases your multiplier exponentially",
    color: "from-emerald-500 to-teal-600",
    multiplier: "Up to 11x",
    players: "3.1k playing",
  },
  {
    id: "crash",
    name: "Rocket Crash",
    icon: "🚀",
    description: "Ride the rocket! Cash out before it crashes or lose everything",
    color: "from-rose-500 to-pink-600",
    multiplier: "Unlimited",
    players: "5.2k playing",
  },
];

const STATS = [
  { label: "Total Wagered", value: "$12.5M+", icon: TrendingUp },
  { label: "Active Players", value: "45,000+", icon: Users },
  { label: "Games Played", value: "2.1M+", icon: Gamepad2 },
  { label: "Biggest Win", value: "$125,000", icon: Trophy },
];

const Landing = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const { connect, isConnected, address } = useWeb3();
  
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);

  useEffect(() => {
    analytics.track('landing_page_viewed');
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      analytics.trackWalletConnect(address);
    }
  }, [isConnected, address]);

  const handleConnectWallet = async () => {
    soundManager.play('start');
    analytics.track('wallet_connect_initiated', { source: 'landing_cta' });
    connect();
    if (isConnected) {
      soundManager.play('win');
      navigate("/play");
    }
  };

  const handlePlayAsGuest = () => {
    soundManager.play('click');
    analytics.track('play_as_guest_clicked');
    navigate("/play");
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs following mouse */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
        
        {/* Static orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">The Future of Gaming is Here</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block text-foreground">Play. Win.</span>
            <NeonText 
              variant="primary" 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient"
            >
              Dominate.
            </NeonText>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Experience the next generation of arcade gaming. 
            <span className="text-foreground font-medium"> Instant payouts, provably fair, </span>
            and endlessly entertaining.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <GlowButton
              variant="primary"
              size="xl"
              onClick={handleConnectWallet}
              pulse
              className="min-w-[220px] text-lg h-14"
            >
              {!isConnected ? (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Play Now
                </>
              )}
            </GlowButton>
            
            <GlowButton
              variant="ghost"
              size="xl"
              onClick={handlePlayAsGuest}
              className="min-w-[220px] text-lg h-14"
            >
              <Play className="w-5 h-5" />
              Play as Guest
            </GlowButton>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Provably Fair</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>Instant Payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              <span>45k+ Players</span>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 text-center hover:border-primary/30 transition-colors">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="relative py-20 px-4" id="games">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <NeonText variant="primary">Choose Your Game</NeonText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four unique games, endless possibilities. Each game is provably fair with real-time multipliers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURED_GAMES.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => navigate("/play")}
                className="cursor-pointer"
              >
                <GlassCard 
                  variant="elevated" 
                  className="p-6 h-full hover:border-primary/40 transition-all duration-300 group overflow-hidden relative"
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg`}>
                          {game.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{game.name}</h3>
                          <p className="text-sm text-muted-foreground">{game.players}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Multiplier</p>
                        <p className="text-lg font-bold text-primary">{game.multiplier}</p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{game.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${game.color} border-2 border-background flex items-center justify-center text-xs font-bold text-white`}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                          +99
                        </div>
                      </div>
                      
                      <motion.div
                        className="flex items-center gap-2 text-primary font-medium"
                        whileHover={{ x: 5 }}
                      >
                        Play Now <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Why Players <NeonText variant="accent">Love Us</NeonText>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Provably Fair",
                description: "Every game outcome can be verified. Our algorithms are transparent and auditable.",
              },
              {
                icon: Zap,
                title: "Instant Payouts",
                description: "Winnings are credited to your wallet immediately. No waiting, no hassle.",
              },
              {
                icon: Star,
                title: "Rewarding",
                description: "Level up, earn XP, and unlock exclusive rewards as you play.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-8 text-center h-full hover:border-primary/30 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard variant="primary" className="p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                  Ready to Play?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join thousands of players and start winning today. Your next big win is just a click away.
                </p>
                <GlowButton
                  variant="primary"
                  size="xl"
                  onClick={handleConnectWallet}
                  pulse
                  className="min-w-[250px] text-lg h-14"
                >
                  <Wallet className="w-5 h-5" />
                  Start Playing Now
                </GlowButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 px-4 border-t border-border/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-sm">🎰</span>
            </div>
            <span className="font-bold">Neon Arcade</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Neon Arcade. Play responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
