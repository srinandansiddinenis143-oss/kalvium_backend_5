import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  headlineText?: string;
  badgeText?: string;
}

export const Callout3: React.FC<Props> = ({
  headlineText = 'VIDEO TUTORIAL',
  badgeText = 'INCLUDED',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // TIMING: Sequential 3-Step Intro (Dot -> Diag Line -> Skewed Boxes)
  // -----------------------------------------------------------
  const dotIntro = spring({ frame, fps, config: { stiffness: 70, damping: 14 } });
  const diagLineIntro = spring({ frame: frame - 12, fps, config: { stiffness: 60, damping: 15 } });
  const boxesIntro = spring({ frame: frame - 24, fps, config: { stiffness: 60, damping: 15 } });

  // -----------------------------------------------------------
  // TIMING: Sequential 3-Step Outro (Reverse)
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 45;
  const boxesOutro = spring({ frame: frame - outroStartFrame, fps, config: { stiffness: 60, damping: 15 } });
  const diagLineOutro = spring({ frame: frame - (outroStartFrame + 10), fps, config: { stiffness: 60, damping: 15 } });
  const dotOutro = spring({ frame: frame - (outroStartFrame + 20), fps, config: { stiffness: 70, damping: 14 } });

  // -----------------------------------------------------------
  // INTERPOLATIONS
  // -----------------------------------------------------------
  const dotScale = frame >= outroStartFrame ? interpolate(dotOutro, [0, 1], [1, 0]) : interpolate(dotIntro, [0, 1], [0, 1]);
  const diagLineProgress = frame >= outroStartFrame ? interpolate(diagLineOutro, [0, 1], [1, 0]) : interpolate(diagLineIntro, [0, 1], [0, 1]);
  const boxesScaleX = frame >= outroStartFrame ? interpolate(boxesOutro, [0, 1], [1, 0]) : interpolate(boxesIntro, [0, 1], [0, 1]);

  // -----------------------------------------------------------
  // LAYOUT COORDINATES (Shorter Line Vector)
  // -----------------------------------------------------------
  // 1. The corner vertex where the diagonal line connects to the box
  const cornerX = 1100;
  const cornerY = 700;

  // 2. Vector pointer length decreased (changed from 100 to 60)
  const lineDeltaX = 60;
  const lineDeltaY = 60;

  const lineLength = Math.sqrt(lineDeltaX * lineDeltaX + lineDeltaY * lineDeltaY);
  const lineAngle = (Math.atan2(lineDeltaY, lineDeltaX) * 180) / Math.PI;

  // 3. Target Dot Position
  const dotX = cornerX + lineDeltaX;
  const dotY = cornerY + lineDeltaY;

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

      {/* STEP 2: Shorter Diagonal Pointer Line */}
      <div
        style={{
          position: 'absolute', left: cornerX, top: cornerY,
          width: lineLength, height: 2, backgroundColor: '#FFFFFF',
          transform: `rotate(${lineAngle}deg) scaleX(${diagLineProgress})`,
          transformOrigin: 'left center', zIndex: 3,
        }}
      />

      {/* STEP 3: Skewed Boxes Group */}
      <div
        style={{
          position: 'absolute',
          right: 1920 - cornerX,
          top: cornerY,
          transform: `translate(0, -100%) scaleX(${boxesScaleX})`,
          transformOrigin: 'right bottom',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
          zIndex: 2,
        }}
      >
        {/* Top Blue Badge (Skewed Parallelogram) */}
        <div
          style={{
            backgroundColor: '#0288D1',
            color: '#FFFFFF',
            padding: '4px 22px',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transform: 'skewX(-15deg)',
            marginRight: 50,
            marginBottom: -4,
            zIndex: 1,
          }}
        >
          {badgeText}
        </div>

        {/* Main White Box (Skewed Parallelogram) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '16px 50px',
            transform: 'skewX(-15deg)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: 2,
          }}
        >
          <span
            style={{
              color: '#0288D1',
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              display: 'block',
              transform: 'skewX(0deg)',
            }}
          >
            {headlineText}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};