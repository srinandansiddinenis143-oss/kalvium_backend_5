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
// 1. DATA CONTROLS
// =========================================================================
interface CardData {
  id: string;
  stepNumber: string;
  emoji: string;
  title: string;
  description: string;
  color: string;
}

const CARDS: CardData[] = [
  {
    id: 'card1',
    stepNumber: '01',
    emoji: '💡',
    title: 'IDEA',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.',
    color: '#00a8cc',
  },
  {
    id: 'card2',
    stepNumber: '02',
    emoji: '🔍',
    title: 'RESEARCH',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.',
    color: '#005691',
  },
  {
    id: 'card3',
    stepNumber: '03',
    emoji: '📊',
    title: 'PLANNING',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.',
    color: '#4cd137',
  },
  {
    id: 'card4',
    stepNumber: '04',
    emoji: '📈',
    title: 'GROWTH',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.',
    color: '#009432',
  },
];

export const AlternatingCardsInfographic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f1f5f9',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* FULL-SCREEN CARDS CONTAINER */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          width: '100%',
          height: '100%',
          padding: '40px 60px',
          boxSizing: 'border-box',
        }}
      >
        {CARDS.map((card, index) => {
          // Staggered spring delay
          const cardDelay = index * 22 + 8;
          const rawProgress = spring({
            frame: frame - cardDelay,
            fps,
            config: { damping: 28, mass: 3.2, stiffness: 24 },
          });

          const easedProgress = interpolate(rawProgress, [0, 1], [0, 1], {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          // ALTERNATING DIRECTIONS:
          // Index 0 (1st): Top -> Down (-400px)
          // Index 1 (2nd): Bottom -> Up (+400px)
          // Index 2 (3rd): Top -> Down (-400px)
          // Index 3 (4th): Bottom -> Up (+400px)
          const isTopToBottom = index % 2 === 0;
          const initialY = isTopToBottom ? -500 : 500;

          const translateY = interpolate(easedProgress, [0, 1], [initialY, 0]);
          const opacity = interpolate(easedProgress, [0, 0.2, 1], [0, 1, 1]);

          return (
            <div
              key={card.id}
              style={{
                position: 'relative',
                flex: 1,
                maxWidth: 380,
                height: 540,
                transform: `translateY(${translateY}px)`,
                opacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* OUTER COLOR PILL / RING OVERLAY */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '78%',
                  borderRadius: 180,
                  backgroundColor: card.color,
                  boxShadow: `0 16px 36px ${card.color}44`,
                  zIndex: 1,
                }}
              />

              {/* TOP CIRCULAR EMOJI BADGE */}
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                  zIndex: 3,
                  border: `4px solid ${card.color}`,
                }}
              >
                <span style={{ fontSize: 52, lineHeight: 1 }}>
                  {card.emoji}
                </span>
              </div>

              {/* MAIN WHITE CARD BODY */}
              <div
                style={{
                  position: 'absolute',
                  top: 76,
                  bottom: 46,
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: 28,
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.08)',
                  padding: '80px 28px 40px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  zIndex: 2,
                }}
              >
                {/* LARGE CARD TITLE */}
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: '#0f172a',
                    letterSpacing: '1px',
                    marginBottom: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  {card.title}
                </span>

                {/* ACCENT UNDERLINE */}
                <div
                  style={{
                    width: 50,
                    height: 4,
                    backgroundColor: card.color,
                    borderRadius: 2,
                    marginBottom: 20,
                  }}
                />

                {/* LARGE DESCRIPTION BODY TEXT */}
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: '#475569',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {card.description}
                </p>
              </div>

              {/* BOTTOM STEP NUMBER BADGE */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '1px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {card.stepNumber}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default AlternatingCardsInfographic;