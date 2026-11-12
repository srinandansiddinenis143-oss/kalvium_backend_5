import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface LayerData {
  percent: string;
  label: string;
  subtext: string;
  color: string;
  clipPath: string;
}

const LAYERS: LayerData[] = [
  {
    percent: '10%',
    label: 'Pre-Production & Concept',
    subtext: 'Brainstorming, Script',
    color: '#D4E157', // Lime Yellow
    clipPath: 'polygon(50% 0%, 37.5% 100%, 62.5% 100%)',
  },
  {
    percent: '50%',
    label: 'Production & Assembly',
    subtext: 'Recording, Animating',
    color: '#00BCD4', // Cyan
    clipPath: 'polygon(37.5% 0%, 25% 100%, 75% 100%, 62.5% 0%)',
  },
  {
    percent: '30%',
    label: 'Post-Production',
    subtext: 'Video Editing, Sound',
    color: '#616161', // Dark Grey
    clipPath: 'polygon(25% 0%, 12.5% 100%, 87.5% 100%, 75% 0%)',
  },
  {
    percent: '10%',
    label: 'Review & Delivery',
    subtext: 'Feedback, Final Render',
    color: '#da1515', // Light Grey
    clipPath: 'polygon(12.5% 0%, 0% 100%, 100% 100%, 87.5% 0%)',
  },
  
];

export const PyramidInfographic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A1128',
        fontFamily: 'sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Pyramid Container */}
      <div
        style={{
          position: 'relative',
          width: 420,
          height: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {LAYERS.map((layer, index) => {
          // Bottom layer (index 3) drops first, top layer (index 0) drops last
          const dropOrderIndex = LAYERS.length - 1 - index;
          const delay = dropOrderIndex * 12;

          const dropProgress = spring({
            frame: frame - delay,
            fps,
            config: {
              damping: 14,
              stiffness: 110,
              mass: 0.8,
            },
          });

          const translateY = interpolate(dropProgress, [0, 1], [-500, 0]);
          const opacity = interpolate(dropProgress, [0, 0.2], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={index}
              style={{
                transform: `translateY(${translateY}px)`,
                opacity,
                height: 85,
                width: '100%',
                position: 'relative',
              }}
            >
              {/* Pyramid Slice */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: layer.color,
                  clipPath: layer.clipPath,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: index === 0 ? '#1A237E' : '#FFFFFF',
                  }}
                >
                  {layer.percent}
                </span>
              </div>

              {/* Dotted Line & Labels */}
              <div
                style={{
                  position: 'absolute',
                  right: -310,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: 290,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    borderBottom: '2px dotted rgba(255, 255, 255, 0.4)',
                  }}
                />
                <div style={{ color: '#FFFFFF' }}>
                  <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {layer.label}
                  </div>
                  <div style={{ fontSize: 13, color: '#B0BEC5' }}>
                    {layer.subtext}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};