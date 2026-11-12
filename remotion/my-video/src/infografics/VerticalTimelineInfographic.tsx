import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// =========================================================================
// 1. POSITION & CONTENT CONTROLS
// =========================================================================
const CONTAINER_WIDTH = 900;
const CONTAINER_TOP = '50%';
const CONTAINER_LEFT = '50%';

interface TimelineItem {
  id: string;
  emoji: string;
  badgeLabel: string;
  title: string;
  textBefore: string;
  highlightText: string;
  textAfter: string;
  color: string;
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    id: 'step1',
    emoji: '💡',
    badgeLabel: 'IDEA GENERATION',
    title: 'CONCEPT & PLANNING',
    textBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam ',
    highlightText: 'nonummy nibh euismod',
    textAfter: ' tincidunt ut laoreet dolore magna aliquam erat volutpat.',
    color: '#ff981f',
  },
  {
    id: 'step2',
    emoji: '⚙️',
    badgeLabel: 'DEVELOPMENT',
    title: 'EXECUTION & SETUP',
    textBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet ',
    highlightText: 'dolore magna aliquam erat',
    textAfter: ' volutpat. Ut wisi enim ad minim.',
    color: '#ff5722',
  },
  {
    id: 'step3',
    emoji: '👥',
    badgeLabel: 'TEAM WORK',
    title: 'COLLABORATION',
    textBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet ',
    highlightText: 'magna aliquam erat volutpat',
    textAfter: ' ut wisi enim ad minim veniam.',
    color: '#d32f2f',
  },
  {
    id: 'step4',
    emoji: '📊',
    badgeLabel: 'ANALYTICS',
    title: 'DATA MONITORING',
    textBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ',
    highlightText: 'sed diam nonummy nibh',
    textAfter: ' euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
    color: '#c2185b',
  },

  {
    id: 'step6',
    emoji: '🚀',
    badgeLabel: 'LAUNCH',
    title: 'PRODUCT RELEASE',
    textBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ',
    highlightText: 'ready for public launch',
    textAfter: ' ut wisi enim ad minim veniam.',
    color: '#3f51b5',
  },
];

export const VerticalTimelineInfographic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Component entrance spring
  const containerProgress = spring({
    frame,
    fps,
    config: { damping: 20, mass: 2.0, stiffness: 60 },
  });

  // ULTRA-SLOW ARROW LINE ANIMATION: Heavy mass (8.0), High Damping (48), Low Stiffness (12)
  const rawLineProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 48, mass: 8.0, stiffness: 12 },
  });

  const lineProgress = interpolate(rawLineProgress, [0, 1], [0, 1], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Centered Timeline Wrapper */}
      <div
        style={{
          position: 'absolute',
          top: CONTAINER_TOP,
          left: CONTAINER_LEFT,
          transform: `translate(-50%, -50%) scale(${containerProgress})`,
          width: CONTAINER_WIDTH,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '40px 0 80px 0',
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          
          {/* ULTRA-SLOW DYNAMIC ARROW LINE & TIP */}
          <div
            style={{
              position: 'absolute',
              left: 70, // Centered behind 140px circles
              top: 70,  // Starts at center of first circle
              bottom: -60, // Extends 60px past center of last circle
              width: 34,
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
          >
            {/* Outer Track Container */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: `${lineProgress * 100}%`,
                overflow: 'visible',
              }}
            >
              {/* Colored Segments Stack */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: '4px 4px 0 0',
                }}
              >
                {TIMELINE_DATA.map((item) => (
                  <div
                    key={`segment-${item.id}`}
                    style={{
                      flex: 1,
                      backgroundColor: item.color,
                    }}
                  />
                ))}
              </div>

              {/* DYNAMIC ARROW HEAD AT LEADING TIP */}
              {lineProgress > 0.01 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -22,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '22px solid transparent',
                    borderRight: '22px solid transparent',
                    borderTop: `22px solid ${
                      TIMELINE_DATA[
                        Math.min(
                          Math.floor(lineProgress * TIMELINE_DATA.length),
                          TIMELINE_DATA.length - 1
                        )
                      ].color
                    }`,
                    zIndex: 2,
                  }}
                />
              )}
            </div>
          </div>

          {/* TIMELINE ROWS (STAGGERED SLOW DROPS) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40, position: 'relative', zIndex: 2 }}>
            {TIMELINE_DATA.map((item, index) => {
              // Increased delay gap to 40 frames to sync with ultra-slow arrow movement
              const dropDelay = index * 40 + 15;
              const textDelay = dropDelay + 12;

              // 1. Circle Drop Spring
              const dropSpring = spring({
                frame: frame - dropDelay,
                fps,
                config: { damping: 24, mass: 2.2, stiffness: 50 },
              });

              const translateY = interpolate(dropSpring, [0, 1], [-90, 0]);

              // 2. Text Reveal Spring
              const textSpring = spring({
                frame: frame - textDelay,
                fps,
                config: { damping: 22, mass: 1.8, stiffness: 55 },
              });

              const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);
              const textTranslateX = interpolate(textSpring, [0, 1], [30, 0]);

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 36,
                  }}
                >
                  {/* CIRCULAR EMOJI BADGE */}
                  <div
                    style={{
                      transform: `translateY(${translateY}px) scale(${dropSpring})`,
                      opacity: dropSpring,
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <span style={{ fontSize: 44, lineHeight: 1 }}>
                      {item.emoji}
                    </span>

                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        color: '#475569',
                        marginTop: 6,
                        textAlign: 'center',
                        letterSpacing: '0.5px',
                        padding: '0 6px',
                      }}
                    >
                      {item.badgeLabel}
                    </span>
                  </div>

                  {/* SIDE TEXT CONTENT */}
                  <div
                    style={{
                      transform: `translateX(${textTranslateX}px)`,
                      opacity: textOpacity,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      flex: 1,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 22,
                        fontWeight: 900,
                        color: '#0f172a',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        lineHeight: 1.5,
                        color: '#475569',
                        fontWeight: 500,
                      }}
                    >
                      {item.textBefore}
                      <span
                        style={{
                          backgroundColor: item.color,
                          color: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontWeight: 700,
                        }}
                      >
                        {item.highlightText}
                      </span>
                      {item.textAfter}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default VerticalTimelineInfographic;