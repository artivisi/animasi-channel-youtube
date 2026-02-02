import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const timeline = [
  { year: "1991", event: "Linus Torvalds membuat Linux kernel", highlight: true },
  { year: "1993", event: "Slackware & Debian dirilis", highlight: false },
  { year: "1994", event: "Linux 1.0 dirilis", highlight: true },
  { year: "2004", event: "Ubuntu pertama kali dirilis", highlight: true },
  { year: "2011", event: "Linux 3.0 - Android booming", highlight: false },
  { year: "2024", event: "Linux dominasi server & cloud", highlight: true },
];

export const LinuxHistory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="flex flex-col items-center p-12">
      {/* Title */}
      <div
        className="text-center mb-12"
        style={{
          transform: `translateY(${(1 - titleSpring) * -30}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-5xl font-bold mb-3"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          Sejarah Singkat Linux
        </h1>
        <p className="text-xl text-slate-400 font-mono">
          <span style={{ color: TERMINAL_GREEN }}>$</span> history | grep linux
        </p>
      </div>

      {/* Timeline */}
      <div className="relative flex flex-col items-center" style={{ width: 1000 }}>
        {/* Vertical line */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-1 rounded-full"
          style={{
            backgroundColor: `${TERMINAL_GREEN}40`,
            height: interpolate(frame, [20, 100], [0, 700], { extrapolateRight: "clamp" }),
            top: 0,
          }}
        />

        {timeline.map((item, i) => {
          const delay = 25 + i * 12;
          const itemSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
          const isLeft = i % 2 === 0;

          return (
            <div
              key={item.year}
              className="relative flex items-center mb-6"
              style={{
                width: "100%",
                justifyContent: isLeft ? "flex-start" : "flex-end",
                opacity: itemSpring,
                transform: `translateX(${(1 - itemSpring) * (isLeft ? -50 : 50)}px)`,
              }}
            >
              {/* Content */}
              <div
                className={`flex items-center gap-4 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
                style={{ width: "45%" }}
              >
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: item.highlight ? `${TERMINAL_GREEN}20` : "rgba(30,41,59,0.5)",
                    border: `2px solid ${item.highlight ? TERMINAL_GREEN : "rgba(100,116,139,0.3)"}`,
                    boxShadow: item.highlight ? `0 0 20px ${TERMINAL_GREEN}30` : "none",
                  }}
                >
                  <span
                    className="text-2xl font-bold font-mono"
                    style={{ color: item.highlight ? TERMINAL_GREEN : "#94a3b8" }}
                  >
                    {item.year}
                  </span>
                  <p className="text-lg text-slate-300 mt-1">{item.event}</p>
                </div>
              </div>

              {/* Center dot */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full"
                style={{
                  backgroundColor: item.highlight ? TERMINAL_GREEN : "#475569",
                  boxShadow: item.highlight ? `0 0 15px ${GLOW_GREEN}` : "none",
                  border: `3px solid ${TERMINAL_BG}`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Linus quote */}
      <div
        className="absolute bottom-12 text-center px-12"
        style={{
          opacity: spring({ frame: frame - 100, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <p className="text-xl text-slate-500 italic">
          "I'm doing a (free) operating system (just a hobby, won't be big and professional)"
        </p>
        <p className="text-lg text-slate-600 mt-2">— Linus Torvalds, 1991</p>
      </div>
    </AbsoluteFill>
  );
};
