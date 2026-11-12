import { Composition } from 'remotion';
import { CrossOutText } from './video shortcraft/CrossOutText';

export const RemotionRoot = () => {
  return (
    <Composition
      id="CrossOutText"
      component={CrossOutText}
      durationInFrames={90} // 3 seconds @ 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};