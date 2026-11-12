import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  text?: string;
}

export const TextStyles3: React.FC<Props> = ({ text = 'INITIALIZING SYSTEM ARCHITECTURE...' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Typing speed: 2 frames per character
  const charsToShow = Math.floor(frame / 2);
  const displayText = text.slice(0, charsToShow);

  // Blinking cursor toggle every 15 frames
  const showCursor = Math.floor(frame / 15) % 2 === 0 && frame < durationInFrames - 15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0B0F19',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Courier New, monospace'
      }}
    >
      <div
        style={{
          color: '#40E0D0',
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: '2px',
          backgroundColor: 'rgba(64, 224, 208, 0.1)',
          padding: '20px 35px',
          borderLeft: '4px solid #40E0D0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <span>{displayText}</span>
        <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', backgroundColor: '#40E0D0' }}>&nbsp;</span>
      </div>
    </AbsoluteFill>
  );
};