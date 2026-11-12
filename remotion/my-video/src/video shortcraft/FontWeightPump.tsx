import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from 'remotion';

// 128 BPM beat hit frames (14f per beat interval)
const BEAT_FRAMES = [16, 30, 44, 58, 72, 86, 100, 114, 128];
const DROP_FRAME = 128;

export const FontWeightPump: React.FC = () => {
  const frame = useCurrentFrame();

  // Calculate nearest active beat envelope
  let currentEnv = 0;
  let activeBeatIndex = -1;

  BEAT_FRAMES.forEach((beatFrame, idx) => {
    if (frame >= beatFrame && frame < beatFrame + 14) {
      const t = frame - beatFrame;
      // env = (1 - t / D)^0.8 over 13-14 frames decay
      currentEnv = Math.max(currentEnv, Math.pow(1 - t / 13, 0.8));
      activeBeatIndex = idx;
    }
  });

  // Special DROP handling at frame 128
  const isDrop = frame >= DROP_FRAME;
  const fontWeight = isDrop
    ? 900
    : Math.round(interpolate(currentEnv, [0, 1], [250, 900], { extrapolateRight: 'clamp' }));

  const scaleX = activeBeatIndex === 0 && !isDrop ? 1 + 0.06 * currentEnv : 1;
  const isDropPink = isDrop ? '#ff85c0' : '#f2f5ff';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07080c',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Echo Lines (Appearing from 2nd measure onwards) */}
      {frame > 72 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '38%',
              fontSize: '84px',
              fontWeight: 900,
              color: 'rgba(255,133,192,0.15)',
              transform: `translateY(-60px) scaleX(${scaleX})`,
              letterSpacing: '0.05em',
              pointerEvents: 'none',
            }}
          >
            RHYTHM PULSE
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '38%',
              fontSize: '84px',
              fontWeight: 900,
              color: 'rgba(134,168,255,0.15)',
              transform: `translateY(60px) scaleX(${scaleX})`,
              letterSpacing: '0.05em',
              pointerEvents: 'none',
            }}
          >
            RHYTHM PULSE
          </div>
        </>
      )}

      {/* Main Rhythmic Title Slot (Fixed slot width layout) */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scaleX(${scaleX})`,
          transition: 'transform 0.05s linear',
        }}
      >
        <div
          style={{
            fontSize: '96px',
            fontWeight,
            color: isDropPink,
            letterSpacing: '-0.02em',
            textShadow: isDrop ? '0 0 40px rgba(255,133,192,0.6)' : '0 0 20px rgba(255,255,255,0.2)',
          }}
        >
          DISCO BEAT
        </div>
      </div>

      {/* 8+1 Step Sequencer Bars at Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '64px',
          display: 'flex',
          gap: '12px',
        }}
      >
        {BEAT_FRAMES.map((beatFrame, idx) => {
          const isActive = frame >= beatFrame && frame < beatFrame + 14;
          const isPassed = frame >= beatFrame + 14;
          const isDropBar = idx === BEAT_FRAMES.length - 1;

          return (
            <div
              key={idx}
              style={{
                width: isDropBar ? '48px' : '32px',
                height: isActive ? '36px' : isPassed ? '16px' : '24px',
                backgroundColor: isActive
                  ? '#ff85c0'
                  : isPassed
                  ? '#27272a'
                  : '#52525b',
                borderRadius: '4px',
                transform: isActive ? 'scaleY(1.12)' : 'scaleY(1)',
                boxShadow: isActive ? '0 0 16px rgba(255,133,192,0.8)' : 'none',
                transition: 'all 0.1s ease',
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};