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

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry animation
  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const scale = interpolate(entryProgress, [0, 1], [0.8, 1]);
  const opacity = entryProgress;

  // Pulse animation on CTA (subtle scale oscillation)
  const pulseScale = interpolate(
    frame % Math.round(1.2 * fps),
    [0, Math.round(0.6 * fps), Math.round(1.2 * fps)],
    [1, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 52,
            fontWeight: 700,
            color: WHITE,
            textAlign: "center",
            lineHeight: 1.3,
            transform: `scale(${pulseScale})`,
          }}
        >
          Book a Free{"\n"}
          <span style={{ color: ACCENT }}>Diagnostic Call</span>
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          sellontube.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
