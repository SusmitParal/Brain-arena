export type Language = 'en' | 'hi' | 'bn';

export interface Question {
  id: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert' | 'Master';
  question: string;
  options: string[];
  answer: string; // The correct answer text
}

export type ChestTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Black';
export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type ItemType = 'AVATAR' | 'FRAME' | 'EMOJI';

export interface GameItem {
  id: string;
  type: ItemType;
  name: string;
  rarity: ItemRarity;
  content: string; // Emoji character or Image URL
  priceCoins?: number; // Cost in shop
}

export interface UserChest {
  id: string;
  tier: ChestTier;
  obtainedAt: number;
  unlockStartedAt?: number;
  isUnlocked: boolean;
  timeReducedByAds: number; // in milliseconds
}

export interface Teammate {
  id: string;
  name: string;
  isOnline: boolean;
  avatar: string;
}

export interface UserProfile {
  id: string;         // Internal UUID
  friendCode: string; // Public 6-digit ID for friends
  name: string;
  sps: number;
  rds: number;       // Premium Currency
  exp: number;        // Total Cumulative Experience Points
  stars: number;      // Total Stars collected (Determines Rank)
  level: number;      // Player Level (Calculated from EXP)
  rating: number;     // Matchmaking Rating (ELO)
  matchesPlayed: number;
  matchesWon: number;
  language: Language;
  inventory: string[]; // List of Item IDs owned
  chests: UserChest[]; // List of chest slots (Max 4)
  friends: Teammate[]; // List of friends
  teamName?: string;   // If they belong to a team
  lastDailyClaim: number; // Timestamp of last daily reward
  streak: number;      // Current login streak days
  selectedAvatar?: string; // ID of the selected avatar
  bronzeChestPenaltyMatches: number; // Number of matches with bronze chest penalty
}

export interface GameConfig {
  mode: 'SOLO' | 'BATTLE' | 'PASS_N_PLAY' | 'TEAM_BATTLE';
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Expert' | 'Master';
  entryFee: number;
  questionCount?: number;
  isTeam?: boolean;
}

export type ScreenState = 'HOME' | 'MODE_SELECT' | 'GAME_LOBBY' | 'GAME_PLAY' | 'GAME_RESULT' | 'PASS_N_PLAY' | 'LEADERBOARD' | 'PROFILE' | 'SETTINGS' | 'STORE' | 'SOCIAL_HUB' | 'TEAM_LOBBY' | 'TEAM_BATTLE';

export interface GameResult {
  won: boolean;
  score: number;
  spsEarned: number;
  expEarned: number;
  starsEarned: number;
  ratingChange: number;
  correctAnswers: number;
  totalQuestions: number;
  winnerName?: string; // For Pass n Play
  chestEarned?: ChestTier; // New field for reward
  isTeamMatch?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isSystem?: boolean;
  isTaunt?: boolean;
}
