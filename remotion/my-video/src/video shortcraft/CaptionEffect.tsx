import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const CaptionEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -----------------------------------------------------------
  // VIRAL CAPTION DATA (Word + Start Frame)
  // Normally, this data comes from an AI transcriber (like Whisper)
  // -----------------------------------------------------------
  const captionData = [
    { text: "This", start: 5 },
    { text: "is", start: 15 },
    { text: "the", start: 25 },
    { text: "most", start: 35 },
    { text: "viral", start: 50 },
    { text: "caption", start: 65 },
    { text: "style", start: 80 },
  ];

  return (
    <AbsoluteFill 
      style={{ 
        backgroundColor: 'transparent', // Ready to be layered over video!
        justifyContent: 'center', 
        alignItems: 'center',
      }}
    >
      {/* Import an ultra-bold block font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
        `}
      </style>

      {/* Caption Wrapper */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '16px',
        width: '900px', // Forces the text to wrap into 2 or 3 lines
      }}>
        {captionData.map((word, index) => {
          const isVisible = frame >= word.start;
          
          // Determine if this specific word is currently being spoken
          const nextWordStart = index < captionData.length - 1 ? captionData[index + 1].start : Infinity;
          const isActive = frame >= word.start && frame < nextWordStart;

          // The aggressive spring animation triggered when the word appears
          const pop = spring({
            frame: frame - word.start,
            fps,
            config: { stiffness: 300, damping: 14 },
          });

          // Math: If active, pop to 1.2x scale. Once past, settle down to standard 1.0 scale.
          const scale = isActive 
            ? interpolate(pop, [0, 1], [0, 1.25]) 
            : isVisible ? 1.0 : 0; 

          // Bright viral yellow for active, solid white for past
          const color = isActive ? '#FFEB00' : '#FFFFFF'; 
          
          // Slight tilt angle for extra impact when the word hits
          const rotate = isActive ? interpolate(pop, [0, 1], [-5, 0]) : 0; 

          return (
            <div
              key={index}
              style={{
                fontSize: 110,
                fontWeight: 900,
                fontFamily: 'Montserrat, sans-serif',
                textTransform: 'uppercase',
                color: color,
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                transformOrigin: 'center center',
                
                // The classic thick black stroke and hard drop shadow
                WebkitTextStroke: '4px black',
                textShadow: '8px 8px 0px rgba(0,0,0,1)',
                
                // Opacity is 0 before it starts, so we don't see it early
                opacity: scale > 0 ? 1 : 0, 
              }}
            >
              {word.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};