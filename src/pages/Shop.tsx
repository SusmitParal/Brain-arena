import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Coins, Gem, User, Square, Smile, MessageSquare, CheckCircle, Package } from 'lucide-react';
import { UserProfile, ShopItem, ItemType } from '../types';
import { soundManager } from '../utils/audio';
import { SHOP_ITEMS } from '../data/shopItems';

const Shop: React.FC<{ user: UserProfile; onBack: () => void; setUser: React.Dispatch<React.SetStateAction<UserProfile>> }> = ({ user, onBack, setUser }) => {
  const [activeTab, setActiveTab] = useState<ItemType>('Avatar');
  const [showUnlockNotice, setShowUnlockNotice] = useState<{ item: ShopItem | null, message: string }>({ item: null, message: '' });

  const filteredItems = SHOP_ITEMS
    .filter(item => item.type === activeTab && item.cost > 0)
    .sort((a, b) => a.cost - b.cost);

  const tabs: { type: ItemType; icon: React.ReactNode; label: string }[] = [
    { type: 'Avatar', icon: <User size={20} />, label: 'Avatars' },
    { type: 'Border', icon: <Square size={20} />, label: 'Borders' },
    { type: 'Emoji', icon: <Smile size={20} />, label: 'Emojis' },
    { type: 'Chat', icon: <MessageSquare size={20} />, label: 'Chats' },
    { type: 'Taunt', icon: <MessageSquare size={20} />, label: 'Taunts' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-700/50';
      case 'Rare': return 'bg-blue-900/20';
      case 'Epic': return 'bg-purple-900/20';
      case 'Legendary': return 'bg-yellow-900/20';
      default: return 'bg-gray-800';
    }
  };

  const handleItemAction = (item: ShopItem) => {
    const isOwned = user.inventory.includes(item.id) || item.cost === 0;

    if (isOwned) {
      // Equip
      soundManager.playSfx('click');
      setUser(prev => {
        const updates: Partial<UserProfile> = {};
        if (item.type === 'Avatar') updates.selectedAvatar = item.id;
        if (item.type === 'Border') updates.selectedBorder = item.id;
        if (item.type === 'Emoji') updates.selectedEmoji = item.id;
        if (item.type === 'Chat') updates.selectedChat = item.id;
        if (item.type === 'Taunt') updates.selectedTaunt = item.id;
        return { ...prev, ...updates };
      });
    } else {
      // Buy
      const canAfford = item.currency === 'gems' ? user.gems >= item.cost : user.coins >= item.cost;
      
      if (canAfford) {
        soundManager.playSfx('win');
        setUser(prev => ({
          ...prev,
          coins: item.currency === 'gems' ? prev.coins : prev.coins - item.cost,
          gems: item.currency === 'gems' ? prev.gems - item.cost : prev.gems,
          inventory: [...prev.inventory, item.id]
        }));
        setShowUnlockNotice({ item, message: `Congratulations! You unlocked ${item.name}` });
        setTimeout(() => setShowUnlockNotice({ item: null, message: '' }), 3000);
      } else {
        soundManager.playSfx('wrong');
        // Not enough currency
      }
    }
  };

  return (
    <div className="min-h-screen bg-home text-white flex flex-col relative">
      {/* Unlock Notice Modal */}
      <AnimatePresence>
        {showUnlockNotice.item && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b]/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.5)] border border-white/10 text-center w-11/12 max-w-sm"
          >
            <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4 drop-shadow-md" />
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">Unlocked!</h2>
            <p className="font-bold text-sm text-gray-300">{showUnlockNotice.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-[#1e293b]/80 backdrop-blur-xl p-4 flex items-center justify-between sticky top-0 z-10 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { soundManager.playSfx('click'); onBack(); }} 
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">The Vault</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-yellow-500/30 shadow-md">
            <Coins size={16} className="text-yellow-400" />
            <span className="font-bold text-sm">{user.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-pink-500/30 shadow-md">
            <Gem size={16} className="text-pink-400" />
            <span className="font-bold text-sm">{user.gems.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto bg-[#1e293b]/80 backdrop-blur-xl px-2 py-2 gap-2 no-scrollbar border-b border-white/5">
        {tabs.map((tab) => (
          <motion.button
            key={tab.type}
            onClick={() => { soundManager.playSfx('click'); setActiveTab(tab.type); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab.type 
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <AnimatePresence mode="wait">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: index * 0.05 }}
                className={`${getRarityBg(item.rarity)} rounded-[2.5rem] p-4 flex flex-col items-center border border-white/5 relative overflow-hidden group shadow-lg hover:shadow-xl transition-shadow`}
              >
                {/* Rarity Tag */}
                <div className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md ${getRarityColor(item.rarity)} ${item.rarity === 'Common' ? 'bg-gray-700/30' : item.rarity === 'Rare' ? 'bg-blue-700/30' : item.rarity === 'Epic' ? 'bg-purple-700/30' : 'bg-yellow-700/30'}`}>
                  {item.rarity}
                </div>

                {/* Preview */}
                <div className="w-24 h-24 mb-4 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-200">
                  {item.type === 'Avatar' && (
                    <img src={item.assetName} alt={item.name} className="w-full h-full rounded-full object-cover border-2 border-white/10 shadow-lg" referrerPolicy="no-referrer" />
                  )}
                  {item.type === 'Border' && (
                    <div className={`w-20 h-20 rounded-full border-4 ${item.assetName} flex items-center justify-center bg-gray-800 shadow-lg`}>
                      <User size={28} className="text-gray-600" />
                    </div>
                  )}
                  {item.type === 'Emoji' && (
                    <span className="text-6xl drop-shadow-lg">{item.assetName}</span>
                  )}
                  {item.type === 'Chat' && (
                    <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold text-center italic border border-white/10 shadow-md">
                      "{item.assetName}"
                    </div>
                  )}
                  {item.type === 'Taunt' && (
                    <div className="bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 border border-white/10 px-4 py-2 rounded-xl text-sm font-black text-center italic text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-red-500 shadow-md">
                      {item.assetName}
                    </div>
                  )}
                </div>

                <h3 className="font-black text-base text-center line-clamp-1 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">{item.name}</h3>
                
                <div className="mt-3 w-full">
                  <motion.button 
                    onClick={() => handleItemAction(item)}
                    className={`w-full font-black py-2 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider italic text-sm ${
                      user.inventory.includes(item.id) || item.cost === 0
                        ? (user.selectedAvatar === item.id || user.selectedBorder === item.id || user.selectedEmoji === item.id || user.selectedChat === item.id || user.selectedTaunt === item.id)
                          ? 'bg-gradient-to-br from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30'
                        : (item.currency === 'gems' ? user.gems >= item.cost : user.coins >= item.cost)
                          ? 'bg-white/10 hover:bg-white/20 text-white group-hover:bg-gradient-to-br group-hover:from-yellow-400 group-hover:to-orange-500 group-hover:text-black group-hover:shadow-lg group-hover:shadow-yellow-500/30'
                          : 'bg-red-900/50 text-red-500/50 cursor-not-allowed shadow-inner'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    { (user.inventory.includes(item.id) || item.cost === 0) ? (
                      (user.selectedAvatar === item.id || user.selectedBorder === item.id || user.selectedEmoji === item.id || user.selectedChat === item.id || user.selectedTaunt === item.id) ? 'Equipped' : 'Equip'
                    ) : (
                      <>
                        {item.currency === 'gems' ? (
                          <Gem size={14} className={user.gems >= item.cost ? "text-pink-400 group-hover:text-black" : "text-red-500/50"} />
                        ) : (
                          <Coins size={14} className={user.coins >= item.cost ? "text-yellow-400 group-hover:text-black" : "text-red-500/50"} />
                        )}
                        <span>{item.cost}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Shop;
