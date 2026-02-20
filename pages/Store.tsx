import React, { useState } from 'react';
import { UserProfile, ChestTier, GameItem } from '../types';
import { CHEST_DATA, GAME_ITEMS } from '../constants';
import Button from '../components/Button';
import { openChest } from '../services/rewardService';
import { Package, Gem, Coins, ArrowRightLeft, Gift, Lock, ShoppingBag, Check } from 'lucide-react';
import { audioManager } from '../services/audioService';

interface StoreProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  onNavigate: (s: any) => void;
}

const Store: React.FC<StoreProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'PREMIUM' | 'EXCHANGE'>('ITEMS');
  const [rewardModal, setRewardModal] = useState<{coins: number, gems: number, item: GameItem | null} | null>(null);

  const handleBuyItem = (item: GameItem) => {
      if (!item.priceCoins) return;
      
      if (user.inventory.includes(item.id)) {
          return; // Already owned
      }

      if (user.coins >= item.priceCoins) {
          audioManager.playSFX('win');
          onUpdateUser({
              ...user,
              coins: user.coins - item.priceCoins,
              inventory: [...user.inventory, item.id]
          });
      } else {
          audioManager.playSFX('wrong');
          alert("Insufficient Coins!");
      }
  };

  const handleBuyChest = (tier: ChestTier, currency: 'GEMS' | 'INR') => {
    const config = CHEST_DATA[tier];
    
    if (currency === 'GEMS') {
        if (user.gems >= config.priceGems) {
             const result = openChest(tier);
             audioManager.playSFX('win');
             
             // Deduct Gems, Add Rewards
             const newInventory = [...user.inventory];
             if (result.item && !newInventory.includes(result.item.id)) {
                newInventory.push(result.item.id);
             }

             onUpdateUser({
                 ...user,
                 gems: user.gems - config.priceGems + result.gems,
                 coins: user.coins + result.coins,
                 inventory: newInventory
             });
             setRewardModal(result);
        } else {
            audioManager.playSFX('wrong');
            alert("Not enough Gems!");
        }
    } else {
        // Simulate INR Purchase
        if(confirm(`Purchase ${tier} Chest for ₹${config.priceINR}?`)) {
             const result = openChest(tier);
             audioManager.playSFX('win');
             
             const newInventory = [...user.inventory];
             if (result.item && !newInventory.includes(result.item.id)) {
                newInventory.push(result.item.id);
             }

             onUpdateUser({
                 ...user,
                 coins: user.coins + result.coins,
                 gems: user.gems + result.gems, // Add found gems
                 inventory: newInventory
             });
             setRewardModal(result);
        }
    }
  };

  const handleExchange = () => {
      // 1000 Coins -> 10 Gems
      if (user.coins >= 1000) {
          audioManager.playSFX('click');
          onUpdateUser({
              ...user,
              coins: user.coins - 1000,
              gems: user.gems + 10
          });
      } else {
          audioManager.playSFX('wrong');
      }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-20">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-orbitron text-white">Store & Treasury</h2>
          <div className="flex bg-slate-900 rounded-full p-1 border border-white/10">
             <button onClick={() => setActiveTab('ITEMS')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'ITEMS' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}>Items</button>
             <button onClick={() => setActiveTab('PREMIUM')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'PREMIUM' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>Premium</button>
             <button onClick={() => setActiveTab('EXCHANGE')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'EXCHANGE' ? 'bg-green-600 text-white' : 'text-gray-400'}`}>Exchange</button>
          </div>
       </div>

       {/* ITEMS TAB */}
       {activeTab === 'ITEMS' && (
           <div className="space-y-8">
               {/* Avatars */}
               <div>
                   <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><ShoppingBag size={18}/> Avatars</h3>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {GAME_ITEMS.filter(i => i.type === 'AVATAR' && i.priceCoins).map(item => {
                           const isOwned = user.inventory.includes(item.id);
                           const isSelected = user.selectedAvatar === item.id;
                           const canAfford = user.coins >= (item.priceCoins || 0);
                           return (
                               <div key={item.id} className={`bg-slate-900/50 p-4 rounded-xl border ${isSelected ? 'border-green-500 ring-2 ring-green-500/50' : 'border-white/10'} flex flex-col items-center relative overflow-hidden transition-all`}>
                                   <div className="mb-2">
                                       {item.content.startsWith('http') ? (
                                           <img src={item.content} alt={item.name} className="w-16 h-16 rounded-full border-2 border-white/20 bg-slate-800 object-cover" />
                                       ) : (
                                           <div className="text-5xl">{item.content}</div>
                                       )}
                                   </div>
                                   <div className={`font-bold text-center text-sm ${item.rarity === 'Legendary' ? 'text-yellow-400' : 'text-white'}`}>{item.name}</div>
                                   
                                   {isOwned ? (
                                       <button 
                                           onClick={() => onUpdateUser({...user, selectedAvatar: item.id})}
                                           className={`mt-2 w-full py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 ${isSelected ? 'bg-green-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                                       >
                                           {isSelected ? <Check size={12}/> : 'EQUIP'}
                                       </button>
                                   ) : (
                                       <button 
                                          onClick={() => handleBuyItem(item)}
                                          disabled={!canAfford}
                                          className={`mt-2 w-full py-1 rounded text-xs font-bold flex items-center justify-center gap-1 ${canAfford ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                       >
                                           <Coins size={12}/> {item.priceCoins}
                                       </button>
                                   )}
                                   <div className="absolute top-2 right-2 text-[10px] text-gray-500 uppercase">{item.rarity}</div>
                               </div>
                           );
                       })}
                   </div>
               </div>

               {/* Frames */}
               <div>
                   <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><ShoppingBag size={18}/> Frames</h3>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {GAME_ITEMS.filter(i => i.type === 'FRAME' && i.priceCoins).map(item => {
                           const isOwned = user.inventory.includes(item.id);
                           const canAfford = user.coins >= (item.priceCoins || 0);
                           return (
                               <div key={item.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/10 flex flex-col items-center relative overflow-hidden">
                                   <div className={`w-12 h-12 mb-2 rounded-full border-4 ${item.content.replace('border-', 'border-').split(' ')[0]} bg-gray-800`}></div>
                                   <div className={`font-bold ${item.rarity === 'Legendary' ? 'text-yellow-400' : 'text-white'}`}>{item.name}</div>
                                   
                                   {isOwned ? (
                                       <div className="mt-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                           <Check size={12}/> OWNED
                                       </div>
                                   ) : (
                                       <button 
                                          onClick={() => handleBuyItem(item)}
                                          disabled={!canAfford}
                                          className={`mt-2 w-full py-1 rounded text-xs font-bold flex items-center justify-center gap-1 ${canAfford ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                       >
                                           <Coins size={12}/> {item.priceCoins}
                                       </button>
                                   )}
                                   <div className="absolute top-2 right-2 text-[10px] text-gray-500 uppercase">{item.rarity}</div>
                               </div>
                           );
                       })}
                   </div>
               </div>
           </div>
       )}

       {/* PREMIUM TAB */}
       {activeTab === 'PREMIUM' && (
           <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {(['Platinum', 'Diamond', 'Black'] as ChestTier[]).map(tier => (
                       <div key={tier} className={`relative p-6 rounded-2xl bg-gradient-to-b ${CHEST_DATA[tier].color} border border-white/10 overflow-hidden group`}>
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                               <Gem size={100} />
                           </div>
                           <h3 className="text-2xl font-black font-orbitron text-white mb-2 uppercase">{tier} Chest</h3>
                           <p className="text-sm text-white/70 mb-4 h-10">Contains massive riches and guaranteed {tier === 'Platinum' ? 'Epic' : tier === 'Diamond' ? 'Legendary' : 'Mythic'} items.</p>
                           
                           <div className="flex flex-col gap-3 relative z-10">
                               <button 
                                 onClick={() => handleBuyChest(tier, 'GEMS')}
                                 className="flex items-center justify-between bg-black/40 hover:bg-black/60 p-3 rounded-lg border border-white/10 transition-colors"
                               >
                                   <div className="flex items-center text-cyan-400 font-bold"><Gem size={16} className="mr-2"/> {CHEST_DATA[tier].priceGems}</div>
                                   <span className="text-xs uppercase font-bold text-white">Buy with Gems</span>
                               </button>
                               <button 
                                 onClick={() => handleBuyChest(tier, 'INR')}
                                 className="flex items-center justify-between bg-green-600/80 hover:bg-green-500 p-3 rounded-lg border border-green-400 transition-colors"
                               >
                                   <div className="text-white font-bold">₹ {CHEST_DATA[tier].priceINR}</div>
                                   <span className="text-xs uppercase font-bold text-white">Buy with INR</span>
                               </button>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       )}

       {/* EXCHANGE TAB */}
       {activeTab === 'EXCHANGE' && (
           <div className="flex flex-col items-center justify-center py-12 space-y-8">
               <div className="bg-slate-900/80 p-8 rounded-2xl border border-white/10 max-w-md w-full text-center">
                   <h3 className="text-xl font-orbitron text-gray-300 mb-6">Currency Exchange</h3>
                   
                   <div className="flex items-center justify-between mb-8">
                       <div className="flex flex-col items-center">
                           <Coins size={48} className="text-yellow-400 mb-2"/>
                           <span className="text-2xl font-bold text-white">1,000</span>
                           <span className="text-xs text-gray-500 uppercase">Coins</span>
                       </div>
                       
                       <ArrowRightLeft className="text-gray-600 animate-pulse" size={32} />
                       
                       <div className="flex flex-col items-center">
                           <Gem size={48} className="text-cyan-400 mb-2"/>
                           <span className="text-2xl font-bold text-white">10</span>
                           <span className="text-xs text-gray-500 uppercase">Gems</span>
                       </div>
                   </div>

                   <Button variant="primary" glow disabled={user.coins < 1000} onClick={handleExchange} className="w-full">
                       {user.coins < 1000 ? 'Insufficient Coins' : 'Convert Now'}
                   </Button>
               </div>
           </div>
       )}

       {/* REWARD MODAL */}
       {rewardModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setRewardModal(null)}>
               <div className="bg-slate-900 border-2 border-yellow-500 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden" onClick={e => e.stopPropagation()}>
                   <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>
                   <h2 className="text-3xl font-black font-orbitron text-yellow-400 mb-6 relative z-10">REWARDS!</h2>
                   
                   <div className="flex justify-center gap-6 mb-8 relative z-10">
                       <div className="flex flex-col items-center">
                           <Coins size={40} className="text-yellow-400 mb-2"/>
                           <span className="text-xl font-bold text-white">+{rewardModal.coins}</span>
                       </div>
                       {rewardModal.gems > 0 && (
                        <div className="flex flex-col items-center">
                            <Gem size={40} className="text-cyan-400 mb-2"/>
                            <span className="text-xl font-bold text-white">+{rewardModal.gems}</span>
                        </div>
                       )}
                   </div>

                   {rewardModal.item && (
                       <div className="bg-white/5 p-4 rounded-xl mb-6 border border-white/10 relative z-10">
                           <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">New Item!</div>
                           <div className="text-5xl mb-2">{rewardModal.item.content}</div>
                           <div className={`text-lg font-bold ${
                               rewardModal.item.rarity === 'Common' ? 'text-gray-400' :
                               rewardModal.item.rarity === 'Rare' ? 'text-blue-400' :
                               rewardModal.item.rarity === 'Epic' ? 'text-purple-400' :
                               rewardModal.item.rarity === 'Legendary' ? 'text-yellow-400' : 'text-red-500'
                           }`}>
                               {rewardModal.item.name}
                           </div>
                           <div className="text-[10px] text-gray-500 uppercase">{rewardModal.item.rarity} {rewardModal.item.type}</div>
                       </div>
                   )}

                   <Button variant="gold" onClick={() => setRewardModal(null)} className="w-full relative z-10">Claim</Button>
               </div>
           </div>
       )}
    </div>
  );
};

export default Store;