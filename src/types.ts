export interface UserProfile {
  id: string;         // Internal UUID
  friendCode: string; // Public 6-digit ID for friends
  name: string;
  sps: number;        // Smart Points (in-game currency)
  rds: number;        // Rare Diamonds (premium currency)
  exp: number;        // Total Cumulative Experience Points
  stars: number;      // Total Stars collected (Determines Rank)
  level: number;      // Player Level (Calculated from EXP)
  rank: Rank;         // e.g., 'Neuron', 'Synapse'
  tier: number;       // 3, 2, or 1 within a Rank
  matchesPlayed: number;
  matchesWon: number;
  language: 'en' | 'hi' | 'bn';
  inventory: string[]; // IDs of owned items (avatars, borders)
  chests: UserChest[];
  friends: string[];   // Array of friendCodes
  lastDailyClaim: number; // Timestamp
  streak: number;
  selectedAvatar: string;
  selectedBorder: string;
  bronzeChestPenaltyMatches: number;
  seenQuestionIds: string[];
}

export type Rank = 'Neuron' | 'Synapse' | 'Cortex' | 'Overmind' | 'Oracle' | 'Apex Intellect' | 'Omniscient';

export interface UserChest {
  id: string;
  tier: ChestTier;
  obtainedAt: number;
  isUnlocked: boolean;
  timeReducedByAds: number;
}

export type ChestTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface GameResult {
  won: boolean;
  score: number;
  spsEarned: number;
  expEarned: number;
  starsEarned: number;
  ratingChange: number;
  correctAnswers: number;
  totalQuestions: number;
  chestEarned?: ChestTier;
  isTeamMatch?: boolean;
  winnerName?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  topic: string;
}

export type ScreenState = 'HOME' | 'MODE_SELECT' | 'GAME_LOBBY' | 'GAME_PLAY' | 'GAME_RESULT' | 'STORE' | 'SOCIAL_HUB' | 'TEAM_LOBBY' | 'TEAM_BATTLE' | 'LEADERBOARD' | 'TOURNAMENTS' | 'SETTINGS' | 'PROFILE' | 'PASS_N_PLAY' | 'SOLO_GAME_LOBBY' | 'TIME_ATTACK' | 'SURVIVAL';
