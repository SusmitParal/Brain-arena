import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  // Base Items (Cost 0, given to new players, not shown in shop)
  { id: 'emoji_base_smile', name: 'Smile', type: 'Emoji', rarity: 'Common', cost: 0, assetName: '🙂' },
  { id: 'emoji_base_sad', name: 'Sad', type: 'Emoji', rarity: 'Common', cost: 0, assetName: '😢' },
  { id: 'emoji_base_angry', name: 'Angry', type: 'Emoji', rarity: 'Common', cost: 0, assetName: '😠' },
  { id: 'chat_base_hi', name: 'Hi', type: 'Chat', rarity: 'Common', cost: 0, assetName: 'Hi!' },
  { id: 'chat_base_wow', name: 'Wow', type: 'Chat', rarity: 'Common', cost: 0, assetName: 'Wow!' },
  { id: 'chat_base_gl', name: 'Good Luck', type: 'Chat', rarity: 'Common', cost: 0, assetName: 'Good Luck!' },
  { id: 'taunt_base_1', name: 'Bring it on', type: 'Taunt', rarity: 'Common', cost: 0, assetName: 'Bring it on!' },

  // Avatars
  { id: 'av_c1', name: 'Novice Ned', type: 'Avatar', rarity: 'Common', cost: 1000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Ned' },
  { id: 'av_c2', name: 'Casual Cat', type: 'Avatar', rarity: 'Common', cost: 2500, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Cat' },
  { id: 'av_c3', name: 'Brave Ben', type: 'Avatar', rarity: 'Common', cost: 5000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Ben' },
  { id: 'av_r1', name: 'Smarty Sarah', type: 'Avatar', rarity: 'Rare', cost: 15000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Sarah' },
  { id: 'av_r2', name: 'Professor P', type: 'Avatar', rarity: 'Rare', cost: 25000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=ProfessorP&glasses=round' },
  { id: 'av_r3', name: 'Detective D', type: 'Avatar', rarity: 'Rare', cost: 50000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Detective' },
  { id: 'av_e1', name: 'Cyber Cid', type: 'Avatar', rarity: 'Epic', cost: 100000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Cid' },
  { id: 'av_e2', name: 'Neon Niki', type: 'Avatar', rarity: 'Epic', cost: 250000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Niki' },
  { id: 'av_real1', name: 'Pro Player 1', type: 'Avatar', rarity: 'Epic', cost: 400000, assetName: 'https://i.pravatar.cc/150?u=pro1' },
  { id: 'av_real3', name: 'Shadow Knight', type: 'Avatar', rarity: 'Epic', cost: 500000, assetName: 'https://i.pravatar.cc/150?u=knight' },
  { id: 'av_l1', name: 'Galactic Gaze', type: 'Avatar', rarity: 'Legendary', cost: 750000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Galactic' },
  { id: 'av_l2', name: 'Mystic Maya', type: 'Avatar', rarity: 'Legendary', cost: 850000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' },
  { id: 'av_real2', name: 'Pro Player 2', type: 'Avatar', rarity: 'Legendary', cost: 900000, assetName: 'https://i.pravatar.cc/150?u=pro2' },
  { id: 'av_real4', name: 'Cyber Queen', type: 'Avatar', rarity: 'Legendary', cost: 950000, assetName: 'https://i.pravatar.cc/150?u=queen' },
  { id: 'av_real5', name: 'Elite Gamer', type: 'Avatar', rarity: 'Legendary', cost: 1000000, assetName: 'https://i.pravatar.cc/150?u=elite' },

  // Borders
  { id: 'border_basic', name: 'Basic Frame', type: 'Border', rarity: 'Common', cost: 1000, assetName: 'border-white' },
  { id: 'border_silver', name: 'Silver Frame', type: 'Border', rarity: 'Common', cost: 5000, assetName: 'border-gray-400' },
  { id: 'border_gold', name: 'Golden Frame', type: 'Border', rarity: 'Rare', cost: 25000, assetName: 'border-yellow-400' },
  { id: 'border_emerald', name: 'Emerald Shine', type: 'Border', rarity: 'Rare', cost: 50000, assetName: 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' },
  { id: 'border_neon', name: 'Neon Glow', type: 'Border', rarity: 'Epic', cost: 150000, assetName: 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' },
  { id: 'border_royal', name: 'Royal Purple', type: 'Border', rarity: 'Epic', cost: 300000, assetName: 'border-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.8)]' },
  { id: 'border_fire', name: 'Fire Spirit', type: 'Border', rarity: 'Legendary', cost: 750000, assetName: 'border-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.9)]' },
  { id: 'border_diamond', name: 'Diamond Edge', type: 'Border', rarity: 'Legendary', cost: 900000, assetName: 'border-blue-200 shadow-[0_0_20px_rgba(191,219,254,0.9)]' },
  { id: 'border_rainbow', name: 'Rainbow Wave', type: 'Border', rarity: 'Legendary', cost: 1000000, assetName: 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]' },

  // Emojis
  { id: 'emoji_smile', name: 'Happy Smile', type: 'Emoji', rarity: 'Common', cost: 1000, assetName: '😊' },
  { id: 'emoji_laugh', name: 'LOL', type: 'Emoji', rarity: 'Common', cost: 2500, assetName: '😂' },
  { id: 'emoji_wink', name: 'Wink', type: 'Emoji', rarity: 'Common', cost: 5000, assetName: '😉' },
  { id: 'emoji_cool', name: 'Cool', type: 'Emoji', rarity: 'Rare', cost: 20000, assetName: '😎' },
  { id: 'emoji_star', name: 'Star', type: 'Emoji', rarity: 'Rare', cost: 35000, assetName: '⭐' },
  { id: 'emoji_ghost', name: 'Ghost', type: 'Emoji', rarity: 'Rare', cost: 50000, assetName: '👻' },
  { id: 'emoji_muscle', name: 'Flex', type: 'Emoji', rarity: 'Rare', cost: 75000, assetName: '💪' },
  { id: 'emoji_fire', name: 'Fire', type: 'Emoji', rarity: 'Epic', cost: 150000, assetName: '🔥' },
  { id: 'emoji_alien', name: 'Alien', type: 'Emoji', rarity: 'Epic', cost: 250000, assetName: '👽' },
  { id: 'emoji_rocket', name: 'Rocket', type: 'Emoji', rarity: 'Epic', cost: 400000, assetName: '🚀' },
  { id: 'emoji_money', name: 'Rich', type: 'Emoji', rarity: 'Epic', cost: 600000, assetName: '🤑' },
  { id: 'emoji_crown', name: 'King', type: 'Emoji', rarity: 'Legendary', cost: 850000, assetName: '👑' },
  { id: 'emoji_brain', name: 'Big Brain', type: 'Emoji', rarity: 'Legendary', cost: 1000000, assetName: '🧠' },

  // Chats
  { id: 'chat_sorry', name: 'Sorry!', type: 'Chat', rarity: 'Common', cost: 1000, assetName: 'Sorry!' },
  { id: 'chat_thanks', name: 'Thank You', type: 'Chat', rarity: 'Common', cost: 2500, assetName: 'Thank You' },
  { id: 'chat_gg', name: 'Good Game', type: 'Chat', rarity: 'Common', cost: 5000, assetName: 'Good Game' },
  { id: 'chat_oops', name: 'Oops...', type: 'Chat', rarity: 'Common', cost: 10000, assetName: 'Oops...' },
  { id: 'chat_wait', name: 'Wait for it...', type: 'Chat', rarity: 'Rare', cost: 50000, assetName: 'Wait for it...' },
  { id: 'chat_shock', name: 'Unbelievable!', type: 'Chat', rarity: 'Rare', cost: 75000, assetName: 'Unbelievable!' },
  { id: 'chat_rekt', name: 'Get Rekt', type: 'Chat', rarity: 'Epic', cost: 250000, assetName: 'Get Rekt!' },
  { id: 'chat_ez', name: 'Too Easy', type: 'Chat', rarity: 'Epic', cost: 500000, assetName: 'Too Easy!' },
  { id: 'chat_brain', name: 'Brain Diff', type: 'Chat', rarity: 'Legendary', cost: 1000000, assetName: 'Brain Diff!' },

  // Taunts
  { id: 'taunt_sleep', name: 'Boring', type: 'Taunt', rarity: 'Rare', cost: 50000, assetName: 'Wake me up when you score 😴' },
  { id: 'taunt_cry', name: 'Cry about it', type: 'Taunt', rarity: 'Epic', cost: 250000, assetName: 'Cry about it 😭' },
  { id: 'taunt_noob', name: 'Noob Alert', type: 'Taunt', rarity: 'Epic', cost: 500000, assetName: 'NOOB ALERT! 🚨' },
  { id: 'taunt_boss', name: 'Boss Mode', type: 'Taunt', rarity: 'Legendary', cost: 750000, assetName: 'I am the BOSS here 👑' },
  { id: 'taunt_dad', name: 'I am your dad', type: 'Taunt', rarity: 'Legendary', cost: 900000, assetName: 'If you are bad, then I am your dad! 😎' },
  { id: 'taunt_fire', name: 'On Fire', type: 'Taunt', rarity: 'Legendary', cost: 1000000, assetName: 'I AM ON FIRE! 🔥🔥🔥' },

  // Generated Avatars
  ...Array.from({ length: 47 }).map((_, i) => ({
    id: `av_gen_${i + 1}`,
    name: `Avatar ${i + 1}`,
    type: 'Avatar' as const,
    rarity: (i % 4 === 0 ? 'Legendary' : i % 3 === 0 ? 'Epic' : i % 2 === 0 ? 'Rare' : 'Common') as any,
    cost: i % 4 === 0 ? 500000 : i % 3 === 0 ? 100000 : i % 2 === 0 ? 25000 : 5000,
    assetName: `https://api.dicebear.com/9.x/micah/svg?seed=GenAvatar${i + 1}`
  })),

  // Generated Borders
  ...Array.from({ length: 47 }).map((_, i) => ({
    id: `border_gen_${i + 1}`,
    name: `Border ${i + 1}`,
    type: 'Border' as const,
    rarity: (i % 4 === 0 ? 'Legendary' : i % 3 === 0 ? 'Epic' : i % 2 === 0 ? 'Rare' : 'Common') as any,
    cost: i % 4 === 0 ? 500000 : i % 3 === 0 ? 100000 : i % 2 === 0 ? 25000 : 5000,
    assetName: `border-[color] shadow-[0_0_10px_rgba(0,0,0,0.5)]`.replace('[color]', ['red-500', 'blue-500', 'green-500', 'yellow-500', 'purple-500', 'pink-500', 'cyan-500'][i % 7])
  })),

  // Generated Emojis
  ...Array.from({ length: 47 }).map((_, i) => ({
    id: `emoji_gen_${i + 1}`,
    name: `Emoji ${i + 1}`,
    type: 'Emoji' as const,
    rarity: (i % 4 === 0 ? 'Legendary' : i % 3 === 0 ? 'Epic' : i % 2 === 0 ? 'Rare' : 'Common') as any,
    cost: i % 4 === 0 ? 500000 : i % 3 === 0 ? 100000 : i % 2 === 0 ? 25000 : 5000,
    assetName: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲'][i] || '😀'
  })),

  // Generated Chats
  ...Array.from({ length: 47 }).map((_, i) => ({
    id: `chat_gen_${i + 1}`,
    name: `Chat ${i + 1}`,
    type: 'Chat' as const,
    rarity: (i % 4 === 0 ? 'Legendary' : i % 3 === 0 ? 'Epic' : i % 2 === 0 ? 'Rare' : 'Common') as any,
    cost: i % 4 === 0 ? 500000 : i % 3 === 0 ? 100000 : i % 2 === 0 ? 25000 : 5000,
    assetName: ['Hello!', 'Goodbye!', 'Yes!', 'No!', 'Maybe?', 'I don\'t know', 'Wow!', 'Awesome!', 'Cool!', 'Nice!', 'Good job!', 'Well done!', 'Congratulations!', 'Happy Birthday!', 'Merry Christmas!', 'Happy New Year!', 'Happy Halloween!', 'Happy Thanksgiving!', 'Happy Easter!', 'Happy Valentine\'s Day!', 'Happy St. Patrick\'s Day!', 'Happy 4th of July!', 'Happy Mother\'s Day!', 'Happy Father\'s Day!', 'Happy Grandparent\'s Day!', 'Happy Boss\'s Day!', 'Happy Secretary\'s Day!', 'Happy Administrative Professionals\' Day!', 'Happy Nurse\'s Day!', 'Happy Teacher\'s Day!', 'Happy Principal\'s Day!', 'Happy Boss\'s Day!', 'Happy Secretary\'s Day!', 'Happy Administrative Professionals\' Day!', 'Happy Nurse\'s Day!', 'Happy Teacher\'s Day!', 'Happy Principal\'s Day!', 'Happy Boss\'s Day!', 'Happy Secretary\'s Day!', 'Happy Administrative Professionals\' Day!', 'Happy Nurse\'s Day!', 'Happy Teacher\'s Day!', 'Happy Principal\'s Day!', 'Happy Boss\'s Day!', 'Happy Secretary\'s Day!', 'Happy Administrative Professionals\' Day!', 'Happy Nurse\'s Day!'][i] || 'Chat!'
  })),

  // Generated Taunts
  ...Array.from({ length: 47 }).map((_, i) => ({
    id: `taunt_gen_${i + 1}`,
    name: `Taunt ${i + 1}`,
    type: 'Taunt' as const,
    rarity: (i % 4 === 0 ? 'Legendary' : i % 3 === 0 ? 'Epic' : i % 2 === 0 ? 'Rare' : 'Common') as any,
    cost: i % 4 === 0 ? 500000 : i % 3 === 0 ? 100000 : i % 2 === 0 ? 25000 : 5000,
    assetName: ['You missed!', 'Too slow!', 'Is that all?', 'Try harder!', 'I\'m invincible!', 'You can\'t beat me!', 'I\'m the best!', 'I\'m number one!', 'I\'m the champion!', 'I\'m the king!', 'I\'m the queen!', 'I\'m the boss!', 'I\'m the master!', 'I\'m the expert!', 'I\'m the pro!', 'I\'m the legend!', 'I\'m the myth!', 'I\'m the god!', 'I\'m the goddess!', 'I\'m the hero!', 'I\'m the heroine!', 'I\'m the savior!', 'I\'m the chosen one!', 'I\'m the one and only!', 'I\'m the best of the best!', 'I\'m the greatest of all time!', 'I\'m the GOAT!', 'I\'m the MVP!', 'I\'m the VIP!', 'I\'m the star!', 'I\'m the superstar!', 'I\'m the megastar!', 'I\'m the gigastar!', 'I\'m the terastar!', 'I\'m the petastar!', 'I\'m the exastar!', 'I\'m the zettastar!', 'I\'m the yottastar!', 'I\'m the ronnastar!', 'I\'m the quettastar!', 'I\'m the best!', 'I\'m number one!', 'I\'m the champion!', 'I\'m the king!', 'I\'m the queen!', 'I\'m the boss!', 'I\'m the master!'][i] || 'Taunt!'
  })),
];
