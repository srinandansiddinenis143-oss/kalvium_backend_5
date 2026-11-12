import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const TextStyle5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // TIGHTENED WORD CONFIGURATION (Reduced X/Y spacing gaps)
  // -----------------------------------------------------------
  const words = [
    { text: 'or', font: 'Montserrat, sans-serif', weight: 400, size: 48, x: 790, y: 395, color: '#0a0b0c', delay: 0 },
    { text: 'simply', font: 'Montserrat, sans-serif', weight: 900, size: 120, x: 860, y: 320, color: '#1A202C', delay: 15 },
    { text: 'fit', font: 'Montserrat, sans-serif', weight: 300, size: 44, x: 1290, y: 385, color: '#050606', delay: 30 },
    { text: 'they', font: 'Montserrat, sans-serif', weight: 700, size: 80, x: 770, y: 460, color: '#1A202C', delay: 45 },
    { text: "don't", font: 'Montserrat, sans-serif', weight: 900, size: 110, x: 970, y: 445, color: '#130e10', delay: 60 },
    { text: 'the', font: 'Montserrat, sans-serif', weight: 400, size: 48, x: 1320, y: 470, color: '#0d0f11', delay: 75 },
    { text: 'Video', font: 'Beau Rivage, cursive', weight: 400, size: 170, x: 760, y: 520, color: '#090d0d', delay: 90 },
  ];

  // -----------------------------------------------------------
  // CINEMATIC SMOOTH CAMERA TRACKING
  // -----------------------------------------------------------
  let activeIndex = 0;
  for (let i = 0; i < words.length; i++) {
    if (frame >= words[i].delay) {
      activeIndex = i;
    }
  }
  const activeWord = words[activeIndex];
  const prevIndex = Math.max(0, activeIndex - 1);
  const prevWord = words[prevIndex];

  const camProgress = spring({
    frame: frame - activeWord.delay,
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  const prevTargetX = 960 - prevWord.x;
  const prevTargetY = 540 - prevWord.y;
  const targetX = 960 - activeWord.x;
  const targetY = 540 - activeWord.y;

  const currentCamX = interpolate(camProgress, [0, 1], [prevTargetX, targetX]);
  const currentCamY = interpolate(camProgress, [0, 1], [prevTargetY, targetY]);
  const currentZoom = interpolate(camProgress, [0, 1], [1.15, 1.25]);

  const outroStart = durationInFrames - 35;
  const outro = spring({ frame: frame - outroStart, fps, config: { stiffness: 60, damping: 18 } });
  const globalOpacity = frame >= outroStart ? interpolate(outro, [0, 1], [1, 0]) : 1;

  return (
    <AbsoluteFill 
      style={{ 
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        opacity: globalOpacity,
        fontFamily: 'Montserrat, Arial, sans-serif',
      }}
    >
      {/* Inject Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Beau+Rivage&family=Montserrat:wght@300;400;700;900&display=swap');
        `}
      </style>

      {/* Cinematic Camera Rig */}
      <div
        style={{
          position: 'absolute',
          width: 1920,
          height: 1080,
          transform: `translate(${currentCamX}px, ${currentCamY}px) scale(${currentZoom})`,
          transformOrigin: 'center center',
        }}
      >
        {words.map((w, index) => {
          const wordIntro = spring({ frame: frame - w.delay, fps, config: { stiffness: 70, damping: 16 } });
          const scale = interpolate(wordIntro, [0, 1], [0.85, 1]);
          const opacity = interpolate(wordIntro, [0, 1], [0, 1]);
          const translateY = interpolate(wordIntro, [0, 1], [20, 0]);

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: w.x,
                top: w.y,
                fontFamily: w.font,
                fontWeight: w.weight,
                fontSize: w.size,
                color: w.color,
                lineHeight: 0.9,
                whiteSpace: 'nowrap',
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                transformOrigin: 'left center',
                textShadow: '0 4px 20px rgba(0,0,0,0.06)',
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