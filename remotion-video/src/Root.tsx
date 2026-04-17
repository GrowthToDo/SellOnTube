import { Composition } from "remotion";
import { SellonTubePromo } from "./SellonTubePromo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SellonTubePromo"
      component={SellonTubePromo}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
