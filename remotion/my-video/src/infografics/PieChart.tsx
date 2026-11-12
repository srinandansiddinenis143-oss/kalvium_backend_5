import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { pie, arc } from 'd3-shape';

export interface PieDataItem {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieDataItem[];
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 400 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation for the whole chart
  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  // Calculate Pie layout slices
  const pieGenerator = pie<PieDataItem>()
    .value((d) => d.value)
    .sort(null); // Preserve array order

  const arcsData = pieGenerator(data);

  const outerRadius = size / 2;
  const innerRadius = 0; // Set > 0 (e.g. size / 4) for a Donut Chart

  const arcGenerator = arc<any>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 60,
          transform: `scale(${scaleProgress})`,
        }}
      >
        {/* SVG Pie Chart */}
        <svg width={size} height={size} viewBox={`-${outerRadius} -${outerRadius} ${size} ${size}`}>
          {arcsData.map((slice, index) => {
            // Delay each slice slightly for a staggered animation
            const sliceDelay = index * 5;
            const sliceProgress = spring({
              frame: frame - sliceDelay,
              fps,
              config: { damping: 14, mass: 0.8 },
            });

            // Interpolate the arc completion angle from start to end
            const currentEndAngle = interpolate(
              sliceProgress,
              [0, 1],
              [slice.startAngle, slice.endAngle],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            const path = arcGenerator({
              ...slice,
              endAngle: currentEndAngle,
            });

            return (
              <path
                key={index}
                d={path || ''}
                fill={slice.data.color}
                stroke="#0f172a"
                strokeWidth={3}
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.map((item, index) => {
            const legendDelay = index * 5 + 10;
            const opacity = interpolate(frame - legendDelay, [0, 15], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity,
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: item.color,
                  }}
                />
                <span>
                  {item.label}: {item.value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
