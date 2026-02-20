import React, { useState } from 'react';
import { UserProfile, Teammate } from '../types';
import Button from '../components/Button';
import { Users, Search, Copy, Shield, Plus, UserPlus, CheckCircle } from 'lucide-react';
import { audioManager } from '../services/audioService';
import { TEAM_BOT_NAMES, GAME_ITEMS } from '../constants';

interface SocialHubProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  onNavigate: (s: any) => void;
}

const SocialHub: React.FC<SocialHubProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'FRIENDS' | 'TEAM'>('FRIENDS');
  const [searchCode, setSearchCode] = useState('');
  const [teamNameInput, setTeamNameInput] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.friendCode);
    setStatusMsg('ID Copied!');
    setTimeout(() => setStatusMsg(''), 2000);
    audioManager.playSFX('click');
  };

  const handleAddFriend = () => {
    if (searchCode.length < 6) {
      setStatusMsg("Invalid ID");
      return;
    }
    if (searchCode === user.friendCode) {
      setStatusMsg("You cannot add yourself.");
      return;
    }
    // Simulate finding a friend
    const isReal = Math.random() > 0.1; 
    if (isReal) {
      const newFriend: Teammate = {
        id: `friend_${Date.now()}`,
        name: TEAM_BOT_NAMES[Math.floor(Math.random() * TEAM_BOT_NAMES.length)],
        isOnline: true,
        avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${Date.now()}`
      };
      onUpdateUser({
        ...user,
        friends: [...user.friends, newFriend]
      });
      setSearchCode('');
      setStatusMsg(`Added ${newFriend.name}!`);
      audioManager.playSFX('win');
    } else {
      setStatusMsg("Player not found.");
      audioManager.playSFX('wrong');
    }
  };

  const handleCreateTeam = () => {
    if (!teamNameInput) return;
    onUpdateUser({ ...user, teamName: teamNameInput });
    audioManager.playSFX('win');
    setStatusMsg('Team Created!');
  };

  const handleLeaveTeam = () => {
     if(confirm("Leave current team?")) {
        onUpdateUser({ ...user, teamName: undefined });
     }
  };

  return (
    <div className="flex-1 flex flex-col p-6 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-orbitron text-white">Social Hub</h2>
        <div className="flex bg-slate-900 rounded-full p-1 border border-white/10">
            <button onClick={() => setActiveTab('FRIENDS')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'FRIENDS' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}>Friends</button>
            <button onClick={() => setActiveTab('TEAM')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'TEAM' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>Team</button>
        </div>
      </div>

      {/* ID Section */}
      <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-1">Your Operative ID</h3>
          <div className="text-4xl font-mono font-bold text-cyan-400 tracking-widest">{user.friendCode}</div>
        </div>
        <Button variant="secondary" onClick={handleCopyId} className="flex items-center gap-2">
           <Copy size={18} /> Copy ID
        </Button>
      </div>

      {statusMsg && <div className="bg-green-500/20 text-green-400 text-center p-2 rounded-lg mb-4 animate-pulse">{statusMsg}</div>}

      {activeTab === 'FRIENDS' && (
        <div className="space-y-6">
           <div className="flex gap-2">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
               <input 
                 type="text" 
                 placeholder="Enter Friend ID (e.g. 847291)"
                 value={searchCode}
                 onChange={(e) => setSearchCode(e.target.value.replace(/\D/g,'').slice(0,6))}
                 className="w-full bg-black/40 border border-white/20 rounded-lg py-3 pl-10 text-white focus:border-cyan-400 outline-none font-mono"
               />
             </div>
             <Button onClick={handleAddFriend}><UserPlus size={20}/></Button>
           </div>

           <div>
             <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Users size={20}/> Friends List ({user.friends.length})</h3>
             <div className="space-y-2">
               {user.friends.length === 0 ? (
                 <div className="text-gray-500 text-center py-8">No friends added yet. Share your ID!</div>
               ) : (
                 user.friends.map(friend => (
                   <div key={friend.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-white/5">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 border border-white/20">
                           {friend.avatar.startsWith('http') ? (
                               <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center text-xl">{friend.avatar}</div>
                           )}
                       </div>
                       <span className="font-bold text-white">{friend.name}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs">
                       <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                       {friend.isOnline ? 'Online' : 'Offline'}
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>
        </div>
      )}

      {activeTab === 'TEAM' && (
        <div className="flex flex-col h-full">
           {!user.teamName ? (
             <div className="text-center py-12 space-y-6">
                <Shield size={64} className="mx-auto text-gray-600 mb-4"/>
                <h3 className="text-2xl font-orbitron text-gray-300">No Team Affiliation</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Create a squad to participate in high-stakes 7v7 battles.</p>
                
                <div className="max-w-xs mx-auto space-y-4">
                  <input 
                    type="text" 
                    placeholder="Enter New Team Name" 
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 p-3 rounded-lg text-center font-orbitron text-white"
                  />
                  <Button variant="primary" glow className="w-full" onClick={handleCreateTeam}>Create Team</Button>
                  <div className="text-xs text-gray-600 uppercase">OR</div>
                  <Button variant="secondary" className="w-full">Join via Invite (Coming Soon)</Button>
                </div>
             </div>
           ) : (
             <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 p-6 rounded-2xl border border-white/10 text-center relative overflow-hidden">
                   <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 w-64 h-64" />
                   <h2 className="text-4xl font-black font-orbitron text-white relative z-10">{user.teamName}</h2>
                   <div className="mt-4 flex justify-center gap-4 relative z-10">
                      <Button variant="primary" glow onClick={() => onNavigate('TEAM_LOBBY')}>Go to Battle Lobby</Button>
                      <Button variant="danger" onClick={handleLeaveTeam}>Leave Team</Button>
                   </div>
                </div>

                <div>
                   <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-4">Roster</h3>
                   {/* Simulate Roster including User */}
                   <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-cyan-500/30">
                         <div className="flex items-center gap-3">
                           {(() => {
                               const userAvatarItem = GAME_ITEMS.find(i => i.id === (user.selectedAvatar || 'av_1'));
                               const url = userAvatarItem?.content || 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=rookie';
                               return url.startsWith('http') ? 
                                 <img src={url} alt="me" className="w-10 h-10 rounded-full border border-cyan-400 bg-slate-800 object-cover"/> : 
                                 <span className="text-2xl">{url}</span>;
                           })()}
                           <div>
                              <div className="font-bold text-cyan-400">{user.name} (You)</div>
                              <div className="text-[10px] text-gray-500">Captain</div>
                           </div>
                         </div>
                         <span className="text-green-400 text-xs font-bold">Online</span>
                      </div>
                      {/* Placeholder Mock Members */}
                      {user.friends.slice(0, 3).map(f => (
                         <div key={f.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                              {f.avatar.startsWith('http') ? 
                                <img src={f.avatar} alt={f.name} className="w-10 h-10 rounded-full bg-slate-700 object-cover"/> : 
                                <span className="text-2xl">{f.avatar}</span>
                              }
                              <div className="font-bold text-gray-300">{f.name}</div>
                            </div>
                            <span className="text-green-400 text-xs font-bold">Online</span>
                         </div>
                      ))}
                   </div>
                   <div className="mt-4 text-center text-xs text-gray-500">
                      Invite more friends to fill the 7 slots for battle.
                   </div>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default SocialHub;
