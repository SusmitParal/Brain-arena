import { ChestTier, GameItem } from '../types';
import { CHEST_DATA, GAME_ITEMS } from '../constants';

export interface OpenChestResult {
  coins: number;
  gems: number;
  item: GameItem | null;
}

export const openChest = (tier: ChestTier): OpenChestResult => {
  const config = CHEST_DATA[tier];
  
  // 1. Calculate Coins
  const coins = Math.floor(Math.random() * (config.maxCoins - config.minCoins + 1)) + config.minCoins;
  
  // 2. Calculate Gems
  const gems = Math.floor(Math.random() * (config.maxGems - config.minGems + 1)) + config.minGems;
  
  // 3. Determine Item Drop
  let item: GameItem | null = null;
  const roll = Math.random();
  
  let selectedRarity: string | null = null;
  
  // Check rarity buckets descending
  if (roll < config.dropRate.mythic) selectedRarity = 'Mythic';
  else if (roll < config.dropRate.legendary) selectedRarity = 'Legendary';
  else if (roll < config.dropRate.epic) selectedRarity = 'Epic';
  else if (roll < config.dropRate.rare) selectedRarity = 'Rare';
  else if (tier === 'Bronze' && roll < 0.2) selectedRarity = 'Common'; // 20% chance for common in bronze

  if (selectedRarity) {
    const pool = GAME_ITEMS.filter(i => i.rarity === selectedRarity);
    if (pool.length > 0) {
      item = pool[Math.floor(Math.random() * pool.length)];
    }
  }

  return { coins, gems, item };
};
