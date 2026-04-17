import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

const BG = "#0f0f0f";
const ACCENT = "#f97316";
const WHITE = "#ffffff";

const VALUE_PROPS = [
  { label: "YouTube SEO Strategy", icon: "🎯" },
  { label: "Shopify Store Growth", icon: "🛒" },
  { label: "Email Marketing (Klaviyo)", icon: "📧" },
];

const Pill: React.FC<{
  label: string;
  icon: string;
  delay: number;
}> = ({ label, icon, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
    delay,
  });

  const translateX = interpolate(progress, [0, 1], [-400, 0]);
  const opacity = progress;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        backgroundColor: "rgba(249, 115, 22, 0.12)",
        border: `2px solid ${ACCENT}`,
        borderRadius: 60,
        padding: "24px 48px",
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <span style={{ fontSize: 44 }}>{icon}</span>
      <span
        style={{
          fontFamily,
          fontSize: 38,
          fontWeight: 600,
          color: WHITE,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const { fps } = useVideoConfig();

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
          gap: 36,
          alignItems: "center",
        }}
      >
        {VALUE_PROPS.map((prop, i) => (
          <Pill
            key={prop.label}
            label={prop.label}
            icon={prop.icon}
            delay={Math.round(i * 0.5 * fps)}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
