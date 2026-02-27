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
    chats.push(`  { id: 'chat_gen_${i}', name: 'Chat ${i}', type: 'Chat', rarity: '${rarity}', cost: ${getCost(rarity)}, assetName: '${chatPhrases[i % chatPhrases.length]}' },`);
  }

  // Generate 50 Taunts
  const tauntPhrases = ["Is that all?", "Too easy!", "Try harder!", "You missed!", "Too slow!", "Not even close!", "Better luck next time!", "I'm unstoppable!", "Can't touch this!", "You're going down!", "Prepare to lose!", "I'm the best!", "You're no match!", "Give up now!", "It's over!", "I win!", "You lose!", "Cry about it!", "Skill issue!", "Get rekt!", "Noob!", "Trash!", "Bot!", "Easy peasy!", "Lemon squeezy!", "Piece of cake!", "Child's play!", "A walk in the park!", "I could do this blindfolded!", "With one hand tied behind my back!", "You're making this too easy!", "Are you even trying?", "Wake up!", "Pay attention!", "Look at me!", "I'm over here!", "Missed me!", "Too fast for you!", "Can't catch me!", "I'm a blur!", "Like a ninja!", "Like a boss!", "King of the hill!", "Top of the world!", "Unbeatable!", "Invincible!", "Immortal!", "Godlike!", "Legendary!", "Epic!"];
  for (let i = 1; i <= 50; i++) {
    const rarity = getRarity(i);
    taunts.push(`  { id: 'taunt_gen_${i}', name: 'Taunt ${i}', type: 'Taunt', rarity: '${rarity}', cost: ${getCost(rarity)}, assetName: '${tauntPhrases[i % tauntPhrases.length]}' },`);
  }

  const content = \`import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
\${avatars.join('\\n')}
\${borders.join('\\n')}
\${emojis.join('\\n')}
\${chats.join('\\n')}
\${taunts.join('\\n')}
];
\`;

  fs.writeFileSync('src/data/shopItems.ts', content);
  console.log('Generated shopItems.ts');
};

generateItems();
