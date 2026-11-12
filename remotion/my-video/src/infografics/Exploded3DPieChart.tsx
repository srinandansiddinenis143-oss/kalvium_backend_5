import React from 'react';
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// =========================================================================
// 1. POSITION & SIZE CONTROLS
// =========================================================================
const CHART_SIZE = 520;       // Overall diameter of the chart in pixels
const CHART_TOP = '50%';      // Screen position ('50%' = centered vertically)
const CHART_LEFT = '50%';     // Screen position ('50%' = centered horizontally)

interface SliceData {
  id: string;
  name: string;               // Name of color / category
  label: string;              // Percentage string
  value: number;
  color: string;
  explodeDistance: number;    // Distance slice pushes outward (in px)
}

const CHART_DATA: SliceData[] = [
  { id: 'red', name: 'Pink', label: '18%', value: 18, color: '#e63956', explodeDistance: 45 },
  { id: 'teal', name: 'Teal', label: '18%', value: 18, color: '#00a896', explodeDistance: 15 },
  { id: 'orange', name: 'Orange', label: '35%', value: 35, color: '#f4a261', explodeDistance: 35 },
  { id: 'purple', name: 'Purple', label: '45%', value: 45, color: '#8e44ad', explodeDistance: 20 },
  { id: 'blue', name: 'Blue', label: '68%', value: 68, color: '#0081a7', explodeDistance: 10 },
];

// Helper: Generates SVG Path `d` for a solid pie slice from center (0,0)
const getPieSlicePath = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number
) => {
  const startRad = (startAngleDeg - 90) * (Math.PI / 180);
  const endRad = (endAngleDeg - 90) * (Math.PI / 180);

  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);

  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? 0 : 1;

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
};

export const Exploded3DPieChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalValue = CHART_DATA.reduce((acc, slice) => acc + slice.value, 0);

  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const center = CHART_SIZE / 2;
  const radius = CHART_SIZE / 2 - 40;

  let accumulatedPercent = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f4f6f8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Position Container Box */}
      <div
        style={{
          position: 'absolute',
          width: CHART_SIZE,
          height: CHART_SIZE,
          top: CHART_TOP,
          left: CHART_LEFT,
          transform: `translate(-50%, -50%) scale(${entryProgress})`,
        }}
      >
        <svg
          width={CHART_SIZE}
          height={CHART_SIZE}
          viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
          style={{ overflow: 'visible' }}
        >
          {CHART_DATA.map((slice, index) => {
            const startPercent = accumulatedPercent;
            accumulatedPercent += slice.value;

            const sliceProgress = spring({
              frame: frame - index * 5,
              fps,
              config: { damping: 14, stiffness: 85 },
            });

            const startAngleDeg = (startPercent / totalValue) * 360;
            const endAngleDeg = (accumulatedPercent / totalValue) * 360;
            const midAngleRad =
              (((startAngleDeg + endAngleDeg) / 2) - 90) * (Math.PI / 180);

            const currentExplode = slice.explodeDistance * sliceProgress;
            const offsetX = Math.cos(midAngleRad) * currentExplode;
            const offsetY = Math.sin(midAngleRad) * currentExplode;

            const pathData = getPieSlicePath(
              center,
              center,
              radius,
              startAngleDeg,
              endAngleDeg
            );

            return (
              <g key={slice.id} style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}>
                <path
                  d={pathData}
                  fill={slice.color}
                  stroke="#ffffff"
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Labels Overlay */}
        {(() => {
          let currentPercent = 0;
          return CHART_DATA.map((slice, index) => {
            const startPercent = currentPercent;
            currentPercent += slice.value;

            const sliceProgress = spring({
              frame: frame - index * 5,
              fps,
              config: { damping: 14, stiffness: 85 },
            });

            const startAngleDeg = (startPercent / totalValue) * 360;
            const endAngleDeg = (currentPercent / totalValue) * 360;
            const midAngleRad =
              (((startAngleDeg + endAngleDeg) / 2) - 90) * (Math.PI / 180);

            const currentExplode = slice.explodeDistance * sliceProgress;
            
            // Check if slice is small (< 20%)
            const isSmallSlice = slice.value < 20;

            // Inside label position
            const labelRadius = radius * 0.55;
            const labelX = center + (labelRadius + currentExplode) * Math.cos(midAngleRad);
            const labelY = center + (labelRadius + currentExplode) * Math.sin(midAngleRad);

            // Outside label position for small slices
            const outsideRadius = radius + 30;
            const outsideX = center + (outsideRadius + currentExplode) * Math.cos(midAngleRad);
            const outsideY = center + (outsideRadius + currentExplode) * Math.sin(midAngleRad);

            return (
              <React.Fragment key={`label-${slice.id}`}>
                {/* On-Slice Percentage Text */}
                <div
                  style={{
                    position: 'absolute',
                    left: labelX,
                    top: labelY,
                    transform: `translate(-50%, -50%) scale(${sliceProgress})`,
                    opacity: sliceProgress,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    color: '#ffffff',
                    textAlign: 'center',
                    textShadow: '0px 2px 5px rgba(0,0,0,0.5)',
                  }}
                >
                  {!isSmallSlice && (
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        opacity: 0.95,
                      }}
                    >
                      {slice.name}
                    </span>
                  )}
                  <span style={{ fontSize: isSmallSlice ? 22 : 28, fontWeight: 900 }}>
                    {slice.label}
                  </span>
                </div>

                {/* Outside Category Name for Small Slices with Black Outline */}
                {isSmallSlice && (
                  <div
                    style={{
                      position: 'absolute',
                      left: outsideX,
                      top: outsideY,
                      transform: `translate(-50%, -50%) scale(${sliceProgress})`,
                      opacity: sliceProgress,
                      pointerEvents: 'none',
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      // Black text outline
                      WebkitTextStroke: '1px #000000',
                      textShadow: '0px 2px 4px rgba(0, 0, 0, 0.8)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {slice.name}
                  </div>
                )}
              </React.Fragment>
            );
          });
        })()}
      </div>
    </AbsoluteFill>
  );
};

export default Exploded3DPieChart;