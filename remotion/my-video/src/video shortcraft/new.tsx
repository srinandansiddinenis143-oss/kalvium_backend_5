import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

interface Pose {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
}

// -----------------------------------------------------------
// 1. SITE POSES CONFIGURATION
// -----------------------------------------------------------
const POSES: Pose[] = [
  // Station 1: Origin Point
  { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1 },
  // Station 2: Turned 38° Left
  { x: 1690, y: -260, z: -650, rx: 0, ry: -38, rz: 0, s: 1 },
  // Station 3: Sideways Frame (90° Rotation)
  { x: 2590, y: 830, z: -850, rx: 0, ry: 0, rz: 90, s: 1 },
  // Station 4: Overview (Camera 1/2.7 Zoomed Out)
  { x: 1295, y: 285, z: 400, rx: 0, ry: 0, rz: 0, s: 2.7 },
];

export const Basic3DScene: React.FC = () => {
  const frame = useCurrentFrame();

  // -----------------------------------------------------------
  // 2. FLIGHT CHAIN INTERPOLATION & CAMERA MATH
  // -----------------------------------------------------------
  let currentPose: Pose = POSES[0];

  if (frame < 36) {
    // Stop 1: Dwell with 1.5% camera advance
    const dwellProgress = frame / 36;
    const zoomIn = interpolate(dwellProgress, [0, 1], [1, 1.015]);
    currentPose = { ...POSES[0], s: POSES[0].s * zoomIn };
  } else if (frame <= 64) {
    // Flight 1: Station 1 -> 2 (28 frames)
    const progress = interpolate(frame, [36, 64], [0, 1], {
      easing: Easing.bezier(0.62, 0, 0.16, 1),
    });
    const hop = Math.sin(progress * Math.PI) * 400; // 30% retreat envelope
    currentPose = {
      x: interpolate(progress, [0, 1], [POSES[0].x, POSES[1].x]),
      y: interpolate(progress, [0, 1], [POSES[0].y, POSES[1].y]),
      z: interpolate(progress, [0, 1], [POSES[0].z, POSES[1].z]) - hop,
      rx: interpolate(progress, [0, 1], [POSES[0].rx, POSES[1].rx]),
      ry: interpolate(progress, [0, 1], [POSES[0].ry, POSES[1].ry]),
      rz: interpolate(progress, [0, 1], [POSES[0].rz, POSES[1].rz]),
      s: interpolate(progress, [0, 1], [POSES[0].s, POSES[1].s]),
    };
  } else if (frame < 96) {
    // Stop 2: Dwell
    const dwellProgress = (frame - 64) / 32;
    const zoomIn = interpolate(dwellProgress, [0, 1], [1, 1.015]);
    currentPose = { ...POSES[1], s: POSES[1].s * zoomIn };
  } else if (frame <= 128) {
    // Flight 2: Station 2 -> 3 (32 frames)
    const progress = interpolate(frame, [96, 128], [0, 1], {
      easing: Easing.bezier(0.62, 0, 0.16, 1),
    });
    const hop = Math.sin(progress * Math.PI) * 400;
    currentPose = {
      x: interpolate(progress, [0, 1], [POSES[1].x, POSES[2].x]),
      y: interpolate(progress, [0, 1], [POSES[1].y, POSES[2].y]),
      z: interpolate(progress, [0, 1], [POSES[1].z, POSES[2].z]) - hop,
      rx: interpolate(progress, [0, 1], [POSES[1].rx, POSES[2].rx]),
      ry: interpolate(progress, [0, 1], [POSES[1].ry, POSES[2].ry]),
      rz: interpolate(progress, [0, 1], [POSES[1].rz, POSES[2].rz]),
      s: interpolate(progress, [0, 1], [POSES[1].s, POSES[2].s]),
    };
  } else if (frame < 158) {
    // Stop 3: Dwell
    const dwellProgress = (frame - 128) / 30;
    const zoomIn = interpolate(dwellProgress, [0, 1], [1, 1.015]);
    currentPose = { ...POSES[2], s: POSES[2].s * zoomIn };
  } else if (frame <= 190) {
    // Flight 3: Station 3 -> Overview (32 frames)
    const progress = interpolate(frame, [158, 190], [0, 1], {
      easing: Easing.bezier(0.62, 0, 0.16, 1),
    });
    currentPose = {
      x: interpolate(progress, [0, 1], [POSES[2].x, POSES[3].x]),
      y: interpolate(progress, [0, 1], [POSES[2].y, POSES[3].y]),
      z: interpolate(progress, [0, 1], [POSES[2].z, POSES[3].z]),
      rx: interpolate(progress, [0, 1], [POSES[2].rx, POSES[3].rx]),
      ry: interpolate(progress, [0, 1], [POSES[2].ry, POSES[3].ry]),
      rz: interpolate(progress, [0, 1], [POSES[2].rz, POSES[3].rz]),
      s: interpolate(progress, [0, 1], [POSES[2].s, POSES[3].s]),
    };
  } else {
    // Stop 4: Overview Dwell
    const dwellProgress = (frame - 190) / 35;
    const zoomIn = interpolate(dwellProgress, [0, 1], [1, 1.015]);
    currentPose = { ...POSES[3], s: POSES[3].s * zoomIn };
  }

  // Camera Inverse Formula: strictly Z -> Y -> X rotation order
  const cameraTransform = `scale(${1 / currentPose.s}) rotateZ(${-currentPose.rz}deg) rotateY(${-currentPose.ry}deg) rotateX(${-currentPose.rx}deg) translate3d(${-currentPose.x}px, ${-currentPose.y}px, ${-currentPose.z}px)`;

  // Cards Content
  const cards = [
    {
      num: '01',
      title: 'FRAME',
      desc: 'Set the spatial boundary and establish structural baseline.',
      pose: POSES[0],
    },
    {
      num: '02',
      title: 'CRAFT',
      desc: 'Engineer precision dynamics and motion curve balance.',
      pose: POSES[1],
    },
    {
      num: '03',
      title: 'SHIP',
      desc: 'Deliver production assets with pixel-perfect consistency.',
      pose: POSES[2],
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0C10',
        perspective: '2600px',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Playfair+Display:ital@0;1&display=swap');
        `}
      </style>

      {/* 3D World Stage */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          transform: cameraTransform,
        }}
      >
        {/* Spatial Reference: 70 3D Dust Particles */}
        {Array.from({ length: 70 }).map((_, i) => {
          const px = (i * 137.5) % 4000 - 1000;
          const py = (i * 293.1) % 3000 - 1000;
          const pz = (i * 173.3) % 2000 - 1200;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 215, 0, 0.4)',
                transform: `translate3d(${px}px, ${py}px, ${pz}px)`,
              }}
            />
          );
        })}

        {/* 3D Chapter Cards (1240x700 1:1 pixel native layout) */}
        {cards.map((card, i) => {
          // Dynamic Depth of Field based on station distance
          const dist = Math.hypot(
            card.pose.x - currentPose.x,
            card.pose.y - currentPose.y,
            card.pose.z - currentPose.z
          );

          const isOverview = frame >= 190;
          const opacity = isOverview
            ? 0.85
            : interpolate(dist, [0, 1500], [1, 0.22], { extrapolateRight: 'clamp' });
          const blur = isOverview
            ? 0
            : interpolate(dist, [0, 1500], [0, 7], { extrapolateRight: 'clamp' });

          const cardTransform = `translate3d(${card.pose.x}px, ${card.pose.y}px, ${card.pose.z}px) rotateX(${card.pose.rx}deg) rotateY(${card.pose.ry}deg) rotateZ(${card.pose.rz}deg)`;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '1240px',
                height: '700px',
                marginLeft: '-620px',
                marginTop: '-350px',
                backgroundColor: '#12161F',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '60px',
                color: '#FFFFFF',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                transformStyle: 'preserve-3d',
                transform: cardTransform,
                opacity,
                filter: `blur(${blur}px)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#FFD700', letterSpacing: '2px' }}>
                  CHAPTER // {card.num}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 400, color: '#666' }}>
                  VIDEO-SHOTCRAFT
                </div>
              </div>

              <div>
                <div style={{ fontSize: '156px', fontWeight: 900, lineHeight: '1', color: '#FFFFFF', letterSpacing: '-4px' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '44px', color: '#A0AEC0', marginTop: '20px', maxWidth: '900px', lineHeight: '1.2' }}>
                  {card.desc}
                </div>
              </div>

              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#FFD700' }} />
              </div>
            </div>
          );
        })}

        {/* Overview Serif Title (Craft the shot.) */}
        {frame >= 158 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate3d(200px, 600px, 400px)`,
              transformStyle: 'preserve-3d',
              color: '#FFFFFF',
              fontFamily: "'Playfair Display', serif",
              fontSize: '150px',
              fontStyle: 'italic',
              opacity: interpolate(frame, [158, 190], [0, 1]),
            }}
          >
            Craft the shot.
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};