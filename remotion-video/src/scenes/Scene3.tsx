import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["500"],
  subsets: ["latin"],
});

const BG = "#0f0f0f";
const ACCENT = "#f97316";
const WHITE = "#ffffff";

const FULL_TEXT =
  "Helping founders grow organically — without paid ads";
const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;

const Cursor: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <span style={{ opacity, color: ACCENT, fontWeight: 300 }}>{"\u258C"}</span>
  );
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Delay typewriter start by 0.3s so it doesn't start instantly
  const delayFrames = Math.round(0.3 * fps);
  const typingFrame = Math.max(0, frame - delayFrames);

  const typedChars = Math.min(
    FULL_TEXT.length,
    Math.floor(typingFrame / CHAR_FRAMES)
  );
  const typedText = FULL_TEXT.slice(0, typedChars);
  const isFinished = typedChars >= FULL_TEXT.length;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 46,
          fontWeight: 500,
          color: WHITE,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        <span>{typedText}</span>
        {!isFinished && <Cursor frame={frame} />}
      </div>
    </AbsoluteFill>
  );
};
