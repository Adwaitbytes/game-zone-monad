import { motion } from "framer-motion";
import Header from "@/components/game/Header";
import CupGame from "@/components/game/CupGame";
import ReactionGame from "@/components/game/ReactionGame";
import MemoryGame from "@/components/game/MemoryGame";
import CrashGame from "@/components/game/CrashGame";
import StatsPanel from "@/components/game/StatsPanel";
import Leaderboard from "@/components/game/Leaderboard";
import RecentWins from "@/components/game/RecentWins";
import GameResult from "@/components/game/GameResult";
import { useGameState } from "@/hooks/useGameState";

const Index = () => {
  const gameState = useGameState();

  const renderGame = () => {
    switch (gameState.activeGame) {
      case "cups":
        return (
          <CupGame
            gameState={gameState.cupGame}
            currentBet={gameState.currentBet}
            balance={gameState.balance}
            onSelectCup={gameState.selectCup}
            onStart={gameState.startCupGame}
            onCashOut={gameState.cashOutCups}
            onBetChange={gameState.setBetAmount}
          />
        );
      case "reaction":
        return (
          <ReactionGame
            gameState={gameState.reactionGame}
            currentBet={gameState.currentBet}
            balance={gameState.balance}
            onStart={gameState.startReactionGame}
            onHit={gameState.hitReaction}
            onBetChange={gameState.setBetAmount}
          />
        );
      case "memory":
        return (
          <MemoryGame
            gameState={gameState.memoryGame}
            currentBet={gameState.currentBet}
            balance={gameState.balance}
            onStart={gameState.startMemoryGame}
            onInput={gameState.inputMemory}
            onCashOut={gameState.cashOutMemory}
            onBetChange={gameState.setBetAmount}
          />
        );
      case "crash":
        return (
          <CrashGame
            gameState={gameState.crashGame}
            currentBet={gameState.currentBet}
            balance={gameState.balance}
            onStart={gameState.startCrashGame}
            onCashOut={gameState.cashOutCrash}
            onBetChange={gameState.setBetAmount}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden vignette">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <Header
        isConnected={gameState.isConnected}
        onConnect={gameState.connectWallet}
        walletAddress={gameState.walletAddress}
        balance={gameState.balance}
        activeGame={gameState.activeGame}
        onGameChange={gameState.setActiveGame}
      />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Leaderboard />
            </motion.div>
          </div>

          {/* Center - Game Area */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <StatsPanel
                balance={gameState.balance}
                streak={gameState.streak}
                xp={gameState.xp}
                level={gameState.level}
                gamesPlayed={gameState.gamesPlayed}
              />
            </motion.div>

            <motion.div
              key={gameState.activeGame}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderGame()}
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-3 order-3">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <RecentWins />
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground">
            🔒 Provably Fair • Powered by Monad
          </p>
        </motion.div>
      </main>

      {/* Game Result Modal */}
      <GameResult
        isVisible={gameState.gameResult.isVisible}
        isWin={gameState.gameResult.isWin}
        amount={gameState.gameResult.amount}
        multiplier={gameState.gameResult.multiplier}
        gameType={gameState.gameResult.gameType}
        message={gameState.gameResult.message}
        onPlayAgain={gameState.playAgain}
        onClose={gameState.closeResult}
      />
    </div>
  );
};

export default Index;