import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export const CrossOutText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation for the first diagonal stroke (Top-Left to Bottom-Right)
  const stroke1Progress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
  });

  // Animation for the second diagonal stroke (Bottom-Left to Top-Right), slightly delayed
  const stroke2Progress = spring({
    frame: frame - 22,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
  });

  // Optional: Gentle fade-in for the text itself
  const textOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        // Checkerboard background to match the reference image context
        backgroundColor: '#f0f0f0',
        backgroundImage: `
          linear-gradient(45deg, #e0e0e0 25%, transparent 25%), 
          linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #e0e0e0 75%), 
          linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* TEXT CONTAINER */}
      <div
        style={{
          fontFamily: '"Times New Roman", Times, "Playfair Display", serif',
          fontSize: '160px',
          color: '#111111',
          display: 'flex',
          alignItems: 'center',
          gap: '32px', // Space between words
          opacity: textOpacity,
        }}
      >
        <span>Please</span>

        {/* TARGET WORD WITH PERFECT X MARK */}
        <span style={{ position: 'relative', display: 'inline-block' }}>
          remove
          
          {/* First Stroke ( \ direction ) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '-5%', // Slight overhang on the left
              width: '110%', // Slight overhang on the right
              height: '16px', // Thick marker line
              backgroundColor: '#e31b1b', // Vibrant red
              borderRadius: '4px',
              // Center origin ensures they cross in the exact middle
              transformOrigin: 'center center',
              transform: `translateY(-50%) rotate(18deg)`,
              // Clip-path reveals the line from left to right smoothly
              clipPath: `inset(0 ${100 - stroke1Progress * 100}% 0 0)`,
              boxShadow: '0 2px 4px rgba(227, 27, 27, 0.3)',
            }}
          />

          {/* Second Stroke ( / direction ) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '-5%',
              width: '110%',
              height: '16px',
              backgroundColor: '#e31b1b',
              borderRadius: '4px',
              transformOrigin: 'center center',
              transform: `translateY(-50%) rotate(-18deg)`,
              clipPath: `inset(0 ${100 - stroke2Progress * 100}% 0 0)`,
              boxShadow: '0 2px 4px rgba(227, 27, 27, 0.3)',
            }}
          />
        </span>

        <span>this</span>
      </div>
    </AbsoluteFill>
  );
};