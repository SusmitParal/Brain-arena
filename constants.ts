import { Question, GameItem, ChestTier } from "./types";

export const DIVERSE_TOPICS = [
  "Disney & Pixar Movies", "Marvel & DC Universe", "Harry Potter Wizarding World", 
  "Anime & Manga", "K-Pop & BTS", "Hollywood Celebrities", "Oscar Awards & Grammys",
  "Classic Cartoons", "Video Game Lore", "Netflix Series", "Famous YouTubers", "Meme Culture",
  "World War I & II", "Ancient Egypt", "Roman Empire", "Indian History",
  "Space Exploration", "Dinosaurs", "Human Anatomy", "Physics",
  "Geography", "Mythology", "Technology", "Supercars"
];

export const ENTRY_FEES = [
  { 
    amount: 200, 
    label: "Delight Delhi", 
    difficulty: "Beginner", 
    questionCount: 25,
    icon: "🇮🇳",
    img: "https://images.unsplash.com/photo-1587477543275-d92d0c24203e?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    amount: 500, 
    label: "Curious Calcutta", 
    difficulty: "Beginner", 
    questionCount: 50,
    icon: "🐯",
    img: "https://images.unsplash.com/photo-1558431382-27e30314225d?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 1000, 
    label: "Aesthetic Athens", 
    difficulty: "Intermediate", 
    questionCount: 75,
    icon: "🏛️",
    img: "https://images.unsplash.com/photo-1603565889613-24634485187b?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 2500, 
    label: "Beijing Blossoms", 
    difficulty: "Intermediate", 
    questionCount: 100,
    icon: "🌸",
    img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 5000, 
    label: "Glorious Greece", 
    difficulty: "Expert", 
    questionCount: 150,
    icon: "⚡",
    img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 10000, 
    label: "London Legends", 
    difficulty: "Expert", 
    questionCount: 200,
    icon: "👑",
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 25000, 
    label: "Tokyo Titans", 
    difficulty: "Master", 
    questionCount: 300,
    icon: "🤖",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 50000, 
    label: "New York Nexus", 
    difficulty: "Master", 
    questionCount: 9999, // Infinite
    icon: "🗽",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop"
  }
];

export const TEAM_BATTLE_TIERS = [
  { amount: 300000, label: "Underground Vault", difficulty: "Expert", rewardGems: 10 },
  { amount: 1000000, label: "Cyber Coliseum", difficulty: "Master", rewardGems: 50 },
  { amount: 5000000, label: "Orbital Station", difficulty: "Master", rewardGems: 150 },
  { amount: 25000000, label: "Galactic Core", difficulty: "Master", rewardGems: 500 },
  { amount: 100000000, label: "The Singularity", difficulty: "Master", rewardGems: 2000 },
];

export const TEAM_BOT_NAMES = [
  "Viper", "Ghost", "Spectre", "Rogue", "Cypher", "Nova", "Blaze", "Frost", 
  "Shadow", "Titan", "Echo", "Raven", "Hawk", "Wolf", "Storm", "Pulse", "Neon", "Flux"
];

// --- GAME ITEMS DATABASE ---
export const GAME_ITEMS: GameItem[] = [
  // --- ANIME & CARTOONS ---
  { id: 'av_dora', type: 'AVATAR', name: 'Robo Cat (Future)', rarity: 'Legendary', content: '🐱🤖', priceCoins: 50000 },
  { id: 'av_nobi', type: 'AVATAR', name: 'Glasses Boy', rarity: 'Epic', content: '👦👓', priceCoins: 35000 },
  { id: 'av_mouse', type: 'AVATAR', name: 'Classic Mouse', rarity: 'Rare', content: '🐭', priceCoins: 5000 },

  // --- CRICKET LEGENDS ---
  { id: 'av_virat', type: 'AVATAR', name: 'King Kohli', rarity: 'Mythic', content: '🏏👑', priceCoins: 100000 },
  { id: 'av_rohit', type: 'AVATAR', name: 'The Hitman', rarity: 'Mythic', content: '🏏🧢', priceCoins: 100000 },
  { id: 'av_dhoni', type: 'AVATAR', name: 'Captain Cool', rarity: 'Legendary', content: '🏏🧤', priceCoins: 80000 },

  // --- SUPERHEROES ---
  { id: 'av_iron', type: 'AVATAR', name: 'Iron Avenger', rarity: 'Mythic', content: '🔴🦾', priceCoins: 150000 },
  { id: 'av_cap', type: 'AVATAR', name: 'Captain Star', rarity: 'Legendary', content: '🛡️⭐', priceCoins: 75000 },
  { id: 'av_spider', type: 'AVATAR', name: 'Web Slinger', rarity: 'Epic', content: '🕷️', priceCoins: 40000 },
  { id: 'av_bat', type: 'AVATAR', name: 'Dark Knight', rarity: 'Legendary', content: '🦇', priceCoins: 90000 },
  
  // --- FANTASY & MAGIC ---
  { id: 'av_potter', type: 'AVATAR', name: 'Wizard Boy', rarity: 'Legendary', content: '⚡👓', priceCoins: 60000 },
  { id: 'av_drag', type: 'AVATAR', name: 'Dragon Rider', rarity: 'Epic', content: '🐉', priceCoins: 25000 },
  
  // --- STANDARD ---
  { id: 'av_1', type: 'AVATAR', name: 'Rookie Bot', rarity: 'Common', content: '🤖', priceCoins: 500 },
  { id: 'av_2', type: 'AVATAR', name: 'Smart Owl', rarity: 'Common', content: '🦉', priceCoins: 1000 },
  { id: 'av_3', type: 'AVATAR', name: 'Ninja', rarity: 'Rare', content: '🥷', priceCoins: 2500 },

  // FRAMES
  { id: 'fr_1', type: 'FRAME', name: 'Wooden Border', rarity: 'Common', content: 'border-amber-700', priceCoins: 500 },
  { id: 'fr_2', type: 'FRAME', name: 'Silver Lining', rarity: 'Rare', content: 'border-slate-400', priceCoins: 2000 },
  { id: 'fr_3', type: 'FRAME', name: 'Golden Glow', rarity: 'Epic', content: 'border-yellow-400 shadow-[0_0_10px_gold]', priceCoins: 5000 },
  { id: 'fr_4', type: 'FRAME', name: 'Neon Cyber', rarity: 'Legendary', content: 'border-cyan-400 shadow-[0_0_15px_cyan]', priceCoins: 10000 },
  { id: 'fr_5', type: 'FRAME', name: 'Void Darkness', rarity: 'Mythic', content: 'border-black shadow-[0_0_20px_purple]', priceCoins: 25000 },
  { id: 'fr_marvel', type: 'FRAME', name: 'Heroic Red', rarity: 'Legendary', content: 'border-red-600 shadow-[0_0_15px_red]', priceCoins: 12000 },
  { id: 'fr_magic', type: 'FRAME', name: 'Mystic Aura', rarity: 'Epic', content: 'border-purple-500 shadow-[0_0_15px_violet]', priceCoins: 8000 },
];

export const CHEST_DATA: Record<ChestTier, { 
    priceGems: number, 
    priceINR: number, 
    color: string, 
    minCoins: number, 
    maxCoins: number,
    minGems: number,
    maxGems: number,
    unlockTimeMs: number, // Time to unlock
    dropRate: { rare: number, epic: number, legendary: number, mythic: number } 
}> = {
  Bronze: { 
    priceGems: 0, priceINR: 0, color: 'from-amber-700 to-amber-900', 
    minCoins: 50, maxCoins: 200, minGems: 0, maxGems: 0,
    unlockTimeMs: 1.5 * 60 * 60 * 1000, // 1.5 Hours
    dropRate: { rare: 0.1, epic: 0, legendary: 0, mythic: 0 } 
  },
  Silver: { 
    priceGems: 0, priceINR: 0, color: 'from-slate-300 to-slate-500', 
    minCoins: 200, maxCoins: 500, minGems: 2, maxGems: 10,
    unlockTimeMs: 5 * 60 * 60 * 1000, // 5 Hours
    dropRate: { rare: 0.5, epic: 0.05, legendary: 0, mythic: 0 } 
  },
  Gold: { 
    priceGems: 0, priceINR: 0, color: 'from-yellow-300 to-yellow-600', 
    minCoins: 500, maxCoins: 1500, minGems: 10, maxGems: 30,
    unlockTimeMs: 12 * 60 * 60 * 1000, // 12 Hours
    dropRate: { rare: 1.0, epic: 0.2, legendary: 0.01, mythic: 0 } 
  },
  Platinum: { 
    priceGems: 50, priceINR: 99, color: 'from-cyan-300 to-cyan-600', 
    minCoins: 2000, maxCoins: 5000, minGems: 50, maxGems: 100,
    unlockTimeMs: 0, // Premium (Instant)
    dropRate: { rare: 1.0, epic: 1.0, legendary: 0.1, mythic: 0.01 } 
  },
  Diamond: { 
    priceGems: 150, priceINR: 249, color: 'from-blue-400 to-purple-600', 
    minCoins: 5000, maxCoins: 10000, minGems: 150, maxGems: 300,
    unlockTimeMs: 0, // Premium (Instant)
    dropRate: { rare: 1.0, epic: 1.0, legendary: 0.5, mythic: 0.05 } 
  },
  Black: { 
    priceGems: 500, priceINR: 999, color: 'from-gray-900 to-black border-2 border-red-500', 
    minCoins: 20000, maxCoins: 50000, minGems: 500, maxGems: 1000,
    unlockTimeMs: 0, // Premium (Instant)
    dropRate: { rare: 1.0, epic: 1.0, legendary: 1.0, mythic: 0.5 } 
  },
};

export const calculateLevel = (totalExp: number) => {
  let level = 1;
  let threshold = 100;
  let increment = 100;

  while (totalExp >= threshold) {
    level++;
    increment += 100;
    threshold += increment;
  }

  const prevThreshold = threshold - increment;
  const expInCurrentLevel = totalExp - prevThreshold;
  const expRequiredForNext = threshold - prevThreshold;
  const progress = (expInCurrentLevel / expRequiredForNext) * 100;

  return { level, progress, expRequired: expRequiredForNext, currentLevelExp: expInCurrentLevel };
};

export const calculateRank = (totalStars: number) => {
  const TIERS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Champion"];
  const STARS_PER_STAGE = 5;
  const STAGES_PER_TIER = 3;
  const STARS_PER_TIER = STARS_PER_STAGE * STAGES_PER_TIER; // 15
  
  const tierIndex = Math.min(Math.floor(totalStars / STARS_PER_TIER), TIERS.length - 1);
  const currentTier = TIERS[tierIndex];
  
  const starsInTier = totalStars % STARS_PER_TIER;
  
  let stage = "III";
  if (starsInTier >= 10) stage = "I";
  else if (starsInTier >= 5) stage = "II";

  const currentStageStars = starsInTier % STARS_PER_STAGE;

  return { 
    tier: currentTier, 
    stage, 
    currentStars: currentStageStars, 
    maxStars: STARS_PER_STAGE,
    color: getTierColor(currentTier) 
  };
};

const getTierColor = (tier: string) => {
  switch(tier) {
    case "Bronze": return "text-orange-500";
    case "Silver": return "text-slate-400";
    case "Gold": return "text-yellow-400";
    case "Platinum": return "text-cyan-400";
    case "Diamond": return "text-blue-500";
    case "Master": return "text-purple-500";
    case "Champion": return "text-red-600";
    default: return "text-white";
  }
};

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    category: "General",
    difficulty: "Beginner",
    question: "Which metal is the best conductor of electricity?",
    options: ["Gold", "Silver", "Copper", "Aluminum"],
    answer: "Silver"
  },
  {
    id: "2",
    category: "Automobile",
    difficulty: "Intermediate",
    question: "Which car manufacturer produces the 'Mustang'?",
    options: ["Chevrolet", "Dodge", "Ford", "Pontiac"],
    answer: "Ford"
  },
  {
    id: "3",
    category: "Space",
    difficulty: "Expert",
    question: "What represents the event horizon of a black hole?",
    options: ["Singularity", "Schwarzschild Radius", "Accretion Disk", "Photon Sphere"],
    answer: "Schwarzschild Radius"
  }
];
