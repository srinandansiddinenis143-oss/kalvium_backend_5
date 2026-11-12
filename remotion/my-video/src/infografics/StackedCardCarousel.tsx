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
// 1. INFOGRAPHIC CARD DATA (5 CARDS)
// =========================================================================
interface CardData {
  id: string;
  stepNumber: string;
  emoji: string;
  title: string;
  description: string;
  accentColor: string;
}

const CARDS: CardData[] = [
  {
    id: 'card1',
    stepNumber: '01',
    emoji: '🚀',
    title: 'LAUNCH',
    description: 'Deploy production-ready AI agents and high-performance video pipelines.',
    accentColor: '#3b82f6', // Blue
  },
  {
    id: 'card2',
    stepNumber: '02',
    emoji: '💡',
    title: 'INNOVATE',
    description: 'Design intuitive, motion-first components with smooth physics.',
    accentColor: '#00a8cc', // Cyan
  },
  {
    id: 'card3',
    stepNumber: '03',
    emoji: '⚡',
    title: 'AUTOMATE',
    description: 'Streamline video creation with scalable React & Remotion workflows.',
    accentColor: '#eab308', // Amber / Yellow
  },
  {
    id: 'card4',
    stepNumber: '04',
    emoji: '📊',
    title: 'ANALYZE',
    description: 'Monitor motion metrics, render speeds, and frame-accurate timing.',
    accentColor: '#a855f7', // Purple
  },
  {
    id: 'card5',
    stepNumber: '05',
    emoji: '📈',
    title: 'SCALE',
    description: 'Expand infrastructure seamlessly with SaaS architecture and APIs.',
    accentColor: '#10b981', // Emerald Green
  },
];

// INCREASED CARD DIMENSIONS
const CARD_WIDTH = 560;
const CARD_HEIGHT = 560;

export const StackedCardCarousel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#070709',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        perspective: 1200, // 3D Camera Perspective
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
        }}
      >
        {CARDS.map((card, index) => {
          // -----------------------------------------------------------------
          // 1. STAGGERED RIGHT-TO-CENTER ENTRANCE
          // -----------------------------------------------------------------
          const entranceDelay = index * 10 + 8;
          const entranceSpring = spring({
            frame: frame - entranceDelay,
            fps,
            config: { damping: 28, mass: 3.2, stiffness: 20 },
          });

          // Slide in from far right
          const entranceX = interpolate(entranceSpring, [0, 1], [width * 0.7, 0]);

          // FRONT-TO-BACK OVERLAP & DEPTH SPACING FOR 5 CARDS
          const stackX = (index - 1) * 110; // Shift stack position so it sits centered
          const stackZ = -index * 90;       // Depth spacing into 3D space
          const stackY = index * 8;         // Slight vertical stagger

          // -----------------------------------------------------------------
          // 2. ONE-BY-ONE FRONT-TO-BACK EXIT (UP & LEFT PEEL)
          // -----------------------------------------------------------------
          const exitStartFrame = 65 + index * 45;
          const exitSpring = spring({
            frame: frame - exitStartFrame,
            fps,
            config: { damping: 30, mass: 3.5, stiffness: 18 },
          });

          const exitProgress = interpolate(exitSpring, [0, 1], [0, 1], {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          // Slide up (-160px) and peel off left
          const exitY = interpolate(exitProgress, [0, 0.35, 1], [0, -160, -90]);
          const exitX = interpolate(exitProgress, [0, 1], [0, -width * 0.85]);
          const exitOpacity = interpolate(exitProgress, [0, 0.65, 1], [1, 1, 0]);

          // Combine Entrance, Stack Position, and Exit Motion
          const finalX = entranceX + stackX + exitX;
          const finalY = stackY + exitY;

          return (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                borderRadius: 36,
                backgroundColor: '#111319',
                boxShadow: '-24px 36px 70px rgba(0, 0, 0, 0.85)',
                border: `2px solid ${card.accentColor}44`,
                padding: '48px 42px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transformStyle: 'preserve-3d',
                // SIDEWAYS 3D LOOK: -30deg rotateY + 5deg rotateX
                transform: `
                  translateX(${finalX}px) 
                  translateY(${finalY}px) 
                  translateZ(${stackZ}px) 
                  rotateY(-30deg) 
                  rotateX(5deg)
                `,
                opacity: exitOpacity,
                zIndex: CARDS.length - index, // Front-to-back layer order
              }}
            >
              {/* TOP HEADER: EMOJI + STEP BADGE */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {/* LARGER EMOJI BADGE */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 24,
                    backgroundColor: `${card.accentColor}1a`,
                    border: `1.5px solid ${card.accentColor}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 42,
                  }}
                >
                  {card.emoji}
                </div>

                {/* STEP NUMBER BADGE */}
                <div
                  style={{
                    padding: '8px 18px',
                    borderRadius: 24,
                    backgroundColor: card.accentColor,
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: '1px',
                  }}
                >
                  STEP {card.stepNumber}
                </div>
              </div>

              {/* CENTER CONTENT: TITLE & DESCRIPTION */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {/* LARGER CARD TITLE */}
                <h3
                  style={{
                    margin: 0,
                    fontSize: 42,
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  {card.title}
                </h3>

                {/* ACCENT LINE */}
                <div
                  style={{
                    width: 60,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: card.accentColor,
                  }}
                />

                {/* LARGER DESCRIPTION TEXT */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 500,
                    color: '#94a3b8',
                    lineHeight: 1.5,
                  }}
                >
                  {card.description}
                </p>
              </div>

              {/* BOTTOM DECORATIVE ACCENT BAR */}
              <div
                style={{
                  width: '100%',
                  height: 4,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${card.accentColor}, transparent)`,
                  opacity: 0.6,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default StackedCardCarousel;// import React from 'react';
// import {
//   AbsoluteFill,
//   Easing,
//   Img,
//   interpolate,
//   spring,
//   useCurrentFrame,
//   useVideoConfig,
// } from 'remotion';

// // DIRECT IMPORTS FROM `src/`
// import img1 from './image1.png';
// import img2 from './image2.png';
// import img3 from './image3.png';

// interface CardItem {
//   id: string;
//   imageSrc: string;
// }

// const CARDS: CardItem[] = [
//   { id: 'card1', imageSrc: img1 },
//   { id: 'card2', imageSrc: img2 },
//   { id: 'card3', imageSrc: img3 },
// ];

// const CARD_WIDTH = 440;
// const CARD_HEIGHT = 440;

// export const StackedCardCarousel: React.FC = () => {
//   const frame = useCurrentFrame();
//   const { fps } = useVideoConfig();

//   return (
//     <AbsoluteFill
//       style={{
//         backgroundColor: '#070709',
//         fontFamily: 'system-ui, -apple-system, sans-serif',
//         overflow: 'hidden',
//         perspective: 1000, // Stronger 3D Camera Perspective
//       }}
//     >
//       <div
//         style={{
//           position: 'relative',
//           width: '100%',
//           height: '100%',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           transformStyle: 'preserve-3d',
//         }}
//       >
//         {CARDS.map((card, index) => {
//           // -----------------------------------------------------------------
//           // 1. STAGGERED RIGHT-TO-CENTER ENTRANCE
//           // -----------------------------------------------------------------
//           const entranceDelay = index * 14 + 10;
//           const entranceSpring = spring({
//             frame: frame - entranceDelay,
//             fps,
//             config: { damping: 28, mass: 3.2, stiffness: 20 },
//           });

//           // Slide in from far right (+900px)
//           const entranceX = interpolate(entranceSpring, [0, 1], [900, 0]);

//           // FRONT-TO-BACK OVERLAP & DEPTH SPACING
//           const stackX = index * 140; // Horizontal offset between stacked cards
//           const stackZ = -index * 120; // Depth spacing into 3D space
//           const stackY = index * 10;   // Slight vertical stagger

//           // -----------------------------------------------------------------
//           // 2. ONE-BY-ONE FRONT-TO-BACK EXIT (UP & LEFT PEEL)
//           // -----------------------------------------------------------------
//           const exitStartFrame = 75 + index * 60;
//           const exitSpring = spring({
//             frame: frame - exitStartFrame,
//             fps,
//             config: { damping: 30, mass: 3.5, stiffness: 18 },
//           });

//           const exitProgress = interpolate(exitSpring, [0, 1], [0, 1], {
//             easing: Easing.bezier(0.25, 0.1, 0.25, 1),
//             extrapolateLeft: 'clamp',
//             extrapolateRight: 'clamp',
//           });

//           // Slide up (-140px) and peel off left (-1100px)
//           const exitY = interpolate(exitProgress, [0, 0.35, 1], [0, -140, -80]);
//           const exitX = interpolate(exitProgress, [0, 1], [0, -1100]);
//           const exitOpacity = interpolate(exitProgress, [0, 0.65, 1], [1, 1, 0]);

//           // Combine Entrance, Stack Position, and Exit Motion
//           const finalX = entranceX + stackX + exitX;
//           const finalY = stackY + exitY;

//           return (
//             <div
//               key={card.id}
//               style={{
//                 position: 'absolute',
//                 width: CARD_WIDTH,
//                 height: CARD_HEIGHT,
//                 borderRadius: 28,
//                 overflow: 'hidden',
//                 boxShadow: '-20px 30px 60px rgba(0, 0, 0, 0.75)',
//                 border: '1px solid rgba(255, 255, 255, 0.15)',
//                 transformStyle: 'preserve-3d',
//                 // SIDEWAY 3D LOOK: -32deg rotateY creates the angled album stack view
//                 transform: `
//                   translateX(${finalX}px) 
//                   translateY(${finalY}px) 
//                   translateZ(${stackZ}px) 
//                   rotateY(-32deg) 
//                   rotateX(6deg)
//                 `,
//                 opacity: exitOpacity,
//                 zIndex: CARDS.length - index, // Front-to-back layer ordering
//               }}
//             >
//               <Img
//                 src={card.imageSrc}
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   objectFit: 'cover',
//                 }}
//               />
//             </div>
//           );
//         })}
//       </div>
//     </AbsoluteFill>
//   );
// };

// export default StackedCardCarousel;