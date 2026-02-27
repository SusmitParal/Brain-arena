import React from 'react';
import { soundManager } from '../utils/audio';

const NavIcon: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={() => { soundManager.playSfx('click'); onClick(); }} className={`flex flex-col items-center gap-1 ${active ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-200'}`}>
    <div className={`p-1 rounded-xl ${active ? 'bg-yellow-400/10' : ''}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: active ? 3 : 2 })}
    </div>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default NavIcon;
