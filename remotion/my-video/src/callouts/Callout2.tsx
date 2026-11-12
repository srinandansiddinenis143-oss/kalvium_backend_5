
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig, Sequence,
} from 'remotion';

interface Props {
  headlineText?: string;
  badgeText?: string;
}

export const Callout2: React.FC<Props> = ({
  headlineText = 'TUTORIAL',
  badgeText = 'ENCLUDED',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // TIMING: Sequential 4-Step Intro
  // -----------------------------------------------------------
  const dotIntro = spring({ frame, fps, config: { stiffness: 70, damping: 14 } });
  const diagLineIntro = spring({ frame: frame - 10, fps, config: { stiffness: 60, damping: 15 } });
  const horizLineIntro = spring({ frame: frame - 20, fps, config: { stiffness: 60, damping: 15 } });
  const boxesIntro = spring({ frame: frame - 30, fps, config: { stiffness: 60, damping: 15 } });

  // -----------------------------------------------------------
  // TIMING: Sequential 4-Step Outro (Reverse)
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 50;
  const boxesOutro = spring({ frame: frame - outroStartFrame, fps, config: { stiffness: 60, damping: 15 } });
  const horizLineOutro = spring({ frame: frame - (outroStartFrame + 8), fps, config: { stiffness: 60, damping: 15 } });
  const diagLineOutro = spring({ frame: frame - (outroStartFrame + 16), fps, config: { stiffness: 60, damping: 15 } });
  const dotOutro = spring({ frame: frame - (outroStartFrame + 24), fps, config: { stiffness: 70, damping: 14 } });

  // -----------------------------------------------------------
  // INTERPOLATIONS
  // -----------------------------------------------------------
  const dotScale = frame >= outroStartFrame ? interpolate(dotOutro, [0, 1], [1, 0]) : interpolate(dotIntro, [0, 1], [0, 1]);
  const diagLineProgress = frame >= outroStartFrame ? interpolate(diagLineOutro, [0, 1], [1, 0]) : interpolate(diagLineIntro, [0, 1], [0, 1]);
  const horizLineProgress = frame >= outroStartFrame ? interpolate(horizLineOutro, [0, 1], [1, 0]) : interpolate(horizLineIntro, [0, 1], [0, 1]);
  const boxesScaleX = frame >= outroStartFrame ? interpolate(boxesOutro, [0, 1], [1, 0]) : interpolate(boxesIntro, [0, 1], [0, 1]);

  // -----------------------------------------------------------
  // LAYOUT COORDINATES
  // -----------------------------------------------------------
  const dotX = 1100;
  const dotY = 700;

  // Diagonal pointer line vector (Up and Left)
  const lineDeltaX = -80;
  const lineDeltaY = -80;

  const lineLength = Math.sqrt(lineDeltaX * lineDeltaX + lineDeltaY * lineDeltaY);
  const lineAngle = (Math.atan2(lineDeltaY, lineDeltaX) * 180) / Math.PI;

  const cornerX = dotX + lineDeltaX;
  const cornerY = dotY + lineDeltaY;

  const horizontalLineWidth = 320;

  return (
    <>
      <AbsoluteFill style={{ backgroundColor: 'transparent', fontFamily: 'Montserrat, Arial, sans-serif' }}>
        
        {/* 1. Target Circle Node */}
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
      
        {/* 2. Diagonal Pointer Line */}
        <div
          style={{
            position: 'absolute', left: dotX, top: dotY,
            width: lineLength, height: 2, backgroundColor: '#FFFFFF',
            transform: `rotate(${lineAngle}deg) scaleX(${diagLineProgress})`,
            transformOrigin: 'left center', zIndex: 3,
          }}
        />
      
        {/* 3. Horizontal Baseline Line */}
        <div
          style={{
            position: 'absolute',
            left: cornerX - horizontalLineWidth,
            top: cornerY,
            width: horizontalLineWidth,
            height: 2,
            backgroundColor: '#FFFFFF',
            transform: `scaleX(${horizLineProgress})`,
            transformOrigin: 'right center',
            zIndex: 3,
          }}
        />
      
        {/* 4. Text Content Container with Increased Spacing */}
        <div
          style={{
            position: 'absolute',
            right: 1920 - cornerX,
            top: cornerY,
            transform: `scaleX(${boxesScaleX})`,
            transformOrigin: 'right bottom',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            zIndex: 2,
          }}
        >
          {/* Top White Box (Pushed up to create a clean gap above the line) */}
          <div
            style={{
              position: 'absolute',
              bottom: 8, // Increased gap from the horizontal line
              right: 0,
              backgroundColor: '#FFFFFF',
              padding: '14px 45px',
              zIndex: 2,
            }}
          >
            <span
              style={{
                color: '#0288D1', fontSize: 36, fontWeight: 900,
                letterSpacing: '3px', textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {headlineText}
            </span>
          </div>
      
          {/* Bottom Blue Badge (Pushed down to create a clean gap below the line) */}
          <div
            style={{
              position: 'absolute',
              top: 10, // Increased gap below the horizontal line
              right: horizontalLineWidth - 140,
              backgroundColor: '#0288D1', color: '#FFFFFF',
              padding: '6px 20px', fontSize: 12, fontWeight: 800,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              whiteSpace: 'nowrap', zIndex: 1,
            }}
          >
            {badgeText}
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};