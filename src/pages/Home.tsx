import React from 'react';

const Home: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-8">Brain Arena</h1>
      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => onNavigate('SOLO_GAME_LOBBY')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Solo Mode
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          PvP Mode
        </button>
        <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Team vs Team
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
          Pass N' Play
        </button>
        <button onClick={() => onNavigate('TIME_ATTACK')} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Time Attack
        </button>
        <button onClick={() => onNavigate('SURVIVAL')} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Survival Mode
        </button>
      </div>
    </div>
  );
};

export default Home;
