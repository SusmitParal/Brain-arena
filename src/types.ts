// Core Player and Progression Types

export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grand Master';

export interface UserProfile {
  id: string; // Internal UUID
  friendCode: string; // Public 6-digit ID
  name: string;
  coins: number; // In-game currency
  gems: number; // Premium currency
  exp: number; // Experience Points
  stars: number; // 0-4 stars within a tier
  level: number; // Calculated from EXP
  rank: Rank;
  tier: number; // Tiers within a Rank (e.g., Gold I, Gold II)
  matchesPlayed: number;
  matchesWon: number;
  language: 'en' | 'hi' | 'bn';
  inventory: string[]; // IDs of owned ShopItems
  chests: UserChest[];
  friends: string[]; // Array of friendCodes
  selectedAvatar: string; // ID of a ShopItem
  selectedBorder: string; // ID of a ShopItem
  bronzeChestPenaltyMatches: number; // The "Bronze Curse" counter
  seenQuestionIds: string[];
}

// Game Modes and Logic

export type GameMode = 'SOLO_CLIMB' | 'PVP_TOUR' | 'TEAM_BATTLE' | 'PASS_N_PLAY';

export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  topic: string;
  imageUrl?: string;
}

export interface Arena {
  id: string;
  name: string;
  slug: string; // for image generation
  description: string;
  entryFee: number;
  prizePool: number;
  minLevel: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
}

// Economy and Rewards

export type ChestTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface UserChest {
  id: string;
  tier: ChestTier;
  status: 'LOCKED' | 'UNLOCKING' | 'READY';
  unlockTimeRemaining: number; // in seconds
  obtainedAt: number; // Timestamp
}

// Shop and Customization

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type ItemType = 'Avatar' | 'Border';

export interface ShopItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  cost: number;
  assetName: string; // e.g., 'avatar_cyber_brain', 'border_neon_fire'
}

// UI and Navigation

export type ScreenState = 
  | 'HOME'
  | 'MODE_SELECT'
  | 'SOLO_LOBBY'
  | 'PVP_LOBBY' // World Tour city selection
  | 'TEAM_LOBBY'
  | 'PASS_N_PLAY_LOBBY'
  | 'GAME_SOLO_CLIMB'
  | 'GAME_PVP_DUEL'
  | 'GAME_TEAM_BATTLE'
  | 'GAME_PASS_N_PLAY'
  | 'GAME_RESULT'
  | 'SHOP'
  | 'PROFILE'
  | 'LEADERBOARD'
  | 'SETTINGS';

