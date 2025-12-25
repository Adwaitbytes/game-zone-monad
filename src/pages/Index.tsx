import { motion } from "framer-motion";
import Header from "@/components/game/Header";
import GameTable from "@/components/game/GameTable";
import StatsPanel from "@/components/game/StatsPanel";
import ControlPanel from "@/components/game/ControlPanel";
import Leaderboard from "@/components/game/Leaderboard";
import RecentWins from "@/components/game/RecentWins";
import GameResult from "@/components/game/GameResult";
import { useGameState } from "@/hooks/useGameState";

const Index = () => {
  const {
    balance,
    currentBet,
    multiplier,
    round,
    isPlaying,
    selectedCup,
    revealedCups,
    lethalCup,
    streak,
    xp,
    level,
    cupsCount,
    gameResult,
    canCashOut,
    isConnected,
    walletAddress,
    setBetAmount,
    startGame,
    selectCup,
    cashOut,
    closeResult,
    playAgain,
    connectWallet,
  } = useGameState();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden vignette">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Primary glow */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [-50, 50, -50],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Secondary glow */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            y: [50, -50, 50],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Accent glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <Header
        isConnected={isConnected}
        onConnect={connectWallet}
        walletAddress={walletAddress}
        balance={balance}
      />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar - Leaderboard */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Leaderboard />
            </motion.div>
          </div>

          {/* Center - Game Area */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            {/* Stats Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StatsPanel
                balance={balance}
                currentBet={currentBet}
                multiplier={multiplier}
                round={round}
                streak={streak}
                xp={xp}
                level={level}
              />
            </motion.div>

            {/* Game Table */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GameTable
                cups={cupsCount}
                selectedCup={selectedCup}
                revealedCups={revealedCups}
                lethalCup={lethalCup}
                onSelectCup={selectCup}
                isPlaying={isPlaying}
                round={round}
              />
            </motion.div>

            {/* Control Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ControlPanel
                betAmount={currentBet}
                onBetChange={setBetAmount}
                onPlay={startGame}
                onCashOut={cashOut}
                isPlaying={isPlaying}
                canCashOut={canCashOut}
                balance={balance}
                round={round}
                multiplier={multiplier}
              />
            </motion.div>
          </div>

          {/* Right sidebar - Recent Wins */}
          <div className="lg:col-span-3 order-3">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <RecentWins />
            </motion.div>
          </div>
        </div>

        {/* Provably Fair Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-muted-foreground font-display tracking-widest uppercase">
            🔒 Provably Fair • Powered by Monad • Commit-Reveal RNG
          </p>
        </motion.div>
      </main>

      {/* Game Result Modal */}
      <GameResult
        isVisible={gameResult.isVisible}
        isWin={gameResult.isWin}
        amount={gameResult.amount}
        multiplier={gameResult.multiplier}
        round={gameResult.round}
        onPlayAgain={playAgain}
        onClose={closeResult}
      />
    </div>
  );
};

export default Index;
