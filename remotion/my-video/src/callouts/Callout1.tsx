import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  badgeText?: string;
  headlineText?: string;
}

export const Callout1: React.FC<Props> = ({
  badgeText = 'CALL OUT TITLES',
  headlineText = 'UNIVERSAL',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // TIMING: Sequential 4-Step Intro
  // -----------------------------------------------------------
  const dotIntro = spring({ frame, fps, config: { stiffness: 70, damping: 14 } });
  const diagLineIntro = spring({ frame: frame - 12, fps, config: { stiffness: 60, damping: 15 } });
  const vertLineIntro = spring({ frame: frame - 24, fps, config: { stiffness: 60, damping: 15 } });
  const boxIntro = spring({ frame: frame - 36, fps, config: { stiffness: 60, damping: 15 } });

  // -----------------------------------------------------------
  // TIMING: Sequential 4-Step Outro
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 55;
  const boxOutro = spring({ frame: frame - outroStartFrame, fps, config: { stiffness: 60, damping: 15 } });
  const vertLineOutro = spring({ frame: frame - (outroStartFrame + 12), fps, config: { stiffness: 60, damping: 15 } });
  const diagLineOutro = spring({ frame: frame - (outroStartFrame + 24), fps, config: { stiffness: 60, damping: 15 } });
  const dotOutro = spring({ frame: frame - (outroStartFrame + 36), fps, config: { stiffness: 70, damping: 14 } });

  // -----------------------------------------------------------
  // INTERPOLATIONS
  // -----------------------------------------------------------
  const dotScale = frame >= outroStartFrame ? interpolate(dotOutro, [0, 1], [1, 0]) : interpolate(dotIntro, [0, 1], [0, 1]);
  const diagLineProgress = frame >= outroStartFrame ? interpolate(diagLineOutro, [0, 1], [1, 0]) : interpolate(diagLineIntro, [0, 1], [0, 1]);
  const vertLineProgress = frame >= outroStartFrame ? interpolate(vertLineOutro, [0, 1], [1, 0]) : interpolate(vertLineIntro, [0, 1], [0, 1]);
  const boxScaleX = frame >= outroStartFrame ? interpolate(boxOutro, [0, 1], [1, 0]) : interpolate(boxIntro, [0, 1], [0, 1]);

  // -----------------------------------------------------------
  // ZERO-GAP LAYOUT COORDINATES
  // -----------------------------------------------------------
  // 1. Target Dot Position (Bottom Right)
  const dotX = 1100;
  const dotY = 700;

  // 2. Diagonal Line Vector - HEIGHT DECREASED
  const lineDeltaX = -80; // Decreased from -130
  const lineDeltaY = -80; // Decreased from -130

  const lineLength = Math.sqrt(lineDeltaX * lineDeltaX + lineDeltaY * lineDeltaY);
  const lineAngle = (Math.atan2(lineDeltaY, lineDeltaX) * 180) / Math.PI; // -135deg

  // 3. The exact shared corner pixel (Where all 3 elements connect perfectly)
  const stemX = dotX + lineDeltaX;
  const stemY = dotY + lineDeltaY;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      
      {/* STEP 1: Target Circle Node */}
      <div
        style={{
          position: 'absolute', left: dotX, top: dotY,
          width: 28, height: 28, borderRadius: '50%',
          border: '2px solid #FFFFFF', backgroundColor: '#0288D1',
          transform: `translate(-50%, -50%) scale(${dotScale})`,
          transformOrigin: 'center center',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 4, boxShadow: '0 0 10px rgba(2, 136, 209, 0.6)',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
      </div>

      {/* STEP 2: Diagonal Line */}
      <div
        style={{
          position: 'absolute', left: dotX, top: dotY,
          width: lineLength, height: 2, backgroundColor: '#FFFFFF',
          transform: `rotate(${lineAngle}deg) scaleX(${diagLineProgress})`,
          transformOrigin: 'left center', zIndex: 3,
        }}
      />

      {/* STEP 3: Vertical Stem Line (Anchored exactly at stemX, stemY) */}
      <div
        style={{
          position: 'absolute', 
          left: stemX - 1, // Offset by 1px left so it perfectly overlaps the box edge to kill any gap
          top: stemY + 1, // Offset by 1px down to seal the bottom corner gap
          width: 2, height: 104, 
          backgroundColor: '#FFFFFF',
          transform: `translate(0, -100%) scaleY(${vertLineProgress})`,
          transformOrigin: 'bottom center', zIndex: 3,
        }}
      />

      {/* STEP 4: Text Boxes Container */}
      <div
        style={{
          position: 'absolute',
          left: stemX, // Right edge of this container sits EXACTLY at stemX
          top: stemY, // Bottom edge of this container sits EXACTLY at stemY
          transform: `translate(-100%, -100%) scaleX(${boxScaleX})`,
          transformOrigin: 'right bottom', // Expands horizontally to the left from the stem
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', // Aligns badge and box to the right
          zIndex: 2,
        }}
      >
        {/* Top Blue Badge */}
        <div
          style={{
            backgroundColor: '#0288D1', color: '#FFFFFF',
            padding: '4px 16px', fontSize: 13, fontWeight: 800,
            letterSpacing: '1px', textTransform: 'uppercase',
            whiteSpace: 'nowrap', zIndex: 2,
            marginBottom: -2, // Pulls down to perfectly overlap the top border of the box below
          }}
        >
          {badgeText}
        </div>

        {/* Main Text Box */}
        <div
          style={{
            border: '2px solid #FFFFFF',
            borderRight: 'none', // REMOVED RIGHT BORDER - relies entirely on the vertical stem
            padding: '12px 40px', backgroundColor: 'rgba(15, 15, 15, 0.9)',
            zIndex: 1, 
          }}
        >
          <span
            style={{
              color: '#FFFFFF', fontSize: 40, fontWeight: 900,
              letterSpacing: '3px', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {headlineText}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};