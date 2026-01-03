export interface Tournament {
  id: string;
  name: string;
  game: 'cups' | 'reaction' | 'memory' | 'crash';
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  currentPlayers: number;
  status: 'upcoming' | 'live' | 'ended';
  startTime: number;
  endTime: number;
  sponsored?: boolean;
  sponsorLogo?: string;
  winners?: {
    address: string;
    prize: number;
    rank: number;
  }[];
}

export interface TournamentEntry {
  tournamentId: string;
  playerAddress: string;
  score: number;
  timestamp: number;
  txHash: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  score: number;
  prize: number;
  isCurrentUser?: boolean;
}
