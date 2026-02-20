import { Question, GameItem, ChestTier } from "./types";

export const DIVERSE_TOPICS = [
  "Disney & Pixar Movies", "Marvel & DC Universe", "Harry Potter Wizarding World", 
  "Anime & Manga", "K-Pop & BTS", "Hollywood Celebrities", "Oscar Awards & Grammys",
  "Classic Cartoons", "Video Game Lore", "Netflix Series", "Famous YouTubers", "Meme Culture",
  "World War I & II", "Ancient Egypt", "Roman Empire", "Indian History",
  "Space Exploration", "Dinosaurs", "Human Anatomy", "Physics",
  "Geography", "Mythology", "Technology", "Supercars",
  "Literature", "Art History", "World Capitals", "Famous Inventions", "Computer Science Fundamentals"
];

export const ENTRY_FEES = [
  { 
    amount: 200, 
    label: "Delight Delhi", 
    difficulty: "Beginner", 
    questionCount: 25,
    icon: "🇮🇳",
    img: "https://images.unsplash.com/photo-1564507592333-c60657eaa0ae?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    amount: 500, 
    label: "Curious Calcutta", 
    difficulty: "Beginner", 
    questionCount: 50,
    icon: "🐯",
    img: "https://images.unsplash.com/photo-1590050752117-23a9d7fc6f8a?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 1000, 
    label: "Aesthetic Athens", 
    difficulty: "Intermediate", 
    questionCount: 75,
    icon: "🏛️",
    img: "https://images.unsplash.com/photo-1503152394-c571994fd383?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 2500, 
    label: "Beijing Blossoms", 
    difficulty: "Intermediate", 
    questionCount: 100,
    icon: "🌸",
    img: "https://images.unsplash.com/photo-1540609651531-dc5567338f80?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 5000, 
    label: "Glorious Greece", 
    difficulty: "Expert", 
    questionCount: 150,
    icon: "⚡",
    img: "https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 10000, 
    label: "London Legends", 
    difficulty: "Expert", 
    questionCount: 200,
    icon: "👑",
    img: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 25000, 
    label: "Tokyo Titans", 
    difficulty: "Master", 
    questionCount: 300,
    icon: "🤖",
    img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop"
  },
  { 
    amount: 50000, 
    label: "New York Nexus", 
    difficulty: "Master", 
    questionCount: 9999, // Infinite
    icon: "🗽",
    img: "https://images.unsplash.com/photo-1485871982721-9c4513575271?q=80&w=800&auto=format&fit=crop"
  }
];

export const TEAM_BATTLE_TIERS = [
  { amount: 300000, label: "Mumbai Mayhem", difficulty: "Expert", rewardGems: 10, img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=800&auto=format&fit=crop" },
  { amount: 1000000, label: "Dubai Duel", difficulty: "Master", rewardGems: 50, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop" },
  { amount: 5000000, label: "Paris Panic", difficulty: "Master", rewardGems: 150, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop" },
  { amount: 25000000, label: "Singapore Showdown", difficulty: "Master", rewardGems: 500, img: "https://images.unsplash.com/photo-1525625232717-121ed31e22e7?q=80&w=800&auto=format&fit=crop" },
  { amount: 50000000, label: "Vatican Victory", difficulty: "Master", rewardGems: 2000, img: "https://images.unsplash.com/photo-1546955121-d10433000165?q=80&w=800&auto=format&fit=crop" },
];

export const TEAM_BOT_NAMES = [
  "Viper", "Ghost", "Spectre", "Rogue", "Cypher", "Nova", "Blaze", "Frost", 
  "Shadow", "Titan", "Echo", "Raven", "Hawk", "Wolf", "Storm", "Pulse", "Neon", "Flux"
];

// --- GAME ITEMS DATABASE ---
export const GAME_ITEMS: GameItem[] = [
  // --- ANIME & CARTOONS ---
  { id: 'av_dora', type: 'AVATAR', name: 'Robo Cat (Future)', rarity: 'Legendary', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=dora', priceCoins: 50000 },
  { id: 'av_nobi', type: 'AVATAR', name: 'Glasses Boy', rarity: 'Epic', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=nobi', priceCoins: 35000 },
  { id: 'av_mouse', type: 'AVATAR', name: 'Classic Mouse', rarity: 'Rare', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=mickey', priceCoins: 5000 },

  // --- CRICKET LEGENDS ---
  { id: 'av_virat', type: 'AVATAR', name: 'King Kohli', rarity: 'Mythic', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=virat', priceCoins: 100000 },
  { id: 'av_rohit', type: 'AVATAR', name: 'The Hitman', rarity: 'Mythic', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=rohit', priceCoins: 100000 },
  { id: 'av_dhoni', type: 'AVATAR', name: 'Captain Cool', rarity: 'Legendary', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=dhoni', priceCoins: 80000 },

  // --- SUPERHEROES ---
  { id: 'av_iron', type: 'AVATAR', name: 'Iron Avenger', rarity: 'Mythic', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=tony', priceCoins: 150000 },
  { id: 'av_cap', type: 'AVATAR', name: 'Captain Star', rarity: 'Legendary', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=steve', priceCoins: 75000 },
  { id: 'av_spider', type: 'AVATAR', name: 'Web Slinger', rarity: 'Epic', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=peter', priceCoins: 40000 },
  { id: 'av_bat', type: 'AVATAR', name: 'Dark Knight', rarity: 'Legendary', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=bruce', priceCoins: 90000 },
  
  // --- FANTASY & MAGIC ---
  { id: 'av_potter', type: 'AVATAR', name: 'Wizard Boy', rarity: 'Legendary', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=harry', priceCoins: 60000 },
  { id: 'av_drag', type: 'AVATAR', name: 'Dragon Rider', rarity: 'Epic', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=dragon', priceCoins: 25000 },
  
  // --- STANDARD ---
  { id: 'av_1', type: 'AVATAR', name: 'Rookie Bot', rarity: 'Common', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=rookie', priceCoins: 500 },
  { id: 'av_2', type: 'AVATAR', name: 'Smart Owl', rarity: 'Common', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=owl', priceCoins: 1000 },
  { id: 'av_3', type: 'AVATAR', name: 'Ninja', rarity: 'Rare', content: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ninja', priceCoins: 2500 },

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
  },
  {
    id: "4",
    category: "Mythology",
    difficulty: "Beginner",
    question: "Who is the Greek god of the sea?",
    options: ["Zeus", "Hades", "Poseidon", "Apollo"],
    answer: "Poseidon"
  },
  {
    id: "5",
    category: "Literature",
    difficulty: "Intermediate",
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    answer: "William Shakespeare"
  },
  {
    id: "6",
    category: "Art History",
    difficulty: "Expert",
    question: "Who painted the 'Mona Lisa'?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
    answer: "Leonardo da Vinci"
  }
];
