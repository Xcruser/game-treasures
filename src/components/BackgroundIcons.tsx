'use client';

import { GiDiceSixFacesFive, GiMoneyStack, GiTrophyCup, GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { IoGameController } from 'react-icons/io5';
import { useEffect, useState } from 'react';

const initialIcons = [
  { Icon: GiDiceSixFacesFive, position: { left: '10%', top: '20%' }, size: '4rem' },
  { Icon: GiMoneyStack, position: { left: '85%', top: '15%' }, size: '5rem' },
  { Icon: GiTrophyCup, position: { left: '75%', top: '75%' }, size: '6rem' },
  { Icon: IoGameController, position: { left: '15%', top: '85%' }, size: '5rem' },
  { Icon: GiPerspectiveDiceSixFacesRandom, position: { left: '50%', top: '50%' }, size: '4rem' },
];

export default function BackgroundIcons() {
  const [isClient, setIsClient] = useState(false);
  const [icons, setIcons] = useState(initialIcons.map(icon => ({
    ...icon,
    movement: {
      duration: 20,
      xOffset: 0,
      yOffset: 0,
      rotateOffset: 0,
      scale: 1,
    }
  })));

  useEffect(() => {
    setIsClient(true);
    
    const generateRandomMovement = () => ({
      duration: 15 + Math.random() * 10,
      xOffset: -15 + Math.random() * 30,
      yOffset: -15 + Math.random() * 30,
      rotateOffset: Math.random() * 360,
      scale: 0.9 + Math.random() * 0.2,
    });

    const updateMovements = () => {
      setIcons(prevIcons => 
        prevIcons.map(icon => ({
          ...icon,
          movement: generateRandomMovement(),
        }))
      );
    };

    // Initial movement generation
    updateMovements();

    // Set up interval for movement updates
    const interval = setInterval(updateMovements, 20000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return null; // oder eine statische Version der Icons
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {icons.map(({ Icon, position, size, movement }, index) => (
        <div
          key={index}
          className="absolute opacity-0 text-blue-400/50 transition-all duration-1000 ease-in-out"
          style={{
            left: position.left,
            top: position.top,
            fontSize: size,
            filter: 'blur(1px)',
            transform: 'translate(-50%, -50%)',
            opacity: isClient ? 0.15 : 0,
            animation: isClient ? `float-${index} ${movement.duration}s infinite ease-in-out` : 'none',
          }}
        >
          <Icon 
            className="transform transition-all duration-1000"
            style={{
              animation: isClient ? `rotate-${index} ${movement.duration * 1.5}s infinite ease-in-out` : 'none',
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
      ))}
    </div>
  );
}
