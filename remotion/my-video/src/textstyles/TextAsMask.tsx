import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';

export const TextAsMask: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ==========================================
  // PHASE TIMINGS (165 frames total)
  // 0-18f: Entrance & settle
  // 18-96f: Intra-word drift & dashboard flow
  // 96-104f: Inhalation (quick shrink 1 -> 0.965)
  // 104-128f: Logarithmic zoom-in rush (46x)
  // 128-165f: Fullscreen product panel hold
  // ==========================================

  const entranceScale = interpolate(frame, [0, 18], [1.04, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const productDriftX = interpolate(frame, [18, 96], [150, -150], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.3, 0, 0.7, 1),
  });

  const inhaleScale = interpolate(frame, [96, 104], [1, 0.965], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  const rushProgress = interpolate(frame, [104, 128], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const s0 = 0.965;
  const targetScale = frame >= 104 ? s0 * Math.pow(46 / s0, Math.pow(rushProgress, 1.8)) : inhaleScale;
  const currentScale = entranceScale * targetScale;

  // Center origin point for zoom surge
  const originX = width / 2;
  const originY = height / 2;
  const wrapperTranslateX = interpolate(rushProgress, [0, 1], [0, (width / 2 - originX) * 2]);
  const wrapperTranslateY = interpolate(rushProgress, [0, 1], [0, (height / 2 - originY) * 2]);

  const inverseScale = 1 / currentScale;

  const takeoverOpacity = interpolate(rushProgress, [0.86, 0.95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f4f4f6', // Porcelain cool white stage
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* SVG Mask Definition with Centered ViewBox */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <mask id="launchTextMask" x="0" y="0" width={width} height={height} maskUnits="userSpaceOnUse">
            <rect width={width} height={height} fill="black" />
            <g transform={`translate(${width / 2}, ${height / 2})`}>
              <text
                x="0"
                y="0"
                dy=".35em"
                textAnchor="middle"
                fontSize="280"
                fontWeight="900"
                letterSpacing="-12"
                fill="white"
              >
                LAUNCH
              </text>
            </g>
          </mask>
        </defs>
      </svg>

      {/* ZOOM WRAPPER */}
      <div
        style={{
          position: 'absolute',
          width: width,
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translate(${wrapperTranslateX}px, ${wrapperTranslateY}px) scale(${currentScale})`,
          transformOrigin: `${originX}px ${originY}px`,
        }}
      >
        {/* DASHBOARD CONTAINER STRICTLY MASKED INSIDE TEXT */}
        <div
          style={{
            position: 'absolute',
            width: width,
            height: height,
            backgroundColor: '#0a0d14',
            mask: 'url(#launchTextMask)',
            WebkitMask: 'url(#launchTextMask)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '80px',
            boxSizing: 'border-box',
          }}
        >
          {/* Internal Content Reverse Compensation */}
          <div
            style={{
              position: 'absolute',
              width: width,
              height: height,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '80px',
              boxSizing: 'border-box',
              transform: `scale(${inverseScale})`,
              transformOrigin: `${originX}px ${originY}px`,
            }}
          >
            <div
              style={{
                transform: `translateX(${productDriftX}px)`,
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                width: '1400px',
              }}
            >
              {/* Area Graph Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '280px', gap: '12px' }}>
                {[40, 65, 50, 85, 110, 95, 140, 180, 160, 210, 240, 220, 280, 310].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}px`,
                      background: 'linear-gradient(180deg, #00f2fe 0%, rgba(4,107,255,0.2) 100%)',
                      borderRadius: '6px 6px 0 0',
                    }}
                  />
                ))}
              </div>

              {/* Telemetry Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '24px' }}>
                <div style={{ color: '#00f2fe', fontSize: '24px', fontWeight: 700, letterSpacing: '0.05em' }}>
                  RENDER THROUGHPUT: 99.8% ACTIVE
                </div>
                <div style={{ color: '#8a95b5', fontSize: '18px' }}>
                  QUEUE: 1,420 FRAMES / SEC
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Takeover Insurance Layer */}
      <div
        style={{
          position: 'absolute',
          width: width,
          height: height,
          backgroundColor: '#0a0d14',
          opacity: takeoverOpacity,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '80px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '24px' }}>
          <div style={{ color: '#00f2fe', fontSize: '24px', fontWeight: 700, letterSpacing: '0.05em' }}>
            RENDER THROUGHPUT: 99.8% ACTIVE
          </div>
          <div style={{ color: '#8a95b5', fontSize: '18px' }}>
            QUEUE: 1,420 FRAMES / SEC
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};