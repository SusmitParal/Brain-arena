import React from 'react';

const SoloGameLobby: React.FC<{ onStartGame: (difficulty: string) => void }> = ({ onStartGame }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-8">Infinite Climb</h1>
      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => onStartGame('Beginner')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Beginner
        </button>
        <button onClick={() => onStartGame('Intermediate')} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
          Intermediate
        </button>
        <button onClick={() => onStartGame('Expert')} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Expert
        </button>
      </div>
    </div>
  );
};

export default SoloGameLobby;
