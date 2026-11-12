import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const TextStyle6: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // TEXT & LETTER SEQUENCE CONFIGURATION
  // -----------------------------------------------------------
  const sentence = "motion graphics";
  const letters = sentence.split('');

  // Perfect fit speed control
  const slowProgress = frame / 150; 

  // Maps the scroll distance from right to left
  const totalLength = letters.length;
  const containerX = interpolate(slowProgress, [0, 1], [1800, - (totalLength * 65)]);

  // Entrance zoom effect: zooms in from 0.3 to 1.0 during the first 45 frames
  const entranceZoom = interpolate(frame, [0, 45], [0.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Outro fade out
  const outroOpacity = frame > durationInFrames - 30 
    ? interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0]) 
    : 1;

  return (
    <AbsoluteFill
      style={{
        // Transparent background
        backgroundColor: 'transparent',

        overflow: 'hidden',
        opacity: outroOpacity,
        fontFamily: 'Montserrat, Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scale: 1.344
      }}
    >
      {/* Google Fonts Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap');
        `}
      </style>

      {/* Main Container with Entrance Zoom & Sliding Track */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          gap: '8px', // Tight letter spacing
          transform: `translateX(${containerX}px) scale(${entranceZoom})`,
          transformOrigin: 'center center',
          whiteSpace: 'nowrap',
        }}
      >
        {letters.map((letter, index) => {
          // Calculate each letter's position relative to screen center (960px)
          const letterApproxX = containerX + (index * 50);
          const distanceFromCenter = 960 - letterApproxX;

          // Proximity factor for scale & vertical arc
          const absDistance = Math.abs(distanceFromCenter);
          const proximity = Math.max(0, 1 - absDistance / 280);

          // Middle letter rises higher and scales larger
          const scale = interpolate(proximity, [0, 1], [0.85, 1.3]);
          const translateY = interpolate(proximity, [0, 1], [20, -20]); 
          
          // Once passed the center, letters stay permanently neon blue
          const hasPassedCenter = distanceFromCenter <= 50; 
          const opacity = hasPassedCenter ? 1 : interpolate(proximity, [0, 1], [0.35, 1]);
          const color = (proximity > 0.65 || hasPassedCenter) ? '#00B4D8' : '#FFFFFF';
          
          const textShadow = (proximity > 0.65 || hasPassedCenter)
            ? '0 0 35px rgba(0, 180, 216, 0.9), 0 0 70px rgba(0, 180, 216, 0.4)'
            : '0 0 10px rgba(255, 255, 255, 0.15)';

          return (
            <div
              key={index}
              style={{
                fontSize: 96,
                fontWeight: 900,
                textTransform: 'lowercase',
                color,
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                transformOrigin: 'center center',
                textShadow,
                width: letter === ' ' ? '20px' : 'auto',
                textAlign: 'center',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};