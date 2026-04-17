import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "400"],
  subsets: ["latin"],
});

const BG = "#0f0f0f";
const ACCENT = "#f97316";
const WHITE = "#ffffff";

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline springs in with scale + opacity
  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const headlineY = interpolate(headlineProgress, [0, 1], [60, 0]);
  const headlineOpacity = headlineProgress;

  // Subtitle fades in after a delay
  const subtitleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.round(0.8 * fps),
  });

  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0]);
  const subtitleOpacity = subtitleProgress;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 72,
            fontWeight: 700,
            color: WHITE,
            textAlign: "center",
            lineHeight: 1.2,
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}
        >
          YouTube SEO That{" "}
          <span style={{ color: ACCENT }}>Actually Sells</span>
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          Content Marketing for Serious Businesses
        </div>
      </div>
    </AbsoluteFill>
  );
};
