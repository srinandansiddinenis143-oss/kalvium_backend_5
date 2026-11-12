import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export const ForbiddenFruit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Draw the red strikethrough line starting at frame 15
  const lineDrawProgress = spring({
    frame: frame - 15,
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
        <span>The</span>

        {/* TARGET WORD WITH STRIKETHROUGH */}
        <span style={{ position: 'relative', display: 'inline-block' }}>
          forbidden
          
          {/* Animated Red Line */}
          <div
            style={{
              position: 'absolute',
              top: '52%', // Vertically aligned to strike through the middle of lowercase letters
              left: '-2%', // Slight overhang on the left
              width: '104%', // Slight overhang on the right
              height: '16px', // Thick marker line
              backgroundColor: '#e31b1b', // Vibrant red
              borderRadius: '4px',
              transformOrigin: 'left center',
              transform: `translateY(-50%) scaleX(${lineDrawProgress})`,
              boxShadow: '0 2px 4px rgba(227, 27, 27, 0.3)', // Slight glow/bleed effect
            }}
          />
        </span>

        <span>fruit</span>
      </div>
    </AbsoluteFill>
  );
};