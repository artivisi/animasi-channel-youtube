import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Terminal color scheme
const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

export type CLNALowerThirdProps = {
  title: string;
  subtitle?: string;
  command?: string;
  position?: "bottom-left" | "bottom-right";
  showAt?: number;
  hideAt?: number;
};

export const CLNALowerThird: React.FC<CLNALowerThirdProps> = ({
  title,
  subtitle,
  command,
  position = "bottom-left",
  showAt = 0,
  hideAt,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const effectiveHideAt = hideAt ?? durationInFrames - 30;

  const enterSpring = spring({
    frame: frame - showAt,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const exitSpring = spring({
    frame: frame - effectiveHideAt,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const progress = enterSpring - exitSpring;

  if (progress <= 0) return null;

  const slideX = interpolate(progress, [0, 1], [-150, 0]);
  const opacity = progress;

  // Typing animation for command
  const commandChars = command
    ? Math.floor(
        interpolate(
          frame - showAt,
          [15, 15 + command.length * 1.5],
          [0, command.length],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      )
    : 0;

  const cursorVisible = Math.floor((frame - showAt) / 8) % 2 === 0;

  const positionStyles: Record<string, React.CSSProperties> = {
    "bottom-left": { bottom: 80, left: 40 },
    "bottom-right": { bottom: 80, right: 40 },
  };

  const isRight = position === "bottom-right";

  return (
    <AbsoluteFill>
      <div
        className="absolute"
        style={{
          ...positionStyles[position],
          transform: `translateX(${isRight ? -slideX : slideX}px)`,
          opacity,
        }}
      >
        {/* Terminal-style container */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: TERMINAL_BG,
            border: `2px solid ${TERMINAL_GREEN}50`,
            boxShadow: `0 0 30px ${TERMINAL_GREEN}30, 0 4px 20px rgba(0,0,0,0.5)`,
            minWidth: 400,
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              borderBottom: `1px solid ${TERMINAL_GREEN}30`,
            }}
          >
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-slate-400 text-sm font-mono">
              info
            </span>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Command line (optional) */}
            {command && (
              <div className="font-mono text-lg mb-3">
                <span style={{ color: TERMINAL_GREEN }}>$</span>{" "}
                <span className="text-slate-300">
                  {command.slice(0, commandChars)}
                </span>
                {commandChars < command.length && cursorVisible && (
                  <span
                    style={{
                      color: TERMINAL_GREEN,
                      textShadow: `0 0 8px ${GLOW_GREEN}`,
                    }}
                  >
                    _
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <h2
              className="text-3xl font-bold"
              style={{
                color: TERMINAL_GREEN,
                textShadow: `0 0 20px ${GLOW_GREEN}40`,
              }}
            >
              {title}
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-xl text-slate-400 mt-1 font-mono">
                <span style={{ color: TERMINAL_GREEN }}>// </span>
                {subtitle}
              </p>
            )}
          </div>

          {/* Bottom accent line */}
          <div
            className="h-1"
            style={{
              background: `linear-gradient(to right, ${TERMINAL_GREEN}, ${GLOW_GREEN}, ${TERMINAL_GREEN})`,
              boxShadow: `0 0 10px ${GLOW_GREEN}`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
