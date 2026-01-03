import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/game/Header";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { TournamentLeaderboard } from "@/components/tournament/TournamentLeaderboard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Flame, Clock, CheckCircle2 } from "lucide-react";
import { Tournament, LeaderboardEntry } from "@/types/tournament";
import { useWeb3 } from "@/hooks/useWeb3";
import { toast } from "sonner";

// Mock tournament data - Replace with blockchain calls
const mockTournaments: Tournament[] = [
  {
    id: "1",
    name: "🚀 Crash Championship",
    game: "crash",
    entryFee: 10,
    prizePool: 500,
    maxPlayers: 50,
    currentPlayers: 34,
    status: "live",
    startTime: Date.now() - 3600000,
    endTime: Date.now() + 3600000,
  },
  {
    id: "2",
    name: "⚡ Speed Reaction",
    game: "reaction",
    entryFee: 5,
    prizePool: 250,
    maxPlayers: 100,
    currentPlayers: 87,
    status: "live",
    startTime: Date.now() - 1800000,
    endTime: Date.now() + 5400000,
  },
  {
    id: "3",
    name: "🧠 Memory Masters",
    game: "memory",
    entryFee: 15,
    prizePool: 750,
    maxPlayers: 30,
    currentPlayers: 12,
    status: "upcoming",
    startTime: Date.now() + 7200000,
    endTime: Date.now() + 14400000,
    sponsored: true,
  },
  {
    id: "4",
    name: "🥤 Cup King Challenge",
    game: "cups",
    entryFee: 20,
    prizePool: 1000,
    maxPlayers: 25,
    currentPlayers: 25,
    status: "live",
    startTime: Date.now() - 900000,
    endTime: Date.now() + 2700000,
  },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, address: "0x1234567890123456789012345678901234567890", score: 15420, prize: 250 },
  { rank: 2, address: "0x2345678901234567890123456789012345678901", score: 14230, prize: 150 },
  { rank: 3, address: "0x3456789012345678901234567890123456789012", score: 13890, prize: 100 },
  { rank: 4, address: "0x4567890123456789012345678901234567890123", score: 12450, prize: 0 },
  { rank: 5, address: "0x5678901234567890123456789012345678901234", score: 11220, prize: 0 },
];

const Tournaments = () => {
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "ended">("live");
  const { address, isConnected } = useWeb3();

  const filteredTournaments = mockTournaments.filter(t => t.status === activeTab);

  const handleEnterTournament = (tournamentId: string) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    const tournament = mockTournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    // TODO: Implement smart contract call to enter tournament
    toast.success(`Entering ${tournament.name}...`, {
      description: `Entry fee: ${tournament.entryFee} MON`,
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Header showGameNav={false} />

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Tournaments
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compete in skill-based tournaments. Win prizes. Climb the leaderboard.
          </p>
        </motion.div>

        {/* Tournament Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTournaments.filter(t => t.status === 'live').length}</p>
                <p className="text-sm text-muted-foreground">Live Now</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockTournaments.reduce((acc, t) => acc + t.prizePool, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Prizes (MON)</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTournaments.filter(t => t.status === 'upcoming').length}</p>
                <p className="text-sm text-muted-foreground">Starting Soon</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockTournaments.reduce((acc, t) => acc + t.currentPlayers, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Active Players</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tournaments List */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="live" className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Live
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="ended" className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Ended
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredTournaments.length > 0 ? (
                  filteredTournaments.map((tournament) => (
                    <TournamentCard
                      key={tournament.id}
                      tournament={tournament}
                      onEnter={handleEnterTournament}
                      userAddress={address}
                    />
                  ))
                ) : (
                  <GlassCard className="p-12 text-center">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No {activeTab} tournaments</p>
                  </GlassCard>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Featured Tournament Leaderboard */}
          <div className="lg:col-span-1">
            <TournamentLeaderboard
              entries={mockLeaderboard.map(entry => ({
                ...entry,
                isCurrentUser: entry.address.toLowerCase() === address?.toLowerCase(),
              }))}
              prizePool={500}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tournaments;
