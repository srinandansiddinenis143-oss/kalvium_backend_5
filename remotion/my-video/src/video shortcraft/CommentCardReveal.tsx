import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export const CommentCardReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ==========================================
  // ANIMATION PHYSICS
  // ==========================================
  
  // 1. Card Entrance (Spring scale & slide up heavily from the bottom)
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  
  const cardScale = interpolate(cardSpring, [0, 1], [0.90, 1]);
  // CHANGED: Starting 200px down so it clearly travels upwards from below
  const cardTranslateY = interpolate(cardSpring, [0, 1], [200, 0]); 
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // 2. Staggered Content Reveal (Delayed springs)
  const avatarSpring = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const textSpring = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const actionsSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        // Checkerboard background to match the reference image's transparent context
        backgroundColor: '#e5e5e5',
        backgroundImage: `
          linear-gradient(45deg, #d4d4d4 25%, transparent 25%), 
          linear-gradient(-45deg, #d4d4d4 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #d4d4d4 75%), 
          linear-gradient(-45deg, transparent 75%, #d4d4d4 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* FLOATING COMMENT CARD */}
      <div
        style={{
          backgroundColor: '#1a1b1e', // Dark YouTube-style card background
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          gap: '16px',
          width: '760px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.5)',
          transform: `translateY(${cardTranslateY}px) scale(${cardScale})`,
          opacity: cardOpacity,
        }}
      >
        {/* Avatar Area */}
        <div
          style={{
            flexShrink: 0,
            opacity: avatarSpring,
            transform: `scale(${avatarSpring})`,
          }}
        >
          {/* Simulated user avatar */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
              alt="Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => (e.currentTarget.style.display = 'none')} 
            />
          </div>
        </div>

        {/* Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          
          {/* Username */}
          <div
            style={{
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 700,
              opacity: textSpring,
              transform: `translateY(${interpolate(textSpring, [0, 1], [10, 0])}px)`,
            }}
          >
            @alexrenders
          </div>

          {/* Comment Body */}
          <div
            style={{
              color: '#f1f1f1',
              fontSize: '16px',
              lineHeight: 1.5,
              opacity: textSpring,
              transform: `translateY(${interpolate(textSpring, [0, 1], [10, 0])}px)`,
              marginBottom: '4px',
            }}
          >
            This breakdown made the whole process click. Would love to see how you plan the animation timing in a future video!
          </div>

          {/* Actions Footer (Likes / Dislikes) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: '#aaaaaa',
              opacity: actionsSpring,
              transform: `translateY(${interpolate(actionsSpring, [0, 1], [10, 0])}px)`,
              marginTop: '4px',
            }}
          >
            {/* Like Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>2.4K</span>
            </div>

            {/* Dislike Button */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleY(-1)' }}>
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </AbsoluteFill>
  );
};