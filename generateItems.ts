import fs from 'fs';

const generateItems = () => {
  const avatars = [];
  const borders = [];
  const emojis = [];
  const chats = [];
  const taunts = [];

  const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
  const getRarity = (i) => rarities[i % 4];
  const getCost = (rarity) => {
    if (rarity === 'Common') return 100;
    if (rarity === 'Rare') return 500;
    if (rarity === 'Epic') return 2000;
    return 5000;
  };

  // Generate 50 Avatars
  for (let i = 1; i <= 50; i++) {
    const rarity = getRarity(i);
    avatars.push(`  { id: 'av_gen_${i}', name: 'Avatar ${i}', type: 'Avatar', rarity: '${rarity}', cost: ${getCost(rarity)}, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=GenAvatar${i}' },`);
  }

  // Generate 50 Borders
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'teal', 'orange', 'cyan'];
  for (let i = 1; i <= 50; i++) {
    const rarity = getRarity(i);
    const color = colors[i % colors.length];
    const shade = (Math.floor(i / colors.length) % 5 + 3) * 100; // 300 to 700
    borders.push(`  { id: 'border_gen_${i}', name: 'Border ${i}', type: 'Border', rarity: '${rarity}', cost: ${getCost(rarity)}, assetName: 'border-${color}-${shade} shadow-[0_0_10px_rgba(0,0,0,0.5)]' },`);
  }

  // Generate 50 Emojis
  const emojiList = ['😀','😃','😄','😁','😆','😅','😂','🤣','🥲','🥹','☺️','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🫣','🤗','🫡','🤔','🫢','🤭','🤫','🤥','😶','😶‍🌫️','😐','😑','😬','🫨','🫠','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😮‍💨','😵','😵‍💫','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾'];
  for (let i = 1; i <= 50; i++) {
    const rarity = getRarity(i);
    emojis.push(`  { id: 'emoji_gen_${i}', name: 'Emoji ${i}', type: 'Emoji', rarity: '${rarity}', cost: ${getCost(rarity)}, assetName: '${emojiList[i % emojiList.length]}' },`);
  }

  // Generate 50 Chats
  const chatPhrases = ["Hello!", "Good luck!", "Well played!", "Oops!", "Thanks!", "Sorry!", "Wow!", "Nice!", "GG", "BRB", "Let's go!", "Watch out!", "I'm ready!", "Good game!", "Awesome!", "My bad!", "No way!", "Yes!", "No!", "Maybe?", "Haha!", "Cool!", "Sweet!", "Ouch!", "Yikes!", "Boom!", "Gotcha!", "Nice try!", "Almost!", "Too close!", "Phew!", "Oh yeah!", "Oh no!", "Help!", "Incoming!", "Defend!", "Attack!", "Charge!", "Retreat!", "Hold on!", "Wait!", "Go go go!", "Hurry!", "Take your time", "Focus!", "Stay sharp!", "You got this!", "I got this!", "We got this!", "Victory!"];
  for (let i = 1; i <= 50; i++) {
    const rarity = getRarity(i);
    const phrase = chatPhrases[i % chatPhrases.length].replace(/'/g, "\\'");
    chats.push(`  { id: 'chat_gen_${i}', name: 'Chat ${i}', type: 'Chat', rarity: '${rarity}', cost: ${getCost(rarity)}, assetName: '${phrase}' },`);
  }

  // Generate 50 Taunts
  const tauntPhrases = ["Is that all?", "Too easy!", "Try harder!", "You missed!", "Too slow!", "Not even close!", "Better luck next time!", "I'm unstoppable!", "Can't touch this!", "You're going down!", "Prepare to lose!", "I'm the best!", "You're no match!", "Give up now!", "It's over!", "I win!", "You lose!", "Cry about it!", "Skill issue!", "Get rekt!", "Noob!", "Trash!", "Bot!", "Easy peasy!", "Lemon squeezy!", "Piece of cake!", "Child's play!", "A walk in the park!", "I could do this blindfolded!", "With one hand tied behind my back!", "You're making this too easy!", "Are you even trying?", "Wake up!", "Pay attention!", "Look at me!", "I'm over here!", "Missed me!", "Too fast for you!", "Can't catch me!", "I'm a blur!", "Like a ninja!", "Like a boss!", "King of the hill!", "Top of the world!", "Unbeatable!", "Invincible!", "Immortal!", "Godlike!", "Legendary!", "Epic!"];
  for (let i = 1; i <= 50; i++) {
    const rarity = getRarity(i);
    const phrase = tauntPhrases[i % tauntPhrases.length].replace(/'/g, "\\'");
    taunts.push(`  { id: 'taunt_gen_${i}', name: 'Taunt ${i}', type: 'Taunt', rarity: '${rarity}', cost: ${getCost(rarity)}, assetName: '${phrase}' },`);
  }

  const originalItems = `
  // Avatars (Realistic/Cool)
  { id: 'av_c1', name: 'Novice Ned', type: 'Avatar', rarity: 'Common', cost: 100, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Ned' },
  { id: 'av_c2', name: 'Casual Cat', type: 'Avatar', rarity: 'Common', cost: 100, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Cat' },
  { id: 'av_c3', name: 'Brave Ben', type: 'Avatar', rarity: 'Common', cost: 150, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Ben' },
  { id: 'av_r1', name: 'Smarty Sarah', type: 'Avatar', rarity: 'Rare', cost: 500, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Sarah' },
  { id: 'av_r2', name: 'Professor P', type: 'Avatar', rarity: 'Rare', cost: 500, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=ProfessorP&glasses=round&glassesColor=transparent&shirt=open&shirtColor=92b558&hair=fonze&hairColor=000000&baseColor=f9c9b6' },
  { id: 'av_r3', name: 'Detective D', type: 'Avatar', rarity: 'Rare', cost: 600, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Detective' },
  { id: 'av_e1', name: 'Cyber Cid', type: 'Avatar', rarity: 'Epic', cost: 2000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Cid' },
  { id: 'av_e2', name: 'Neon Niki', type: 'Avatar', rarity: 'Epic', cost: 2500, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Niki' },
  { id: 'av_l1', name: 'Galactic Gaze', type: 'Avatar', rarity: 'Legendary', cost: 10000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Galactic' },
  { id: 'av_l2', name: 'Mystic Maya', type: 'Avatar', rarity: 'Legendary', cost: 12000, assetName: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' },
  { id: 'av_real1', name: 'Pro Player 1', type: 'Avatar', rarity: 'Epic', cost: 3000, assetName: 'https://i.pravatar.cc/150?u=pro1' },
  { id: 'av_real2', name: 'Pro Player 2', type: 'Avatar', rarity: 'Legendary', cost: 8000, assetName: 'https://i.pravatar.cc/150?u=pro2' },
  { id: 'av_real3', name: 'Shadow Knight', type: 'Avatar', rarity: 'Epic', cost: 4500, assetName: 'https://i.pravatar.cc/150?u=knight' },
  { id: 'av_real4', name: 'Cyber Queen', type: 'Avatar', rarity: 'Legendary', cost: 15000, assetName: 'https://i.pravatar.cc/150?u=queen' },
  { id: 'av_real5', name: 'Elite Gamer', type: 'Avatar', rarity: 'Legendary', cost: 20000, assetName: 'https://i.pravatar.cc/150?u=elite' },

  // Borders
  { id: 'border_basic', name: 'Basic Frame', type: 'Border', rarity: 'Common', cost: 0, assetName: 'border-white' },
  { id: 'border_gold', name: 'Golden Frame', type: 'Border', rarity: 'Rare', cost: 1000, assetName: 'border-yellow-400' },
  { id: 'border_neon', name: 'Neon Glow', type: 'Border', rarity: 'Epic', cost: 2500, assetName: 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' },
  { id: 'border_fire', name: 'Fire Spirit', type: 'Border', rarity: 'Legendary', cost: 5000, assetName: 'border-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.9)]' },
  { id: 'border_royal', name: 'Royal Purple', type: 'Border', rarity: 'Epic', cost: 3000, assetName: 'border-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.8)]' },
  { id: 'border_diamond', name: 'Diamond Edge', type: 'Border', rarity: 'Legendary', cost: 8000, assetName: 'border-blue-200 shadow-[0_0_20px_rgba(191,219,254,0.9)]' },
  { id: 'border_emerald', name: 'Emerald Shine', type: 'Border', rarity: 'Epic', cost: 4000, assetName: 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' },
  { id: 'border_rainbow', name: 'Rainbow Wave', type: 'Border', rarity: 'Legendary', cost: 12000, assetName: 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]' },

  // Emojis
  { id: 'emoji_smile', name: 'Happy Smile', type: 'Emoji', rarity: 'Common', cost: 50, assetName: '😊' },
  { id: 'emoji_laugh', name: 'LOL', type: 'Emoji', rarity: 'Common', cost: 50, assetName: '😂' },
  { id: 'emoji_wink', name: 'Wink', type: 'Emoji', rarity: 'Common', cost: 50, assetName: '😉' },
  { id: 'emoji_cool', name: 'Cool', type: 'Emoji', rarity: 'Rare', cost: 200, assetName: '😎' },
  { id: 'emoji_fire', name: 'Fire', type: 'Emoji', rarity: 'Rare', cost: 200, assetName: '🔥' },
  { id: 'emoji_crown', name: 'King', type: 'Emoji', rarity: 'Legendary', cost: 1000, assetName: '👑' },
  { id: 'emoji_ghost', name: 'Ghost', type: 'Emoji', rarity: 'Rare', cost: 300, assetName: '👻' },
  { id: 'emoji_alien', name: 'Alien', type: 'Emoji', rarity: 'Epic', cost: 500, assetName: '👽' },
  { id: 'emoji_rocket', name: 'Rocket', type: 'Emoji', rarity: 'Epic', cost: 600, assetName: '🚀' },
  { id: 'emoji_brain', name: 'Big Brain', type: 'Emoji', rarity: 'Legendary', cost: 2000, assetName: '🧠' },
  { id: 'emoji_muscle', name: 'Flex', type: 'Emoji', rarity: 'Rare', cost: 400, assetName: '💪' },
  { id: 'emoji_money', name: 'Rich', type: 'Emoji', rarity: 'Epic', cost: 1200, assetName: '🤑' },
  { id: 'emoji_star', name: 'Star', type: 'Emoji', rarity: 'Rare', cost: 300, assetName: '⭐' },

  // Chats (formerly Taunts)
  { id: 'chat_sorry', name: 'Sorry!', type: 'Chat', rarity: 'Common', cost: 100, assetName: 'Sorry!' },
  { id: 'chat_thanks', name: 'Thank You', type: 'Chat', rarity: 'Common', cost: 100, assetName: 'Thank You' },
  { id: 'chat_gg', name: 'Good Game', type: 'Chat', rarity: 'Common', cost: 100, assetName: 'Good Game' },
  { id: 'chat_oops', name: 'Oops...', type: 'Chat', rarity: 'Common', cost: 100, assetName: 'Oops...' },
  { id: 'chat_rekt', name: 'Get Rekt', type: 'Chat', rarity: 'Epic', cost: 1500, assetName: 'Get Rekt!' },
  { id: 'chat_ez', name: 'Too Easy', type: 'Chat', rarity: 'Epic', cost: 1500, assetName: 'Too Easy!' },
  { id: 'chat_brain', name: 'Brain Diff', type: 'Chat', rarity: 'Legendary', cost: 3000, assetName: 'Brain Diff!' },
  { id: 'chat_wait', name: 'Wait for it...', type: 'Chat', rarity: 'Rare', cost: 500, assetName: 'Wait for it...' },
  { id: 'chat_shock', name: 'Unbelievable!', type: 'Chat', rarity: 'Rare', cost: 800, assetName: 'Unbelievable!' },

  // Taunts (Stickers with text)
  { id: 'taunt_dad', name: 'I am your dad', type: 'Taunt', rarity: 'Legendary', cost: 5000, assetName: 'If you are bad, then I am your dad! 😎' },
  { id: 'taunt_cry', name: 'Cry about it', type: 'Taunt', rarity: 'Epic', cost: 2000, assetName: 'Cry about it 😭' },
  { id: 'taunt_boss', name: 'Boss Mode', type: 'Taunt', rarity: 'Legendary', cost: 4000, assetName: 'I am the BOSS here 👑' },
  { id: 'taunt_sleep', name: 'Boring', type: 'Taunt', rarity: 'Rare', cost: 1000, assetName: 'Wake me up when you score 😴' },
  { id: 'taunt_noob', name: 'Noob Alert', type: 'Taunt', rarity: 'Epic', cost: 2500, assetName: 'NOOB ALERT! 🚨' },
  { id: 'taunt_fire', name: 'On Fire', type: 'Taunt', rarity: 'Legendary', cost: 6000, assetName: 'I AM ON FIRE! 🔥🔥🔥' },
`;

  const content = `import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
${originalItems}
${avatars.join('\n')}
${borders.join('\n')}
${emojis.join('\n')}
${chats.join('\n')}
${taunts.join('\n')}
];
`;

  fs.writeFileSync('src/data/shopItems.ts', content);
  console.log('Generated shopItems.ts');
};

generateItems();
