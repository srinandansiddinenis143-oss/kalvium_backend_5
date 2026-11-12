import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  numberText?: string;
  descriptionText?: string;
}

export const Callout5: React.FC<Props> = ({
  numberText = '05',
  descriptionText = 'It is important to create comfortable conditions in the workplaces of office staff.',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // TIMING: Sequential 4-Step Intro (Dot -> Diag Line -> Vert Stem -> Content)
  // -----------------------------------------------------------
  const dotIntro = spring({ frame, fps, config: { stiffness: 70, damping: 14 } });
  const diagLineIntro = spring({ frame: frame - 10, fps, config: { stiffness: 60, damping: 15 } });
  const vertLineIntro = spring({ frame: frame - 20, fps, config: { stiffness: 60, damping: 15 } });
  const contentIntro = spring({ frame: frame - 30, fps, config: { stiffness: 60, damping: 15 } });

  // -----------------------------------------------------------
  // TIMING: Sequential 4-Step Outro (Reverse)
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 50;
  const contentOutro = spring({ frame: frame - outroStartFrame, fps, config: { stiffness: 60, damping: 15 } });
  const vertLineOutro = spring({ frame: frame - (outroStartFrame + 8), fps, config: { stiffness: 60, damping: 15 } });
  const diagLineOutro = spring({ frame: frame - (outroStartFrame + 16), fps, config: { stiffness: 60, damping: 15 } });
  const dotOutro = spring({ frame: frame - (outroStartFrame + 24), fps, config: { stiffness: 70, damping: 14 } });

  // -----------------------------------------------------------
  // INTERPOLATIONS
  // -----------------------------------------------------------
  const dotScale = frame >= outroStartFrame ? interpolate(dotOutro, [0, 1], [1, 0]) : interpolate(dotIntro, [0, 1], [0, 1]);
  const diagLineProgress = frame >= outroStartFrame ? interpolate(diagLineOutro, [0, 1], [1, 0]) : interpolate(diagLineIntro, [0, 1], [0, 1]);
  const vertLineProgress = frame >= outroStartFrame ? interpolate(vertLineOutro, [0, 1], [1, 0]) : interpolate(vertLineIntro, [0, 1], [0, 1]);
  const contentOpacity = frame >= outroStartFrame ? interpolate(contentOutro, [0, 1], [1, 0]) : interpolate(contentIntro, [0, 1], [0, 1]);

  // -----------------------------------------------------------
  // LAYOUT COORDINATES (Mirrored Left-to-Right Flow)
  // -----------------------------------------------------------
  // 1. Base corner where the vertical stem meets the diagonal line
  const cornerX = 400;
  const cornerY = 400;

  // 2. Target Dot Position (Shifted Up and Right from corner)
  const dotX = cornerX + 220;
  const dotY = cornerY - 140;

  // 3. Diagonal Line Vector (Connecting Dot back down-left to corner)
  const lineDeltaX = cornerX - dotX;
  const lineDeltaY = cornerY - dotY;

  const lineLength = Math.sqrt(lineDeltaX * lineDeltaX + lineDeltaY * lineDeltaY);
  const lineAngle = (Math.atan2(lineDeltaY, lineDeltaX) * 180) / Math.PI;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      
      {/* 1. Target Circle Node */}
      <div
        style={{
          position: 'absolute', left: dotX, top: dotY,
          width: 16, height: 16, borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          transform: `translate(-50%, -50%) scale(${dotScale})`,
          transformOrigin: 'center center',
          zIndex: 4, boxShadow: '0 0 10px rgba(255, 255, 255, 0.6)',
        }}
      />

      {/* 2. Diagonal Line */}
      <div
        style={{
          position: 'absolute', left: dotX, top: dotY,
          width: lineLength, height: 2, backgroundColor: '#FFFFFF',
          transform: `rotate(${lineAngle}deg) scaleX(${diagLineProgress})`,
          transformOrigin: 'left center', zIndex: 3,
        }}
      />

      {/* 3. Vertical Stem Line (Going Straight Down from Corner) */}
      <div
        style={{
          position: 'absolute',
          left: cornerX,
          top: cornerY,
          width: 2,
          height: 80,
          backgroundColor: '#FFFFFF',
          transform: `scaleY(${vertLineProgress})`,
          transformOrigin: 'top center',
          zIndex: 3,
        }}
      />

      {/* 4. Number & Description Block */}
      <div
        style={{
          position: 'absolute',
          left: cornerX + 20,
          top: cornerY + 10,
          opacity: contentOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          zIndex: 2,
        }}
      >
        {/* Large Number */}
        <span
          style={{
            color: '#FFFFFF',
            fontSize: 72,
            fontWeight: 400,
            letterSpacing: '2px',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {numberText}
        </span>

        {/* Description Paragraph */}
        <p
          style={{
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1.4,
            maxWidth: 320,
            margin: 0,
          }}
        >
          {descriptionText}
        </p>
      </div>
    </AbsoluteFill>
  );
};