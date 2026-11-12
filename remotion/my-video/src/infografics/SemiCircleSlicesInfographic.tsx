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
// 1. POSITION & DIMENSION CONTROLS
// =========================================================================
const VIEW_WIDTH = 1100;
const VIEW_HEIGHT = 800;
const RADIUS = 380;           // Outer radius of the fan slices
const INNER_RADIUS = 120;     // Inner cutoff for the center badge overlap

interface SliceData {
  id: string;
  emoji: string;
  title: string;
  color: string;
  shadowColor: string;
}

const SLICES: SliceData[] = [
  {
    id: 'slice1',
    emoji: '📢',
    title: 'TARGET AUDIENCE',
    color: '#ff9800',
    shadowColor: '#e65100',
  },
  {
    id: 'slice2',
    emoji: '💰',
    title: 'INCREASE SALE',
    color: '#7cb342',
    shadowColor: '#33691e',
  },
  {
    id: 'slice3',
    emoji: '💡',
    title: 'GENERATE NEW IDEA',
    color: '#1e88e5',
    shadowColor: '#0d47a1',
  },
  {
    id: 'slice4',
    emoji: '💬',
    title: 'BUILD COMMUNICATION',
    color: '#e91e63',
    shadowColor: '#880e4f',
  },
  {
    id: 'slice5',
    emoji: '📄',
    title: 'DATA MANAGEMENT',
    color: '#00acc1',
    shadowColor: '#006064',
  },
];

// Helper to construct pie wedge SVG path
const createWedgePath = (
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngleDeg: number,
  endAngleDeg: number
) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  const a1 = toRad(startAngleDeg);
  const a2 = toRad(endAngleDeg);

  const x1Outer = cx + rOuter * Math.cos(a1);
  const y1Outer = cy + rOuter * Math.sin(a1);
  const x2Outer = cx + rOuter * Math.cos(a2);
  const y2Outer = cy + rOuter * Math.sin(a2);

  const x1Inner = cx + rInner * Math.cos(a1);
  const y1Inner = cy + rInner * Math.sin(a1);
  const x2Inner = cx + rInner * Math.cos(a2);
  const y2Inner = cy + rInner * Math.sin(a2);

  return [
    `M ${x1Inner} ${y1Inner}`,
    `L ${x1Outer} ${y1Outer}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${x2Outer} ${y2Outer}`,
    `L ${x2Inner} ${y2Inner}`,
    `A ${rInner} ${rInner} 0 0 0 ${x1Inner} ${y1Inner}`,
    'Z',
  ].join(' ');
};

export const SemiCircleSlicesInfographic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale entrance spring for the overall layout
  const containerProgress = spring({
    frame,
    fps,
    config: { damping: 20, mass: 2.0, stiffness: 60 },
  });

  const totalSlices = SLICES.length;
  const sliceAngle = 180 / totalSlices; // 36 degrees per wedge
  const cx = 260; // Center pivot X
  const cy = 400; // Center pivot Y

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f1f5f9',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Centered Infographic Viewport */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${containerProgress})`,
          width: VIEW_WIDTH,
          height: VIEW_HEIGHT,
        }}
      >
        {/* SLICES LAYER */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
          <svg
            width={VIEW_WIDTH}
            height={VIEW_HEIGHT}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            style={{ overflow: 'visible' }}
          >
            {SLICES.map((slice, index) => {
              const startDeg = -90 + index * sliceAngle;
              const endDeg = startDeg + sliceAngle;
              const midDeg = startDeg + sliceAngle / 2;
              const midRad = (midDeg * Math.PI) / 180;

              // Top-to-Bottom Sequential Drop & Flip Delay
              const sliceDelay = index * 24 + 10;
              const rawProgress = spring({
                frame: frame - sliceDelay,
                fps,
                config: { damping: 26, mass: 3.2, stiffness: 24 },
              });

              const easedProgress = interpolate(rawProgress, [0, 1], [0, 1], {
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              // Direct Vertical Drop from Top
              const translateY = interpolate(easedProgress, [0, 1], [-200, 0]);
              
              // 3D Flip Reveal Angle
              const flipRotate = interpolate(easedProgress, [0, 1], [-75, 0]);
              const opacity = interpolate(easedProgress, [0, 0.15, 1], [0, 1, 1]);

              const path = createWedgePath(cx, cy, INNER_RADIUS, RADIUS, startDeg, endDeg);

              // Position for Content inside the Wedge
              const contentRadius = (INNER_RADIUS + RADIUS) / 2 + 15;
              const contentX = cx + contentRadius * Math.cos(midRad);
              const contentY = cy + contentRadius * Math.sin(midRad);

              return (
                <g
                  key={slice.id}
                  style={{
                    transform: `translateY(${translateY}px) rotateX(${flipRotate}deg)`,
                    transformOrigin: `${cx}px ${cy}px`,
                    opacity,
                  }}
                >
                  {/* 3D Drop Shadow */}
                  <path
                    d={path}
                    fill={slice.shadowColor}
                    transform="translate(0, 8)"
                    opacity="0.45"
                  />

                  {/* Main Colored Slice Body */}
                  <path
                    d={path}
                    fill={slice.color}
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />

                  {/* PROMINENT LARGE TEXT & EMOJI OVERLAY */}
                  <foreignObject
                    x={contentX - 110}
                    y={contentY - 50}
                    width={220}
                    height={100}
                    style={{ overflow: 'visible', pointerEvents: 'none' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: '#ffffff',
                        height: '100%',
                        padding: '0 8px',
                      }}
                    >
                      {/* Large Emoji Icon */}
                      <span style={{ fontSize: 42, lineHeight: 1, marginBottom: 8 }}>
                        {slice.emoji}
                      </span>

                      {/* Large Bold Header Title */}
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 900,
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          textShadow: '0 2px 5px rgba(0,0,0,0.35)',
                          lineHeight: 1.25,
                        }}
                      >
                        {slice.title}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>

        {/* STATIONARY CENTER BADGE */}
        <div
          style={{
            position: 'absolute',
            left: cx,
            top: cy,
            transform: 'translate(-50%, -50%)',
            width: 250,
            height: 250,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '16px solid #80cbc4',
            boxShadow: '0 16px 36px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            textAlign: 'center',
            padding: 16,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '1px',
              lineHeight: 1.1,
            }}
          >
            CREATIVE
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#64748b',
              letterSpacing: '1px',
              marginTop: 2,
            }}
          >
            INFOGRAPHIC
          </span>

          {/* Color Dots Row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {SLICES.map((s) => (
              <div
                key={`dot-${s.id}`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: s.color,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default SemiCircleSlicesInfographic;