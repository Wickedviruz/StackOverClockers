// frontend/src/components/HomeBackground.tsx
import React from 'react';

const HomeBackground: React.FC = () => {
  const horizontalLines = Array.from({ length: 30 });
  const verticalLines = Array.from({ length: 30 });

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
      <div className="w-full h-full perspective-[1200px]">
        <div className="relative w-full h-full animate-rotateGrid animate-moveGrid">
          {/* Horisontella linjer */}
          {horizontalLines.map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 bg-gridLine opacity-15"
              style={{
                top: `${(i / horizontalLines.length) * 100}%`,
                height: '1px',
              }}
            />
          ))}

          {/* Vertikala linjer */}
          {verticalLines.map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 bg-gridLine opacity-15"
              style={{
                left: `${(i / verticalLines.length) * 100}%`,
                width: '1px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeBackground;
