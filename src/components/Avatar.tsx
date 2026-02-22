import React from 'react';

export interface AvatarData {
  hair: number;
  face: number;
  body: number;
  accessory: number;
}

interface AvatarProps {
  data: AvatarData;
  size?: number;
}

// For now, we'll use simple colored divs as placeholders for assets.
// These can be replaced with actual image assets later.
const hairOptions = ['#222', '#d27d2d', '#f1c40f', '#6a3423'];
const faceOptions = ['#f2d5c8', '#d1a38e', '#a07c6c', '#7a5e50'];
const bodyOptions = ['#3b82f6', '#ef4444', '#14b8a6', '#8b5cf6'];
const accessoryOptions = ['#eab308', '#ec4899', 'transparent']; // e.g., glasses, hat, or none

const Avatar: React.FC<AvatarProps> = ({ data, size = 128 }) => {
  return (
    <div 
      className="relative rounded-full overflow-hidden"
      style={{ width: size, height: size, backgroundColor: faceOptions[data.face] }}
    >
      {/* Hair */}
      <div 
        className="absolute"
        style={{
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: size * 0.8,
          height: size * 0.5,
          backgroundColor: hairOptions[data.hair],
          borderRadius: '50% 50% 0 0',
        }}
      />
      
      {/* Eyes */}
      <div className="absolute" style={{ top: size * 0.4, left: size * 0.25, width: size * 0.1, height: size * 0.1, backgroundColor: 'white', borderRadius: '50%' }} />
      <div className="absolute" style={{ top: size * 0.4, right: size * 0.25, width: size * 0.1, height: size * 0.1, backgroundColor: 'white', borderRadius: '50%' }} />
      <div className="absolute" style={{ top: size * 0.42, left: size * 0.28, width: size * 0.05, height: size * 0.05, backgroundColor: 'black', borderRadius: '50%' }} />
      <div className="absolute" style={{ top: size * 0.42, right: size * 0.28, width: size * 0.05, height: size * 0.05, backgroundColor: 'black', borderRadius: '50%' }} />

      {/* Body/Clothing */}
      <div 
        className="absolute bottom-0"
        style={{
          width: size,
          height: size * 0.4,
          backgroundColor: bodyOptions[data.body],
        }}
      />

      {/* Accessory (e.g., glasses) */}
      {accessoryOptions[data.accessory] !== 'transparent' && (
        <div 
          className="absolute"
          style={{
            top: size * 0.38,
            left: '50%',
            transform: 'translateX(-50%)',
            width: size * 0.6,
            height: size * 0.15,
            border: `${size * 0.03}px solid ${accessoryOptions[data.accessory]}`,            borderRadius: `${size * 0.05}px`,
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
