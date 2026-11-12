import { useCurrentFrame, AbsoluteFill } from 'remotion';

export const MyComposition = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <h1>Current Frame: {frame}</h1>
    </AbsoluteFill>
  );
};