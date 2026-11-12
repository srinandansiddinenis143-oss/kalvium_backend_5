import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

export const AutolayoutGapDial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -----------------------------------------------------------
  // 1. PARAMETERS & GEOMETRY
  // -----------------------------------------------------------
  const blockWidths = [252, 206, 278, 268, 220];
  const blockHeight = 120;

  // Calculates the gap for any given frame to allow velocity derivation
  const getGap = (f: number) => {
    if (f < 0) return 12;
    // 0-10f: Prepare (12 -> 6)
    if (f <= 10) return interpolate(f, [0, 10], [12, 6], { easing: Easing.out(Easing.ease) });
    // 10-44f: Outbound Stretch (6 -> 104)
    if (f <= 44) return interpolate(f, [10, 44], [6, 104], { easing: Easing.inOut(Easing.ease) });
    // 44-64f: Hold Breath (104)
    if (f <= 64) return 104;
    // 64f+: Spring Return (Damping 9, Stiffness 80)
    const rebound = spring({
      frame: f - 64,
      fps,
      config: { damping: 9, stiffness: 80, mass: 1.1 },
    });
    return interpolate(rebound, [0, 1], [104, 12]);
  };

  // Real-time parameters derived within the same frame
  const gap = Math.max(0, getGap(frame)); // Prevent negative gap during severe overshoot
  const prevGap = getGap(frame - 1);
  const gapVelocity = gap - prevGap;
  const isMoving = Math.abs(gapVelocity) > 0.1;

  // UI Colors based on movement state
  const activeColor = isMoving ? '#FFD700' : '#FFFFFF'; // Gold when moving, White when still
  const darkField = '#111111';

  // -----------------------------------------------------------
  // 2. LAYOUT CALCULATIONS
  // -----------------------------------------------------------
  // Total width of all blocks + the dynamic gaps between them
  const totalWidth = blockWidths.reduce((a, b) => a + b, 0) + gap * (blockWidths.length - 1);
  const startX = -totalWidth / 2; // Centers the entire row dynamically

  // Calculate the X position of each block
  let currentX = startX;
  const blockPositions = blockWidths.map((w) => {
    const pos = currentX;
    currentX += w + gap;
    return pos;
  });

  // Slow continuous camera zoom (2.5% over the 150 frames)
  const cameraZoom = interpolate(frame, [0, 150], [1, 1.025]);

  return (
    <AbsoluteFill style={{ backgroundColor: darkField, overflow: 'hidden' }}>
      {/* Import Inter / UI Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
          * { box-sizing: border-box; }
        `}
      </style>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${cameraZoom})`,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* TOP READING ALONE (196px thin tabular value) */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            fontSize: '196px',
            fontWeight: 200,
            color: activeColor,
            fontVariantNumeric: 'tabular-nums',
            display: 'flex',
            alignItems: 'baseline',
          }}
        >
          {Math.round(gap)}
          <span style={{ fontSize: '48px', color: '#666', marginLeft: '12px' }}>px</span>
        </div>

        {/* DIAL RULER / SCALE (Rolls dynamically with the gap) */}
        <div
          style={{
            position: 'absolute',
            top: '38%',
            width: '760px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            overflow: 'hidden',
          }}
        >
          {/* Dial container translating based on gap to simulate rolling */}
          <div style={{ transform: `translateX(${-gap * 5}px)`, display: 'flex', gap: '20px' }}>
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '2px',
                  height: i % 5 === 0 ? '24px' : '12px',
                  backgroundColor: '#333',
                }}
              />
            ))}
          </div>
          {/* Center Gold Needle */}
          <div style={{ position: 'absolute', width: '2px', height: '40px', backgroundColor: activeColor }} />
        </div>

        {/* -----------------------------------------------------------
            THE LINKED BLOCKS & MEASUREMENT LINES
            ----------------------------------------------------------- */}
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Center Measurement Line (Pins the gap center) */}
          <div
            style={{
              position: 'absolute',
              width: gap,
              height: '2px',
              backgroundColor: activeColor,
              top: '50%',
              marginTop: '-80px', // Pushed above the blocks
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* End spikes for the measurement line */}
            <div style={{ width: '2px', height: '16px', backgroundColor: activeColor }} />
            <div style={{ width: '2px', height: '16px', backgroundColor: activeColor }} />
            
            {/* Follow Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-32px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: activeColor,
                color: isMoving ? '#000' : '#FFF',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {Math.round(gap)}
            </div>
          </div>

          {/* Render the 5 Blocks */}
          {blockWidths.map((width, i) => {
            // Motion blur calculation: Outermost blocks move faster (i - 2 determines distance from center)
            const blockVelocity = (i - 2) * gapVelocity;
            const blurAmount = isMoving ? Math.min(9, Math.abs(blockVelocity) * 0.5) : 0;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: width,
                  height: blockHeight,
                  backgroundColor: '#222',
                  border: '2px solid #333',
                  borderRadius: '12px',
                  transform: `translateX(${blockPositions[i]}px)`,
                  // Lateral motion blur applied only when toggle segment is moving
                  filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};