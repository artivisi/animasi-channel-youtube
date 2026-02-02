import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const components = [
  { id: "cpu", label: "CPU", desc: "Otak komputer", icon: "cpu", x: 960, y: 200 },
  { id: "ram", label: "RAM", desc: "Memori sementara", icon: "ram", x: 560, y: 400 },
  { id: "storage", label: "Storage", desc: "Penyimpanan permanen", icon: "storage", x: 1360, y: 400 },
  { id: "motherboard", label: "Motherboard", desc: "Penghubung semua komponen", icon: "motherboard", x: 960, y: 600 },
  { id: "gpu", label: "GPU", desc: "Pemroses grafis", icon: "gpu", x: 560, y: 700 },
  { id: "psu", label: "PSU", desc: "Sumber daya listrik", icon: "psu", x: 1360, y: 700 },
];

export const HardwareComponents: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="flex flex-col items-center justify-center">
      {/* Title */}
      <div
        className="absolute top-16 text-center"
        style={{
          transform: `translateY(${(1 - titleSpring) * -50}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-6xl font-bold mb-4"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          Komponen Hardware Komputer
        </h1>
        <p className="text-2xl text-slate-400 font-mono">
          <span style={{ color: TERMINAL_GREEN }}>$</span> lshw -short
        </p>
      </div>

      {/* Components */}
      {components.map((comp, i) => {
        const delay = 10 + i * 8;
        const compSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

        return (
          <div
            key={comp.id}
            className="absolute flex flex-col items-center"
            style={{
              left: comp.x - 100,
              top: comp.y - 50,
              transform: `scale(${compSpring})`,
              opacity: compSpring,
            }}
          >
            <div
              className="w-36 h-36 rounded-2xl flex items-center justify-center mb-3"
              style={{
                backgroundColor: `${TERMINAL_GREEN}15`,
                border: `2px solid ${TERMINAL_GREEN}60`,
                boxShadow: `0 0 25px ${TERMINAL_GREEN}30`,
              }}
            >
              <ComponentIcon type={comp.icon} />
            </div>
            <span className="text-2xl font-bold" style={{ color: TERMINAL_GREEN }}>
              {comp.label}
            </span>
            <span className="text-lg text-slate-400">{comp.desc}</span>
          </div>
        );
      })}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[
          { from: components[0], to: components[3] }, // CPU -> Motherboard
          { from: components[1], to: components[3] }, // RAM -> Motherboard
          { from: components[2], to: components[3] }, // Storage -> Motherboard
          { from: components[4], to: components[3] }, // GPU -> Motherboard
          { from: components[5], to: components[3] }, // PSU -> Motherboard
        ].map((line, i) => {
          const lineProgress = interpolate(frame, [60 + i * 5, 80 + i * 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line
              key={i}
              x1={line.from.x}
              y1={line.from.y + 70}
              x2={line.to.x}
              y2={line.to.y - 50}
              stroke={TERMINAL_GREEN}
              strokeWidth={2}
              strokeDasharray={200}
              strokeDashoffset={200 * (1 - lineProgress)}
              opacity={0.5}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const ComponentIcon: React.FC<{ type: string }> = ({ type }) => {
  const style = { width: 64, height: 64, color: TERMINAL_GREEN };

  const icons: Record<string, JSX.Element> = {
    cpu: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={1.5} />
        <rect x="8" y="8" width="8" height="8" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
      </svg>
    ),
    ram: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="12" rx="1" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M6 10v4M10 10v4M14 10v4M18 10v4M4 18v2M8 18v2M12 18v2M16 18v2M20 18v2" />
      </svg>
    ),
    storage: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <path strokeWidth={1.5} d="M18 8h1" />
      </svg>
    ),
    motherboard: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="2" strokeWidth={1.5} />
        <rect x="5" y="5" width="6" height="6" strokeWidth={1.5} />
        <rect x="14" y="5" width="5" height="3" strokeWidth={1.5} />
        <rect x="14" y="11" width="5" height="3" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M5 15h6M5 18h6" />
      </svg>
    ),
    gpu: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="1" y="6" width="22" height="12" rx="2" strokeWidth={1.5} />
        <circle cx="6" cy="12" r="2" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="2" strokeWidth={1.5} />
        <circle cx="18" cy="12" r="2" strokeWidth={1.5} />
      </svg>
    ),
    psu: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M12 8v8M8 12h8" />
        <circle cx="7" cy="17" r="1" fill="currentColor" />
      </svg>
    ),
  };

  return icons[type] || null;
};
