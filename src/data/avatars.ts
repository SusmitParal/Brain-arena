import { ShopItem } from '../types';

export const AVATARS: ShopItem[] = [
  // Common
  { id: 'av_c1', name: 'Novice Ned', type: 'Avatar', rarity: 'Common', cost: 100, assetName: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ned' },
  { id: 'av_c2', name: 'Casual Cat', type: 'Avatar', rarity: 'Common', cost: 100, assetName: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cat' },
  
  // Rare
  { id: 'av_r1', name: 'Smarty Sarah', type: 'Avatar', rarity: 'Rare', cost: 500, assetName: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&top[]=hat' },
  { id: 'av_r2', name: 'Professor P', type: 'Avatar', rarity: 'Rare', cost: 500, assetName: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Professor&clothing=blazerAndShirt' },

  // Epic
  { id: 'av_e1', name: 'Cyber Cid', type: 'Avatar', rarity: 'Epic', cost: 2000, assetName: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cid&eyes=surprised&clothing=hoodie' },
  { id: 'av_e2', name: 'Ninja N', type: 'Avatar', rarity: 'Epic', cost: 2000, assetName: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja&top=turban' },

  // Legendary (Animated)
  { id: 'av_l1', name: 'Galactic Gaze', type: 'Avatar', rarity: 'Legendary', cost: 10000, assetName: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Galactic&eyes=wink&skinColor=pale' },
  { id: 'av_l2', name: 'Mystic Mind', type: 'Avatar', rarity: 'Legendary', cost: 10000, assetName: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mystic&eyes=happy&top=hat' },
];
