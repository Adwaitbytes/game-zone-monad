// Game Zone Monad Smart Contract ABIs

export const TOURNAMENT_ABI = [
  // Enter tournament
  {
    inputs: [
      { name: "tournamentId", type: "uint256" },
    ],
    name: "enterTournament",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // Submit score
  {
    inputs: [
      { name: "tournamentId", type: "uint256" },
      { name: "score", type: "uint256" },
      { name: "proof", type: "bytes32[]" },
    ],
    name: "submitScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Claim prize
  {
    inputs: [
      { name: "tournamentId", type: "uint256" },
    ],
    name: "claimPrize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Get tournament info
  {
    inputs: [
      { name: "tournamentId", type: "uint256" },
    ],
    name: "getTournament",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "entryFee", type: "uint256" },
          { name: "prizePool", type: "uint256" },
          { name: "maxPlayers", type: "uint256" },
          { name: "currentPlayers", type: "uint256" },
          { name: "startTime", type: "uint256" },
          { name: "endTime", type: "uint256" },
          { name: "status", type: "uint8" },
        ],
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Get leaderboard
  {
    inputs: [
      { name: "tournamentId", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
    name: "getLeaderboard",
    outputs: [
      {
        components: [
          { name: "player", type: "address" },
          { name: "score", type: "uint256" },
          { name: "timestamp", type: "uint256" },
        ],
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tournamentId", type: "uint256" },
      { indexed: true, name: "player", type: "address" },
      { indexed: false, name: "entryFee", type: "uint256" },
    ],
    name: "TournamentEntered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tournamentId", type: "uint256" },
      { indexed: true, name: "player", type: "address" },
      { indexed: false, name: "score", type: "uint256" },
    ],
    name: "ScoreSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tournamentId", type: "uint256" },
      { indexed: true, name: "winner", type: "address" },
      { indexed: false, name: "prize", type: "uint256" },
    ],
    name: "PrizeClaimed",
    type: "event",
  },
] as const;

export const NFT_REWARDS_ABI = [
  // Mint achievement NFT
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "achievementId", type: "uint256" },
    ],
    name: "mintAchievement",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Get user NFTs
  {
    inputs: [
      { name: "owner", type: "address" },
    ],
    name: "getUserNFTs",
    outputs: [{ type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Contract addresses (update with actual deployed addresses)
export const CONTRACTS = {
  TOURNAMENT: "0x0000000000000000000000000000000000000000", // Replace with deployed address
  NFT_REWARDS: "0x0000000000000000000000000000000000000000", // Replace with deployed address
  GAME_TOKEN: "0x0000000000000000000000000000000000000000", // Replace with deployed address
} as const;
