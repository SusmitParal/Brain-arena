// Core Player and Progression Types

export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grand Master';

export type League = 'Bronze Bench' | 'Silver Squad' | 'Gold Guild' | 'Platinum Pantheon' | 'Diamond Dynasty' | 'Grandmaster Gallery';

export interface UserProfile {
  id: string; // Internal UUID
  name: string;
  coins: number; // In-game currency
  gems: number; // Premium currency
  exp: number; // Experience Points
  stars: number; // 0-4 stars within a tier
  level: number; // Calculated from EXP
  rank: Rank;
  league: League;
  tier: number; // Tiers within a Rank (e.g., Gold I, Gold II)
  brainPower: number; // 0-100
  titles: string[];
  matchesPlayed: number;
  matchesWon: number;
  language: 'en' | 'hi' | 'bn';
  inventory: string[]; // IDs of owned ShopItems
  friends: string[]; // Array of friendCodes
  selectedAvatar: string; // ID of a ShopItem
  selectedBorder: string; // ID of a ShopItem
  selectedEmoji: string; // ID of a ShopItem
  selectedTaunt: string; // ID of a ShopItem
  selectedChat: string; // ID of a ShopItem
  seenQuestionIds: string[];
  lastFreeRewardTime?: number;
  lastLuckyQuestionTime?: number;
  dailyArenaCompleted?: boolean;
  dailyNugget?: { fact: string; date: string };
  dailyStreak: number;
  lastLoginDate: number; // Timestamp
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

// Shop and Customization

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type ItemType = 'Avatar' | 'Border' | 'Taunt' | 'Emoji' | 'Chat';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
}

export interface ShopItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  cost: number;
  currency?: 'coins' | 'gems'; // default to coins
  assetName: string; // e.g., 'avatar_cyber_brain', 'border_neon_fire'
}

// UI and Navigation

export type ScreenState = 
  | 'HOME'
  | 'MODE_SELECT'
  | 'SOLO_LOBBY'
  | 'PVP_LOBBY' // World Tour city selection
  | 'TEAM_LOBBY'
  | 'DAILY_ARENA_LOBBY'
  | 'SENSORY_LOBBY'
  | 'TEAM_FORMATION'
  | 'TEAM_VS'
  | 'PASS_N_PLAY_LOBBY'
  | 'GAME_SOLO_CLIMB'
  | 'GAME_PVP_DUEL'
  | 'GAME_TEAM_BATTLE'
  | 'GAME_PASS_N_PLAY'
  | 'GAME_DAILY_ARENA'
  | 'GAME_SENSORY'
  | 'GAME_RESULT'
  | 'SHOP'
  | 'PROFILE'
  | 'LEADERBOARD'
  | 'SETTINGS'
  | 'REWARDS'
  | 'GAME_DETECTIVE';

// Detective Mode (Brain Out style)

export interface DetectiveObject {
  id: string;
  src: string;
  initialPosition: { x: number; y: number }; // Percentage-based position
  size: { width: number; height: number }; // Percentage-based size
  isDraggable: boolean;
  isInteractable?: boolean; // For taps
  initialRotation?: number;
  initialOpacity?: number;
  zIndex?: number;
}

export type SolutionCondition =
  | { type: 'position'; objectId: string; targetArea: { x: number; y: number; width: number; height: number } }
  | { type: 'tap'; objectId: string; requiredTaps?: number }
  | { type: 'drag-on-top'; draggedId: string; targetId: string };

export interface DetectiveLevel {
  id: number;
  title: string;
  backgroundImage?: string;
  objects: DetectiveObject[];
  solution: SolutionCondition[];
  solutionText: string; // Hint for the player
}

