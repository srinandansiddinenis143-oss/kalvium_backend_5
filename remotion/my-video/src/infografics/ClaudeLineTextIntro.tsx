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
// COLOR & LAYOUT CONTROLS
// =========================================================================
const LINE_COLORS = ['#ff5722', '#ffffff', '#ccff00', '#7c4dff', '#2979ff'];
const MAIN_TEXT = 'CLAUDE';
const SUB_TEXT = 'MOTION DESIGN - SHOW';

export const ClaudeLineTextIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // -----------------------------------------------------------------------
  // 1. STEP 1: SMOOTH CENTER YELLOW LINE EXPANSION (FRAME 0+)
  // -----------------------------------------------------------------------
  const yellowGrowthSpring = spring({
    frame,
    fps,
    config: { damping: 30, mass: 3.2, stiffness: 22 },
  });

  const centerLineWidth = interpolate(yellowGrowthSpring, [0, 1], [0, width * 0.75]);

  // -----------------------------------------------------------------------
  // 2. STEP 2: 5 HORIZONTAL LINES SPLIT UP & DOWN FROM CENTER (FRAME 24+)
  // -----------------------------------------------------------------------
  const expandOutwardSpring = spring({
    frame: frame - 24,
    fps,
    config: { damping: 32, mass: 3.5, stiffness: 20 },
  });

  const verticalLineSpread = interpolate(expandOutwardSpring, [0, 1], [0, 42]);

  // -----------------------------------------------------------------------
  // 3. STEP 3: "CLAUDE" TEXT REVEALS SMOOTHLY BEHIND LINES (FRAME 58+)
  // -----------------------------------------------------------------------
  const textRevealSpring = spring({
    frame: frame - 58,
    fps,
    config: { damping: 28, mass: 2.8, stiffness: 24 },
  });

  const textOpacity = interpolate(textRevealSpring, [0, 0.3, 1], [0, 1, 1]);
  const textScale = interpolate(textRevealSpring, [0, 1], [0.88, 1]);

  // -----------------------------------------------------------------------
  // 4. STEP 4: ALTERNATING LINES DISPERSE LEFT & RIGHT (FRAME 95+)
  // -----------------------------------------------------------------------
  const lineDisperseSpring = spring({
    frame: frame - 95,
    fps,
    config: { damping: 34, mass: 4.2, stiffness: 18 },
  });

  const disperseDistance = interpolate(lineDisperseSpring, [0, 1], [0, width * 0.85]);
  const lineOpacity = interpolate(lineDisperseSpring, [0, 0.7, 1], [1, 1, 0]);

  // -----------------------------------------------------------------------
  // 5. STEP 5: TYPEWRITER SUBTEXT REVEAL (FRAME 110+)
  // -----------------------------------------------------------------------
  const typewriterStartFrame = 110;
  const typewriterProgress = Math.max(0, frame - typewriterStartFrame);
  // Slower typing speed (2 frames per letter)
  const visibleCharsCount = Math.min(
    SUB_TEXT.length,
    Math.floor(typewriterProgress / 2.0)
  );
  const currentSubText = SUB_TEXT.slice(0, visibleCharsCount);
  const showCursor = Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0c0f14',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* TYPOGRAPHY GROUP */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            transform: `scale(${textScale})`,
            opacity: textOpacity,
          }}
        >
          {/* MAIN TITLE ("CLAUDE") */}
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: '#f4efe6',
              letterSpacing: '24px',
              textTransform: 'uppercase',
              userSelect: 'none',
              textAlign: 'center',
              lineHeight: 0.9,
              marginBottom: 16,
            }}
          >
            {MAIN_TEXT}
          </div>

          {/* TYPEWRITER SUBTEXT DIRECTLY BELOW */}
          <div
            style={{
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 800,
              color: '#ff5722',
              letterSpacing: '6px',
            }}
          >
            {frame > typewriterStartFrame && (
              <>
                <span>{currentSubText}</span>
                {showCursor && (
                  <span
                    style={{
                      width: 12,
                      height: 22,
                      backgroundColor: '#ff5722',
                      marginLeft: 6,
                      display: 'inline-block',
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* DYNAMIC HORIZONTAL LINES LAYER */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            pointerEvents: 'none',
            opacity: lineOpacity,
          }}
        >
          {LINE_COLORS.map((color, index) => {
            const isCenterYellow = index === 2;
            const offsetMultiplier = index - 2;

            // Spreads UP and DOWN from center yellow line
            const initialY = offsetMultiplier * verticalLineSpread;

            // X Dispersal: Even lines move LEFT (-1), Odd lines move RIGHT (+1)
            const isEven = index % 2 === 0;
            const direction = isEven ? -1 : 1;
            const currentX = direction * disperseDistance;

            // Line width extension logic with smooth staggered physics
            const lineStagger = isCenterYellow ? 0 : Math.abs(offsetMultiplier) * 6 + 18;
            const currentWidth = interpolate(
              spring({
                frame: frame - lineStagger,
                fps,
                config: { damping: 30, mass: 3.0, stiffness: 24 },
              }),
              [0, 1],
              [0, centerLineWidth]
            );

            return (
              <div
                key={`line-${index}`}
                style={{
                  position: 'absolute',
                  height: 8,
                  width: currentWidth,
                  backgroundColor: color,
                  borderRadius: 4,
                  transform: `translate(${currentX}px, ${initialY}px)`,
                  boxShadow: `0 0 16px ${color}88`,
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default ClaudeLineTextIntro;