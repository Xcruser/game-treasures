'use client';

import { GiDiceSixFacesFive, GiMoneyStack, GiTrophyCup, GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { IoGameController } from 'react-icons/io5';
import { useEffect, useState } from 'react';

// Generiere zufällige Bewegungsparameter für jedes Icon
const generateRandomMovement = () => ({
  duration: 15 + Math.random() * 10, // 15-25 Sekunden
  xOffset: -15 + Math.random() * 30, // -15 bis +15 Pixel
  yOffset: -15 + Math.random() * 30,
  rotateOffset: Math.random() * 360, // 0-360 Grad
  scale: 0.9 + Math.random() * 0.2, // 0.9-1.1
});

const icons = [
  { Icon: GiDiceSixFacesFive, initialPosition: { left: '10%', top: '20%' }, size: '4rem' },
  { Icon: GiMoneyStack, initialPosition: { left: '85%', top: '15%' }, size: '5rem' },
  { Icon: GiTrophyCup, initialPosition: { left: '75%', top: '75%' }, size: '6rem' },
  { Icon: IoGameController, initialPosition: { left: '15%', top: '85%' }, size: '5rem' },
  { Icon: GiPerspectiveDiceSixFacesRandom, initialPosition: { left: '50%', top: '50%' }, size: '4rem' },
].map(icon => ({
  ...icon,
  movement: generateRandomMovement(),
}));

export default function BackgroundIcons() {
  const [isVisible, setIsVisible] = useState(false);
  const [movements, setMovements] = useState(icons.map(() => generateRandomMovement()));

  useEffect(() => {
    setIsVisible(true);
    
    // Periodisch neue Bewegungen generieren
    const interval = setInterval(() => {
      setMovements(prev => prev.map(() => generateRandomMovement()));
    }, 20000); // Alle 20 Sekunden

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {icons.map(({ Icon, initialPosition, size, movement }, index) => {
        
        return (
          <div
            key={index}
            className={`absolute opacity-0 text-blue-400/50 transition-all duration-1000 ease-in-out
              ${isVisible ? 'opacity-[0.15]' : ''}`}
            style={{
              left: initialPosition.left,
              top: initialPosition.top,
              fontSize: size,
              filter: 'blur(1px)',
              transform: 'translate(-50%, -50%)',
              animation: isVisible ? `float-${index} ${movement.duration}s infinite ease-in-out` : '',
            }}
          >
            <Icon 
              className="transform transition-all duration-1000"
              style={{
                animation: isVisible ? `rotate-${index} ${movement.duration * 1.5}s infinite ease-in-out` : '',
              }}
            />
            <style jsx>{`
              @keyframes float-${index} {
                0%, 100% {
                  transform: translate(-50%, -50%) translate(0, 0) scale(1);
                }
                50% {
                  transform: translate(-50%, -50%) 
                    translate(${movement.xOffset}px, ${movement.yOffset}px)
                    scale(${movement.scale});
                }
              }
              @keyframes rotate-${index} {
                0%, 100% {
                  transform: rotate(0deg);
                }
                50% {
                  transform: rotate(${movement.rotateOffset}deg);
                }
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}
