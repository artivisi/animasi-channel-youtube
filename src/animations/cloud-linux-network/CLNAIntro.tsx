import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion";
import logoSrc from "../../assets/logos/logo-artivisi.svg";
import typingSfx from "../../assets/audio/keyboard-typing.wav";
import transitionSfx from "../../assets/audio/transition-sfx.wav";
import whiteNoise from "../../assets/audio/white-noise.wav";

const SERIES_TITLE = "CLOUD & LINUX";
const SERIES_SUBTITLE = "NETWORK ADMIN";
const COMMAND = "$ ssh root@cloud-server";

// Terminal color scheme
const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

// Network node positions
const NODES = [
  { id: "terminal", x: 200, y: 540, icon: "terminal", label: "Client" },
  { id: "router", x: 600, y: 300, icon: "router", label: "Router" },
  { id: "server", x: 1000, y: 540, icon: "server", label: "Server" },
  { id: "cloud", x: 1400, y: 300, icon: "cloud", label: "Cloud" },
  { id: "database", x: 1400, y: 780, icon: "database", label: "Database" },
];

const CONNECTIONS = [
  { from: "terminal", to: "router" },
  { from: "router", to: "server" },
  { from: "router", to: "cloud" },
  { from: "server", to: "database" },
  { from: "cloud", to: "database" },
];

export const CLNAIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Terminal window draw animation
  const terminalProgress = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Command typing animation
  const commandCharsToShow = Math.floor(
    interpolate(frame, [15, 15 + COMMAND.length * 1.5], [0, COMMAND.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Title typing animation
  const titleStartFrame = 45;
  const titleCharsToShow = Math.floor(
    interpolate(
      frame,
      [titleStartFrame, titleStartFrame + SERIES_TITLE.length * 2],
      [0, SERIES_TITLE.length],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  // Subtitle typing
  const subtitleStartFrame = titleStartFrame + SERIES_TITLE.length * 2 + 5;
  const subtitleCharsToShow = Math.floor(
    interpolate(
      frame,
      [subtitleStartFrame, subtitleStartFrame + SERIES_SUBTITLE.length * 2],
      [0, SERIES_SUBTITLE.length],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  // Cursor blink
  const cursorVisible = Math.floor(frame / 8) % 2 === 0;
  const commandTypingDone = commandCharsToShow >= COMMAND.length;
  const titleTypingDone = titleCharsToShow >= SERIES_TITLE.length;
  const subtitleTypingDone = subtitleCharsToShow >= SERIES_SUBTITLE.length;

  // Logo animation
  const logoSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Network nodes spring animation (staggered)
  const nodeSpring = (index: number) =>
    spring({
      frame: frame - (30 + index * 8),
      fps,
      config: { damping: 15, stiffness: 100 },
    });

  // Connection lines animation
  const connectionProgress = interpolate(frame, [60, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glitch effect
  const glitchActive =
    (frame > 40 && frame < 44) ||
    (frame > 85 && frame < 88) ||
    (frame > 120 && frame < 123);

  const glitchOffset = glitchActive ? random(`glitch-${frame}`) * 8 - 4 : 0;
  const rgbSplit = glitchActive ? 3 : 0;

  // Matrix rain characters (subtle background)
  const matrixChars = "01アイウエオカキクケコ";

  return (
    <AbsoluteFill className="bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center overflow-hidden">
      {/* Background ambient noise */}
      <Audio src={whiteNoise} volume={0.03} />

      {/* Swoosh sound for terminal */}
      <Sequence from={0}>
        <Audio src={transitionSfx} volume={0.3} />
      </Sequence>

      {/* Typing sound effect */}
      <Sequence from={10}>
        <Audio src={typingSfx} volume={0.2} />
      </Sequence>

      {/* Matrix-style falling characters (very subtle) */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        {Array.from({ length: 30 }).map((_, i) => {
          const x = (i * 64) % 1920;
          const speed = 2 + (i % 3);
          const offset = ((frame * speed + i * 100) % 1200) - 100;
          const char = matrixChars[i % matrixChars.length];
          return (
            <div
              key={i}
              className="absolute font-mono text-2xl"
              style={{
                left: x,
                top: offset,
                color: TERMINAL_GREEN,
                textShadow: `0 0 10px ${GLOW_GREEN}`,
              }}
            >
              {char}
            </div>
          );
        })}
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.1) 2px,
            rgba(0, 255, 0, 0.1) 4px
          )`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(${TERMINAL_GREEN}40 1px, transparent 1px),
            linear-gradient(90deg, ${TERMINAL_GREEN}40 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ArtiVisi Logo - Top Right */}
      <div
        className="absolute top-10 right-10"
        style={{
          transform: `scale(${logoSpring})`,
          opacity: logoSpring,
        }}
      >
        <Img src={logoSrc} className="w-32 h-32 drop-shadow-lg" />
      </div>

      {/* Network topology visualization */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }}>
        {/* Connection lines */}
        {CONNECTIONS.map((conn, i) => {
          const fromNode = NODES.find((n) => n.id === conn.from)!;
          const toNode = NODES.find((n) => n.id === conn.to)!;
          const lineLength = Math.sqrt(
            Math.pow(toNode.x - fromNode.x, 2) +
              Math.pow(toNode.y - fromNode.y, 2)
          );
          const dashOffset = lineLength * (1 - connectionProgress);

          return (
            <line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={TERMINAL_GREEN}
              strokeWidth={2}
              strokeDasharray={lineLength}
              strokeDashoffset={dashOffset}
              style={{
                filter: `drop-shadow(0 0 4px ${GLOW_GREEN})`,
              }}
            />
          );
        })}

        {/* Data packets animation */}
        {connectionProgress > 0.5 &&
          CONNECTIONS.slice(0, 3).map((conn, i) => {
            const fromNode = NODES.find((n) => n.id === conn.from)!;
            const toNode = NODES.find((n) => n.id === conn.to)!;
            const packetProgress = ((frame - 80 + i * 10) % 40) / 40;
            const px =
              fromNode.x + (toNode.x - fromNode.x) * packetProgress;
            const py =
              fromNode.y + (toNode.y - fromNode.y) * packetProgress;

            return (
              <circle
                key={`packet-${i}`}
                cx={px}
                cy={py}
                r={4}
                fill={GLOW_GREEN}
                style={{
                  filter: `drop-shadow(0 0 8px ${GLOW_GREEN})`,
                  opacity: 0.8,
                }}
              />
            );
          })}
      </svg>

      {/* Network nodes */}
      {NODES.map((node, i) => (
        <div
          key={node.id}
          className="absolute flex flex-col items-center"
          style={{
            left: node.x - 40,
            top: node.y - 40,
            transform: `scale(${nodeSpring(i)})`,
            opacity: nodeSpring(i),
          }}
        >
          <NetworkIcon type={node.icon as NetworkIconType} />
          <span
            className="mt-2 text-sm font-mono"
            style={{
              color: TERMINAL_GREEN,
              textShadow: `0 0 10px ${GLOW_GREEN}`,
            }}
          >
            {node.label}
          </span>
        </div>
      ))}

      {/* Main content with glitch offset */}
      <div
        className="flex flex-col items-center gap-6 z-10"
        style={{
          transform: `translate(${glitchOffset}px, 0)`,
        }}
      >
        {/* Terminal window */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            width: 700,
            backgroundColor: TERMINAL_BG,
            border: `2px solid ${TERMINAL_GREEN}40`,
            boxShadow: `0 0 30px ${TERMINAL_GREEN}30, inset 0 0 30px rgba(0,0,0,0.5)`,
            transform: `scale(${terminalProgress})`,
            opacity: terminalProgress,
          }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-slate-400 text-sm font-mono">
              terminal
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-4 font-mono text-xl">
            <span style={{ color: TERMINAL_GREEN }}>
              {COMMAND.slice(0, commandCharsToShow)}
            </span>
            {!commandTypingDone && cursorVisible && (
              <span
                style={{
                  color: TERMINAL_GREEN,
                  textShadow: `0 0 10px ${GLOW_GREEN}`,
                }}
              >
                _
              </span>
            )}
            {commandTypingDone && (
              <span className="text-slate-500 ml-2">
                connecting...
              </span>
            )}
          </div>
        </div>

        {/* Main Title with typing effect */}
        <div className="relative mt-4">
          {glitchActive && (
            <>
              <h1
                className="absolute font-black tracking-tight text-cyan-500/50"
                style={{
                  fontSize: "6rem",
                  transform: `translate(${-rgbSplit}px, ${-rgbSplit / 2}px)`,
                }}
              >
                {SERIES_TITLE.slice(0, titleCharsToShow)}
              </h1>
              <h1
                className="absolute font-black tracking-tight text-red-500/50"
                style={{
                  fontSize: "6rem",
                  transform: `translate(${rgbSplit}px, ${rgbSplit / 2}px)`,
                }}
              >
                {SERIES_TITLE.slice(0, titleCharsToShow)}
              </h1>
            </>
          )}

          <h1
            className="font-black tracking-tight"
            style={{
              fontSize: "6rem",
              lineHeight: 1,
              color: TERMINAL_GREEN,
              textShadow: `0 0 40px ${GLOW_GREEN}, 0 0 80px ${TERMINAL_GREEN}40`,
            }}
          >
            {SERIES_TITLE.slice(0, titleCharsToShow)}
            {!titleTypingDone && cursorVisible && (
              <span style={{ color: GLOW_GREEN }}>_</span>
            )}
          </h1>
        </div>

        {/* Subtitle with typing effect */}
        <div className="relative -mt-4">
          {glitchActive && (
            <>
              <h2
                className="absolute font-black tracking-widest text-cyan-500/50"
                style={{
                  fontSize: "4rem",
                  transform: `translate(${-rgbSplit}px, ${-rgbSplit / 2}px)`,
                }}
              >
                {SERIES_SUBTITLE.slice(0, subtitleCharsToShow)}
              </h2>
              <h2
                className="absolute font-black tracking-widest text-red-500/50"
                style={{
                  fontSize: "4rem",
                  transform: `translate(${rgbSplit}px, ${rgbSplit / 2}px)`,
                }}
              >
                {SERIES_SUBTITLE.slice(0, subtitleCharsToShow)}
              </h2>
            </>
          )}

          <h2
            className="font-black tracking-widest"
            style={{
              fontSize: "4rem",
              lineHeight: 1,
              color: "#10b981",
              textShadow: `0 0 30px ${TERMINAL_GREEN}80`,
            }}
          >
            {SERIES_SUBTITLE.slice(0, subtitleCharsToShow)}
            {titleTypingDone && !subtitleTypingDone && cursorVisible && (
              <span style={{ color: GLOW_GREEN }}>_</span>
            )}
          </h2>
        </div>

        {/* Tech badges */}
        <div
          className="flex gap-4 mt-6"
          style={{
            opacity: subtitleTypingDone ? 1 : 0,
            transform: `translateY(${subtitleTypingDone ? 0 : 20}px)`,
            transition: "all 0.3s",
          }}
        >
          <TechBadge name="Linux" />
          <TechBadge name="Docker" />
          <TechBadge name="Cloud" />
        </div>
      </div>

      {/* Corner decorations - terminal style */}
      <div className="absolute top-12 left-12 font-mono text-lg text-slate-600">
        <div>
          <span style={{ color: TERMINAL_GREEN }}>root@server:~#</span>{" "}
          systemctl status
        </div>
        <div style={{ opacity: logoSpring }}>
          <span style={{ color: TERMINAL_GREEN }}>root@server:~#</span>{" "}
          docker ps
        </div>
        <div style={{ opacity: connectionProgress }}>
          <span style={{ color: TERMINAL_GREEN }}>root@server:~#</span>{" "}
          ready_
        </div>
      </div>

      <div className="absolute bottom-12 right-12 font-mono text-xl text-right">
        <div style={{ color: TERMINAL_GREEN }}>artivisi.com</div>
      </div>

      {/* Glitch noise overlay */}
      {glitchActive && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Scanline effect during glitch */}
      {glitchActive && (
        <div
          className="absolute left-0 w-full h-0.5 pointer-events-none"
          style={{
            top: `${(frame * 5) % 100}%`,
            background: `linear-gradient(to right, transparent, ${GLOW_GREEN}60, transparent)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// Network icon types
type NetworkIconType = "terminal" | "router" | "server" | "cloud" | "database";

// Network icon component
const NetworkIcon: React.FC<{ type: NetworkIconType }> = ({ type }) => {
  const iconStyle = {
    width: 80,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: `${TERMINAL_BG}`,
    border: `2px solid ${TERMINAL_GREEN}60`,
    boxShadow: `0 0 20px ${TERMINAL_GREEN}30`,
  };

  const svgStyle = {
    width: 40,
    height: 40,
    color: TERMINAL_GREEN,
    filter: `drop-shadow(0 0 8px ${GLOW_GREEN})`,
  };

  const icons: Record<NetworkIconType, JSX.Element> = {
    terminal: (
      <svg style={svgStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    router: (
      <svg style={svgStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7"
        />
        <circle cx="12" cy="12" r="3" strokeWidth={2} />
      </svg>
    ),
    server: (
      <svg style={svgStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        />
      </svg>
    ),
    cloud: (
      <svg style={svgStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
    database: (
      <svg style={svgStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
  };

  return <div style={iconStyle}>{icons[type]}</div>;
};

// Tech badge component
const TechBadge: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div
      className="px-4 py-2 rounded-lg font-mono text-lg font-semibold"
      style={{
        backgroundColor: `${TERMINAL_GREEN}15`,
        border: `2px solid ${TERMINAL_GREEN}60`,
        color: TERMINAL_GREEN,
        boxShadow: `0 0 15px ${TERMINAL_GREEN}20`,
      }}
    >
      {name}
    </div>
  );
};
