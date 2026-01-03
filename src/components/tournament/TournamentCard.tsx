import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Clock, TrendingUp, Star, Sparkles } from "lucide-react";
import { Tournament } from "@/types/tournament";
import { formatDistanceToNow } from "date-fns";

interface TournamentCardProps {
  tournament: Tournament;
  onEnter: (tournamentId: string) => void;
  userAddress?: string;
}

export const TournamentCard = ({ tournament, onEnter, userAddress }: TournamentCardProps) => {
  const isLive = tournament.status === 'live';
  const isFull = tournament.currentPlayers >= tournament.maxPlayers;
  const timeLeft = formatDistanceToNow(tournament.startTime, { addSuffix: true });
  
  const statusColors = {
    upcoming: 'bg-blue-500/20 text-blue-400',
    live: 'bg-green-500/20 text-green-400',
    ended: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard className="p-6 relative overflow-hidden">
        {/* Background gradient */}
        {isLive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {tournament.sponsored && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/50">
              <Star className="w-3 h-3 mr-1" />
              Sponsored
            </Badge>
          </div>
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{tournament.name}</h3>
              <Badge className={statusColors[tournament.status]}>
                {tournament.status === 'live' && <Sparkles className="w-3 h-3 mr-1 animate-pulse" />}
                {tournament.status.toUpperCase()}
              </Badge>
            </div>
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Prize Pool
              </p>
              <p className="text-lg font-bold text-primary">{tournament.prizePool} MON</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                Players
              </p>
              <p className="text-lg font-bold">
                {tournament.currentPlayers}/{tournament.maxPlayers}
              </p>
            </div>
          </div>

          {/* Entry Fee & Time */}
          <div className="flex items-center justify-between mb-4 p-3 bg-black/20 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Entry Fee</p>
              <p className="text-sm font-bold">{tournament.entryFee} MON</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3" />
                {tournament.status === 'upcoming' ? 'Starts' : 'Started'}
              </p>
              <p className="text-sm font-medium">{timeLeft}</p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => onEnter(tournament.id)}
            disabled={isFull || tournament.status === 'ended'}
            className="w-full"
            size="lg"
          >
            {isFull ? 'Tournament Full' : tournament.status === 'ended' ? 'Ended' : 'Enter Tournament'}
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
};
