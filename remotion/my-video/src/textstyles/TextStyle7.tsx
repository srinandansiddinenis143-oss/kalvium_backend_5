import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const TextStyle7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // PREMIUM SENTENCE CONFIGURATION
  // -----------------------------------------------------------
  const words = [
    { text: 'and', color: '#2D3748' },
    { text: 'show', color: '#2D3748' },
    { text: 'you', color: '#2D3748' },
    { text: 'how', color: '#2D3748' },
    { text: 'to', color: '#2D3748' },
    { text: 'make', color: '#0066FF' }, // Highlighted blue word
    { text: 'it', color: '#2D3748' },
    { text: 'look', color: '#2D3748' },
    { text: 'premium', color: '#2D3748' },
  ];

  // -----------------------------------------------------------
  // RIGHT-TO-LEFT CAMERA PAN
  // -----------------------------------------------------------
  const panProgress = frame / 150;
  
  // Starts on the right side of the screen (+800px) and glides smoothly to the left (-1200px)
  const containerX = interpolate(panProgress, [0, 1], [800, -1200]);

  // Outro fade transition
  const outroStart = durationInFrames - 20;
  const outro = spring({ frame: frame - outroStart, fps, config: { stiffness: 80, damping: 16 } });
  const globalOpacity = frame >= outroStart ? interpolate(outro, [0, 1], [1, 0]) : 1;

  return (
    <AbsoluteFill 
      style={{ 
        backgroundColor: '#F8FAFC', 
        overflow: 'hidden',
        opacity: globalOpacity,
        fontFamily: "'Beau Rivage', cursive", // Updated global font family
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Import Beau Rivage from Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Beau+Rivage&display=swap');
        `}
      </style>

      {/* Wrapping Container sliding right-to-left */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline', 
          gap: '24px',
          transform: `translateX(${containerX}px)`, 
          whiteSpace: 'nowrap',
        }}
      >
        {words.map((w, index) => {
          const delay = index * 8;
          
          const wordSpring = spring({
            frame: frame - delay,
            fps,
            config: { 
              stiffness: 180, 
              damping: 12,    
            },
          });

          const translateY = interpolate(wordSpring, [0, 1], [80, 0]);
          const rotate = interpolate(wordSpring, [0, 1], [25, 0]); 
          const opacity = interpolate(wordSpring, [0, 1], [0, 1]);
          const scale = interpolate(wordSpring, [0, 0.5, 1], [0.5, 1.1, 1]); 

          return (
            <div
              key={index}
              style={{
                fontSize: 110, // Increased slightly since cursive fonts often render smaller
                fontWeight: 400, // Beau Rivage only supports 400 weight
                color: w.color,
                opacity,
                transform: `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                transformOrigin: 'left bottom', 
                textShadow: '0px 10px 20px rgba(0,0,0,0.04)',
                marginTop: w.text === 'make' ? '15px' : '0px',
              }}
            >
              {w.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};