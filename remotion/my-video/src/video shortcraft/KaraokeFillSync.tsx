import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from 'remotion';

// Word-level timeline intervals [startFrame, endFrame]
const WORDS = [
  { text: 'FRAME', start: 20, end: 38 },
  { text: 'MOTION', start: 42, end: 75 },
  { text: 'CRAFT', start: 85, end: 103 },
  { text: 'SHOTS', start: 107, end: 130 },
];

export const KaraokeFillSync: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#fbfbfd',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Slogan Container (Two lines of guided reading) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '32px' }}>
          {WORDS.slice(0, 2).map((word, idx) => {
            const progress = interpolate(
              frame,
              [word.start, word.end],
              [0, 100],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            const isReading = frame >= word.start && frame <= word.end + 6;

            return (
              <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                {/* Background Dim Text (13% transparent ink) */}
                <span
                  style={{
                    fontSize: '64px',
                    fontWeight: 800,
                    color: 'rgba(21, 23, 29, 0.15)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {word.text}
                </span>

                {/* Foreground Filled Active Text (Masked Reveal) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                    width: `${progress}%`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '64px',
                      fontWeight: 800,
                      color: '#7c3aed', // Accent emphasis color
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {word.text}
                  </span>
                </div>

                {/* Reading Guide Underline */}
                {isReading && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      height: '8px',
                      width: `${progress}%`,
                      backgroundColor: '#7c3aed',
                      borderRadius: '4px',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {WORDS.slice(2, 4).map((word, idx) => {
            const progress = interpolate(
              frame,
              [word.start, word.end],
              [0, 100],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            const isReading = frame >= word.start && frame <= word.end + 6;

            return (
              <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                <span
                  style={{
                    fontSize: '64px',
                    fontWeight: 800,
                    color: 'rgba(21, 23, 29, 0.15)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {word.text}
                </span>

                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                    width: `${progress}%`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '64px',
                      fontWeight: 800,
                      color: '#7c3aed',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {word.text}
                  </span>
                </div>

                {isReading && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      height: '8px',
                      width: `${progress}%`,
                      backgroundColor: '#7c3aed',
                      borderRadius: '4px',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Narration Waveform Visualizer at Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '64px',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: 48 }).map((_, i) => {
          const barHeight = Math.sin(i * 0.5 + frame * 0.1) * 20 + 24;
          const isPlayed = i < (frame / 150) * 48;

          return (
            <div
              key={i}
              style={{
                width: '4px',
                height: `${barHeight}px`,
                backgroundColor: isPlayed ? '#7c3aed' : '#d1d5db',
                borderRadius: '2px',
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};