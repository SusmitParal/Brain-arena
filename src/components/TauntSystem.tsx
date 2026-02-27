import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Smile } from 'lucide-react';
import { SHOP_ITEMS } from '../data/shopItems';
import { soundManager } from '../utils/audio';
import { UserProfile } from '../types';

interface TauntSystemProps {
  onSend: (content: string, type: 'Emoji' | 'Chat' | 'Taunt') => void;
  user: UserProfile;
}

const TauntSystem: React.FC<TauntSystemProps> = ({ onSend, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Emoji' | 'Chat' | 'Taunt'>('Emoji');

  const emojis = SHOP_ITEMS.filter(item => item.type === 'Emoji' && (user.inventory.includes(item.id) || item.cost === 0));
  const chats = SHOP_ITEMS.filter(item => item.type === 'Chat' && (user.inventory.includes(item.id) || item.cost === 0));
  const taunts = SHOP_ITEMS.filter(item => item.type === 'Taunt' && (user.inventory.includes(item.id) || item.cost === 0));

  return (
    <div className="relative">
      <button 
        onClick={() => { soundManager.playSfx('click'); setIsOpen(!isOpen); }}
        className="bg-black/40 p-3 rounded-full border border-white/10 hover:bg-black/60 transition-colors"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 bg-gray-900 border border-white/10 rounded-2xl p-4 shadow-2xl w-72 z-50"
          >
            <div className="flex gap-1 mb-4">
              <button 
                onClick={() => setActiveTab('Emoji')}
                className={`flex-1 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${activeTab === 'Emoji' ? 'bg-blue-600' : 'bg-white/5'}`}
              >
                Emojis
              </button>
              <button 
                onClick={() => setActiveTab('Chat')}
                className={`flex-1 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${activeTab === 'Chat' ? 'bg-blue-600' : 'bg-white/5'}`}
              >
                Chats
              </button>
              <button 
                onClick={() => setActiveTab('Taunt')}
                className={`flex-1 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${activeTab === 'Taunt' ? 'bg-blue-600' : 'bg-white/5'}`}
              >
                Taunts
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto no-scrollbar">
              {activeTab === 'Emoji' && emojis.map(emoji => (
                <button
                  key={emoji.id}
                  onClick={() => {
                    onSend(emoji.assetName, 'Emoji');
                    setIsOpen(false);
                  }}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {emoji.assetName}
                </button>
              ))}
              
              {activeTab === 'Chat' && chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => {
                    onSend(chat.assetName, 'Chat');
                    setIsOpen(false);
                  }}
                  className="col-span-2 bg-white/5 hover:bg-white/10 p-2 rounded-lg text-[10px] font-bold italic"
                >
                  {chat.assetName}
                </button>
              ))}

              {activeTab === 'Taunt' && taunts.map(taunt => (
                <button
                  key={taunt.id}
                  onClick={() => {
                    onSend(taunt.assetName, 'Taunt');
                    setIsOpen(false);
                  }}
                  className="col-span-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-white/10 p-2 rounded-lg text-xs font-black italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
                >
                  {taunt.assetName}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TauntSystem;
