import React from 'react';
import { Calendar, Clock, Trophy, Users, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const TOURNAMENTS_DATA = [
  {
    id: 1,
    title: "Weekend Warriors",
    prize: "10,000 Coins",
    entry: "Free",
    time: "Ends in 2d 4h",
    players: "1.2k",
    color: "from-purple-600 to-blue-600"
  },
  {
    id: 2,
    title: "Speed Run Alpha",
    prize: "50 Gems",
    entry: "500 Coins",
    time: "Starts in 5h",
    players: "450",
    color: "from-orange-500 to-red-600"
  },
  {
    id: 3,
    title: "Brainiac Championship",
    prize: "Mythic Chest",
    entry: "10 Gems",
    time: "Starts in 1d",
    players: "890",
    color: "from-yellow-500 to-amber-600"
  }
];

const Tournaments: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col p-6 animate-fade-in overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-orbitron text-white mb-2">Live Events</h2>
        <p className="text-gray-400">Compete in limited-time events for exclusive rewards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOURNAMENTS_DATA.map(t => (
          <div key={t.id} className="relative group overflow-hidden rounded-3xl bg-slate-900 border border-white/10 hover:border-white/30 transition-all">
            <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Clock size={12} /> {t.time}
                </div>
                <div className="bg-black/40 px-3 py-1 rounded-full text-xs font-bold text-gray-300 flex items-center gap-2">
                  <Users size={12} /> {t.players}
                </div>
              </div>
              
              <h3 className="text-2xl font-black font-orbitron text-white mb-2">{t.title}</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400">Prize Pool</span>
                  <span className="text-yellow-400 font-bold flex items-center gap-1"><Trophy size={14}/> {t.prize}</span>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400">Entry</span>
                  <span className="text-white font-bold">{t.entry}</span>
                </div>
              </div>

              <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                Register Now <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tournaments;
