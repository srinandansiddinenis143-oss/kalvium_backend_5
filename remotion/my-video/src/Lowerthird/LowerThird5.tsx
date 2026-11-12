import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  topText?: string;
  bottomText?: string;
}

export const LowerThird5: React.FC<Props> = ({
  topText = 'JANE',
  bottomText = 'PUBLIC',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // INTRO ANIMATIONS (Both sliding in from the left)
  // -----------------------------------------------------------
  const topIntro = spring({
    frame,
    fps,
    config: { stiffness: 35, damping: 20 },
  });

  const bottomIntro = spring({
    frame: frame - 4, // Staggered delay for the bottom block
    fps,
    config: { stiffness: 35, damping: 20 },
  });

  // -----------------------------------------------------------
  // OUTRO ANIMATIONS (Both sliding out to the left)
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 30;

  const topOutro = spring({
    frame: frame - outroStartFrame,
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  const bottomOutro = spring({
    frame: frame - (outroStartFrame + 3),
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  // -----------------------------------------------------------
  // INTERPOLATED POSITIONS (Left -> Screen -> Left)
  // -----------------------------------------------------------
  // Top Dark Grey Block
  const topXIntro = interpolate(topIntro, [0, 1], [-700, 0]);
  const topXOutro = interpolate(topOutro, [0, 1], [0, -700]);
  const topTranslateX = frame >= outroStartFrame ? topXOutro : topXIntro;

  // Bottom Cyan Block
  const bottomXIntro = interpolate(bottomIntro, [0, 1], [-700, 0]);
  const bottomXOutro = interpolate(bottomOutro, [0, 1], [0, -700]);
  const bottomTranslateX =
    frame >= outroStartFrame ? bottomXOutro : bottomXIntro;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        fontFamily: 'Montserrat, Arial Black, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {/* Top Dark Grey Block (Slides from Left) */}
        <div
          style={{
            transform: `translateX(${topTranslateX}px)`,
            backgroundColor: '#1E1E1E',
            padding: '12px 32px',
            borderRadius: '4px 4px 0 0',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            zIndex: 2,
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {topText}
          </span>
        </div>

        {/* Bottom Solid Cyan Block (Slides from Left) */}
        <div
          style={{
            transform: `translateX(${bottomTranslateX}px)`,
            backgroundColor: '#00ACC1',
            padding: '12px 32px',
            borderRadius: '0 0 4px 4px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            marginTop: 0,
            zIndex: 1,
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 40,
              fontWeight: 900,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {bottomText}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};