import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const layers = [
  { id: "apps", label: "Applications", desc: "Browser, Office, Games", color: "#8b5cf6", y: 150 },
  { id: "os", label: "Operating System", desc: "Windows, Linux, macOS", color: TERMINAL_GREEN, y: 350 },
  { id: "hardware", label: "Hardware", desc: "CPU, RAM, Storage", color: "#f59e0b", y: 550 },
];

export const OSLayers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="flex items-center justify-center">
      {/* Title */}
      <div
        className="absolute top-12 text-center"
        style={{
          transform: `translateY(${(1 - titleSpring) * -50}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          Lapisan Sistem Komputer
        </h1>
        <p className="text-xl text-slate-400">OS sebagai penerjemah antara manusia dan hardware</p>
      </div>

      {/* Layers */}
      <div className="flex flex-col items-center gap-4" style={{ marginTop: 60 }}>
        {layers.map((layer, i) => {
          const delay = 20 + i * 15;
          const layerSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
          const width = 800 - i * 100;

          return (
            <div
              key={layer.id}
              className="relative flex items-center justify-center rounded-2xl"
              style={{
                width,
                height: 140,
                backgroundColor: `${layer.color}20`,
                border: `3px solid ${layer.color}`,
                boxShadow: `0 0 30px ${layer.color}30`,
                transform: `scale(${layerSpring}) translateY(${(1 - layerSpring) * 50}px)`,
                opacity: layerSpring,
              }}
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-1" style={{ color: layer.color }}>
                  {layer.label}
                </h2>
                <p className="text-xl text-slate-300">{layer.desc}</p>
              </div>

              {/* Arrow between layers */}
              {i < layers.length - 1 && (
                <div
                  className="absolute -bottom-10 left-1/2 transform -translate-x-1/2"
                  style={{ opacity: layerSpring }}
                >
                  <svg width="40" height="30" viewBox="0 0 40 30">
                    <path
                      d="M20 0 L20 20 M10 15 L20 25 L30 15"
                      stroke={layer.color}
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Side labels */}
      <div
        className="absolute left-16 top-1/2 transform -translate-y-1/2"
        style={{
          opacity: spring({ frame: frame - 60, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#8b5cf6" }} />
            <span className="text-lg text-slate-400">User interacts here</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TERMINAL_GREEN }} />
            <span className="text-lg text-slate-400">OS translates commands</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
            <span className="text-lg text-slate-400">Hardware executes</span>
          </div>
        </div>
      </div>

      {/* Terminal decoration */}
      <div className="absolute bottom-12 right-12 font-mono text-lg text-slate-600">
        <span style={{ color: TERMINAL_GREEN }}>$</span> uname -a
      </div>
    </AbsoluteFill>
  );
};
