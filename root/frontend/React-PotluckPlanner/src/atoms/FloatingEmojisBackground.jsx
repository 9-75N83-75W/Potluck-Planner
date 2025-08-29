
import React, { useEffect, useState } from "react";

const emojis = ["🍕", "🥗", "🍰", "🥘", "🍜", "🍔", "🍣", "🌮", "🥨", "🍩", "🍓", "🍉", "🥑", "🍪", "🥟"];

const FloatingEmojisBackground = () => {
  const [positions, setPositions] = useState([]);

    useEffect(() => {
        const count = emojis.length;
        const newPositions = emojis.map((_, i) => {
        const side = i % 4; // 0 = top, 1 = right, 2 = bottom, 3 = left
        let top = 0;
        let left = 0;
    
        if (side === 0) {
            // Top edge
            top = Math.random() * 5; 
            left = (i / count) * 100 + Math.random() * 5;
        } else if (side === 1) {
            // Right edge (pulled inward from edge)
            top = (i / count) * 100 + Math.random() * 5;
            left = 85 + Math.random() * 5; // closer to middle than before (was 95+)
        } else if (side === 2) {
            // Bottom edge (moved up higher)
            top = 80 + Math.random() * 5; // higher than 95+
            left = (i / count) * 100 + Math.random() * 5;
        } else {
            // Left edge
            top = (i / count) * 100 + Math.random() * 5;
            left = Math.random() * 5;
        }
    
        return {
            top,
            left,
            delay: Math.random() * 2,
            size: Math.random() * 2 + 1,
        };
        });
    
        setPositions(newPositions);
    }, []);
  

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0, // stays behind white cards
      }}
    >
      {positions.map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            // fontSize: `${pos.size}rem`,
            fontSize: "75px",
            opacity: 0.7,
            animation: `bounce 3s ease-in-out infinite`,
            animationDelay: `${pos.delay}s`,
          }}
        >
          {emojis[i % emojis.length]}
        </div>
      ))}

      {/* Bounce keyframes */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
};

export default FloatingEmojisBackground;