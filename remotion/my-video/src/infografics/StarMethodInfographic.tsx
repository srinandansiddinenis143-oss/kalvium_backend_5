import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface StarColumnData {
  id: string;
  letter: string;
  title: string;
  description: string;
  heightPercent: number; // Height as percentage of screen bottom layout
  color: string;
}

const STAR_DATA: StarColumnData[] = [
  {
    id: 's',
    letter: 'S',
    title: 'Situation',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.',
    heightPercent: 72,
    color: '#38a3a5',
  },
  {
    id: 't',
    letter: 'T',
    title: 'Task',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.',
    heightPercent: 92,
    color: '#70e000',
  },
  {
    id: 'a',
    letter: 'A',
    title: 'Action',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.',
    heightPercent: 82,
    color: '#e9c46a',
  },
  {
    id: 'r',
    letter: 'R',
    title: 'Results',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.',
    heightPercent: 65,
    color: '#f4a261',
  },
];

export const StarMethodInfographic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Entrance spring for header text
  const headerProgress = spring({
    frame,
    fps,
    config: { damping: 20, mass: 1.8, stiffness: 60 },
  });

  const pillarAreaHeight = height * 0.72; // Allocate bottom 72% height for pillars
  const pillarWidth = width / 4 - 32; // Spread 4 columns across full screen width with small gaps
  const pointHeight = 70; // Height of pointed house top

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
      }}
    >
      {/* FULL-SCREEN CONTAINER */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 50,
          boxSizing: 'border-box',
        }}
      >
        {/* HEADER SECTION */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: 1100,
            opacity: headerProgress,
            transform: `translateY(${interpolate(headerProgress, [0, 1], [-40, 0])}px)`,
          }}
        >
          <h1
            style={{
              fontSize: 54,
              fontWeight: 900,
              color: '#1e293b',
              margin: '0 0 12px 0',
              letterSpacing: '1px',
            }}
          >
            STAR Method
          </h1>

          <p
            style={{
              fontSize: 20,
              color: '#64748b',
              margin: 0,
              lineHeight: 1.4,
              fontWeight: 600,
            }}
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
          </p>

          {/* Multi-color Divider Bar */}
          <div
            style={{
              display: 'flex',
              height: 6,
              width: 360,
              margin: '20px auto 0 auto',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            {STAR_DATA.map((col) => (
              <div
                key={`accent-${col.id}`}
                style={{ flex: 1, backgroundColor: col.color }}
              />
            ))}
          </div>
        </div>

        {/* FULL-WIDTH BOTTOM PILLARS */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 20,
            width: '100%',
            height: pillarAreaHeight,
            padding: '0 40px',
            boxSizing: 'border-box',
          }}
        >
          {STAR_DATA.map((col, index) => {
            const colDelay = index * 20 + 8;
            const rawProgress = spring({
              frame: frame - colDelay,
              fps,
              config: { damping: 28, mass: 3.5, stiffness: 22 },
            });

            const easedProgress = interpolate(rawProgress, [0, 1], [0, 1], {
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            // Slide Up from below screen
            const translateY = interpolate(easedProgress, [0, 1], [600, 0]);
            const opacity = interpolate(easedProgress, [0, 0.15, 1], [0, 1, 1]);

            // Pillar height relative to bottom area
            const h = (col.heightPercent / 100) * pillarAreaHeight;
            const w = pillarWidth;

            // Pointed top house path
            const housePath = [
              `M 0 ${pointHeight}`,
              `L ${w / 2} 0`,
              `L ${w} ${pointHeight}`,
              `L ${w} ${h}`,
              `L 0 ${h}`,
              'Z',
            ].join(' ');

            return (
              <div
                key={col.id}
                style={{
                  position: 'relative',
                  width: w,
                  height: h,
                  transform: `translateY(${translateY}px)`,
                  opacity,
                  flexShrink: 0,
                }}
              >
                {/* SVG Pillar Body with Crisp White Outline */}
                <svg
                  width={w}
                  height={h}
                  viewBox={`0 0 ${w} ${h}`}
                  style={{ overflow: 'visible', display: 'block' }}
                >
                  <path
                    d={housePath}
                    fill={col.color}
                    stroke="#ffffff"
                    strokeWidth="6"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>

                {/* CONTENT OVERLAY */}
                <div
                  style={{
                    position: 'absolute',
                    top: pointHeight + 15,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0 20px 24px 20px',
                    textAlign: 'center',
                    color: '#ffffff',
                  }}
                >
                  {/* LARGER WHITE CIRCLE BADGE */}
                  <div
                    style={{
                      width: 115,
                      height: 115,
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                      marginBottom: 16,
                      transform: `scale(${easedProgress})`,
                      border: '4px solid rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 56,
                        fontWeight: 900,
                        color: col.color,
                        lineHeight: 1,
                      }}
                    >
                      {col.letter}
                    </span>
                  </div>

                  {/* LARGER PILLAR TITLE */}
                  <span
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      letterSpacing: '0.8px',
                      marginBottom: 10,
                      textShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    }}
                  >
                    {col.title}
                  </span>

                  {/* UNDERLINE DIVIDER */}
                  <div
                    style={{
                      width: 50,
                      height: 4,
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      borderRadius: 2,
                      marginBottom: 16,
                    }}
                  />

                  {/* LARGER DESCRIPTION SUBTEXT */}
                  <p
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      lineHeight: 1.5,
                      margin: 0,
                      opacity: 0.98,
                    }}
                  >
                    {col.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default StarMethodInfographic;