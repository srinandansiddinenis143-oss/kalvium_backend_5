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
// 1. POSITION & LAYOUT CONTROLS
// =========================================================================
const VIEW_SIZE = 1050;
const RADIUS = 310;          // Distance from center to nodes
const NODE_SIZE = 220;       // Diameter of each circular step node

interface ProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  emoji: string;
  color: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'step1',
    stepNumber: '01',
    title: 'TEAMWORK',
    emoji: '👥',
    color: '#ffc107',
  },
  {
    id: 'step2',
    stepNumber: '02',
    title: 'PLANNING',
    emoji: '📋',
    color: '#00e5ff',
  },
  {
    id: 'step3',
    stepNumber: '03',
    title: 'MANAGEMENT',
    emoji: '⚙️',
    color: '#2979ff',
  },
  {
    id: 'step4',
    stepNumber: '04',
    title: 'PROMOTION',
    emoji: '👍',
    color: '#aa00ff',
  },
  {
    id: 'step5',
    stepNumber: '05',
    title: 'PRODUCTS',
    emoji: '📦',
    color: '#f50057',
  },
  {
    id: 'step6',
    stepNumber: '06',
    title: 'STRATEGY',
    emoji: '🌐',
    color: '#ff3d00',
  },
];

export const CircularProcessInfographic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for overall container
  const containerProgress = spring({
    frame,
    fps,
    config: { damping: 20, mass: 2.0, stiffness: 60 },
  });

  const center = VIEW_SIZE / 2;
  const totalSteps = PROCESS_STEPS.length;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Centered Graphic Container */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${containerProgress})`,
          width: VIEW_SIZE,
          height: VIEW_SIZE,
        }}
      >
        {/* CONNECTING ARROWS SVG LAYER */}
        <svg
          width={VIEW_SIZE}
          height={VIEW_SIZE}
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          <defs>
            {PROCESS_STEPS.map((step) => (
              <marker
                key={`arrowhead-${step.id}`}
                id={`arrowhead-${step.id}`}
                markerWidth="8"
                markerHeight="8"
                refX="5"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill={step.color} />
              </marker>
            ))}
          </defs>

          {PROCESS_STEPS.map((step, index) => {
            const startAngleDeg = (index / totalSteps) * 360 - 90;
            const nextAngleDeg = ((index + 1) / totalSteps) * 360 - 90;

            const gapDeg = 24;
            const a1Rad = ((startAngleDeg + gapDeg) * Math.PI) / 180;
            const a2Rad = ((nextAngleDeg - gapDeg) * Math.PI) / 180;

            const x1 = center + RADIUS * Math.cos(a1Rad);
            const y1 = center + RADIUS * Math.sin(a1Rad);
            const x2 = center + RADIUS * Math.cos(a2Rad);
            const y2 = center + RADIUS * Math.sin(a2Rad);

            // TIMING: Arrow starts after node lands, drawing slowly with heavy physics
            const nodeDelay = index * 32 + 10;
            const arrowDelay = nodeDelay + 14;

            const rawArrowSpring = spring({
              frame: frame - arrowDelay,
              fps,
              config: { damping: 30, mass: 3.2, stiffness: 22 },
            });

            const arrowProgress = interpolate(rawArrowSpring, [0, 1], [0, 1], {
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            // Smooth opacity fade-in to prevent sudden visual pops
            const arrowOpacity = interpolate(arrowProgress, [0, 0.2, 1], [0, 1, 1]);

            const pathD = `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2}`;

            return (
              <g key={`arc-group-${step.id}`} style={{ opacity: arrowOpacity }}>
                {arrowProgress > 0.001 && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={step.color}
                    strokeWidth="5"
                    strokeDasharray="450"
                    strokeDashoffset={450 * (1 - arrowProgress)}
                    markerEnd={`url(#arrowhead-${step.id})`}
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* 6 CIRCULAR NODES LAYER */}
        {PROCESS_STEPS.map((step, index) => {
          const angleDeg = (index / totalSteps) * 360 - 90;
          const angleRad = (angleDeg * Math.PI) / 180;

          const cx = center + RADIUS * Math.cos(angleRad);
          const cy = center + RADIUS * Math.sin(angleRad);

          // Staggered node entrance with 32-frame spacing for readable pacing
          const nodeDelay = index * 32 + 10;
          const rawProgress = spring({
            frame: frame - nodeDelay,
            fps,
            config: { damping: 22, mass: 2.0, stiffness: 55 },
          });

          const easedProgress = interpolate(rawProgress, [0, 1], [0, 1], {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={step.id}
              style={{
                position: 'absolute',
                left: cx,
                top: cy,
                transform: `translate(-50%, -50%) scale(${easedProgress})`,
                opacity: easedProgress,
                width: NODE_SIZE,
                height: NODE_SIZE,
                borderRadius: '50%',
                backgroundColor: step.color,
                boxShadow: `0 14px 32px ${step.color}55`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                overflow: 'hidden',
                border: '5px solid #ffffff',
              }}
            >
              {/* MAIN NODE BODY */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 12,
                  flex: 1,
                }}
              >
                {/* LARGE EMOJI */}
                <span style={{ fontSize: 44, lineHeight: 1, marginBottom: 6 }}>
                  {step.emoji}
                </span>

                {/* LARGE BOLD TITLE */}
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    textShadow: '0 2px 4px rgba(0,0,0,0.25)',
                    lineHeight: 1.1,
                  }}
                >
                  {step.title}
                </span>
              </div>

              {/* BOTTOM INNER CURVED BADGE */}
              <div
                style={{
                  width: '100%',
                  height: 54,
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopLeftRadius: '50% 16px',
                  borderTopRightRadius: '50% 16px',
                }}
              >
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: step.color,
                    letterSpacing: '1px',
                  }}
                >
                  {step.stepNumber}
                </span>
              </div>
            </div>
          );
        })}

        {/* STATIONARY CENTER BADGE */}
        <div
          style={{
            position: 'absolute',
            top: center,
            left: center,
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '2px',
              lineHeight: 1,
            }}
          >
            SIMPLE
          </span>
          <span
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '2px',
              marginTop: 6,
            }}
          >
            INFOGRAPHIC
          </span>

          {/* Color Accent Squares Row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {PROCESS_STEPS.map((s) => (
              <div
                key={`center-dot-${s.id}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
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

export default CircularProcessInfographic;