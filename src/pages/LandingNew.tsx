import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Trophy, Zap, Users, Shield, ArrowRight, 
  CheckCircle2, Sparkles, TrendingUp, Target
} from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";

const LandingNew = () => {
  const navigate = useNavigate();
  const { connect, isConnected } = useWeb3();
  const [hoveredGame, setHoveredGame] = useState<number | null>(null);

  const games = [
    { 
      name: "Cup Game", 
      icon: "🎯", 
      mult: "50x", 
      color: "from-violet-600 to-purple-600",
      glow: "shadow-[0_0_40px_rgba(139,92,246,0.3)]"
    },
    { 
      name: "Reaction", 
      icon: "⚡", 
      mult: "5x", 
      color: "from-amber-600 to-yellow-600",
      glow: "shadow-[0_0_40px_rgba(245,158,11,0.3)]"
    },
    { 
      name: "Memory", 
      icon: "🧠", 
      mult: "11x", 
      color: "from-emerald-600 to-teal-600",
      glow: "shadow-[0_0_40px_rgba(16,185,129,0.3)]"
    },
    { 
      name: "Crash", 
      icon: "🚀", 
      mult: "∞", 
      color: "from-rose-600 to-pink-600",
      glow: "shadow-[0_0_40px_rgba(244,63,94,0.3)]"
    },
  ];

  const handleConnect = () => {
    if (isConnected) {
      navigate('/play');
    } else {
      connect();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950 via-black to-black" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-black">
              GZ
            </div>
            <div>
              <div className="text-lg font-bold">Game Zone</div>
              <div className="text-xs text-emerald-400">Powered by Monad</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => navigate('/tournaments')}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Tournaments
            </Button>
            
            <Button
              onClick={handleConnect}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {isConnected ? 'Play Now' : 'Connect Wallet'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-24 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Live on Monad Blockchain
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              Skill Meets
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Real Rewards
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Play competitive skill-based games, win tournaments, and earn crypto rewards.
              All on-chain, provably fair, lightning fast.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                size="lg"
                onClick={handleConnect}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-14 px-8 text-lg w-full sm:w-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]"
              >
                {isConnected ? 'Start Playing' : 'Connect Wallet'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/tournaments')}
                className="border-white/10 hover:bg-white/5 h-14 px-8 text-lg w-full sm:w-auto"
              >
                <Trophy className="w-5 h-5 mr-2" />
                View Tournaments
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Provably Fair
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Instant Payouts
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                45,000+ Players
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="relative z-10 container mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your Game</h2>
          <p className="text-gray-400 text-lg">Four skill-based games. Real prizes. No luck required.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredGame(index)}
              onMouseLeave={() => setHoveredGame(null)}
              className="relative"
            >
              <div className={`
                relative p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent
                transition-all duration-300 cursor-pointer
                ${hoveredGame === index ? game.glow : ''}
              `}>
                {/* Game Icon */}
                <div className="text-6xl mb-4">{game.icon}</div>
                
                {/* Game Info */}
                <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${game.color} text-white text-sm font-bold`}>
                  Up to {game.mult}
                </div>

                {/* Play Button */}
                <Button
                  className="w-full mt-6 bg-white/10 hover:bg-white/20 border-0"
                  onClick={() => navigate('/play')}
                >
                  Play Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 container mx-auto px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Total Wagered", value: "$12.5M+", icon: TrendingUp },
              { label: "Active Players", value: "45,000+", icon: Users },
              { label: "Tournaments", value: "1,200+", icon: Trophy },
              { label: "Avg Win Rate", value: "96.5%", icon: Target },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/10">
                  <stat.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Game Zone?</h2>
            <p className="text-gray-400 text-lg">Built for serious players who want real rewards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Provably Fair", 
                desc: "Every game outcome is verifiable on-chain" 
              },
              { 
                icon: Zap, 
                title: "Instant Payouts", 
                desc: "Withdraw your winnings anytime, instantly" 
              },
              { 
                icon: Trophy, 
                title: "Real Tournaments", 
                desc: "Compete for prize pools up to $10,000" 
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent"
              >
                <div className="w-12 h-12 mb-4 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-4" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 container mx-auto px-6 pb-32">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <h2 className="text-4xl font-bold mb-4">Ready to Win?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of players earning real rewards
          </p>
          <Button
            size="lg"
            onClick={handleConnect}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-14 px-12 text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)]"
          >
            {isConnected ? 'Start Playing Now' : 'Connect Wallet'}
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          © 2026 Game Zone. Powered by Monad Blockchain.
        </div>
      </footer>
    </div>
  );
};

export default LandingNew;
