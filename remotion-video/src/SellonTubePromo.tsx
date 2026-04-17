import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";

// 30fps, 15 seconds = 450 frames
// Transitions overlap, so we add extra frames to each scene to compensate
// 3 transitions x 10 frames = 30 frames of overlap
// Total scene frames: 450 + 30 = 480 across 4 scenes

const TRANSITION_DURATION = 10; // frames

export const SellonTubePromo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: 0-4s = 120 frames */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <Scene1 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 2: 4-9s = 150 frames */}
      <TransitionSeries.Sequence durationInFrames={160}>
        <Scene2 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 3: 9-13s = 120 frames */}
      <TransitionSeries.Sequence durationInFrames={130}>
        <Scene3 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 4: 13-15s = 60 frames */}
      <TransitionSeries.Sequence durationInFrames={70}>
        <Scene4 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
