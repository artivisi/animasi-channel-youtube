import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

export const VMArchitecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  const layers = [
    { id: "apps", label: "Apps", items: ["App A", "App B", "App C"], color: "#8b5cf6", y: 80 },
    { id: "guestos", label: "Guest OS", items: ["Ubuntu", "Windows", "CentOS"], color: "#06b6d4", y: 220 },
    { id: "hypervisor", label: "Hypervisor", items: ["VirtualBox / VMware / Hyper-V"], color: TERMINAL_GREEN, y: 380, full: true },
    { id: "hostos", label: "Host OS", items: ["Windows / macOS / Linux"], color: "#f59e0b", y: 500, full: true },
    { id: "hardware", label: "Hardware", items: ["CPU, RAM, Storage"], color: "#ef4444", y: 620, full: true },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="p-8">
      {/* Title */}
      <div
        className="text-center mb-6"
        style={{
          transform: `translateY(${(1 - titleSpring) * -30}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          Full Virtualization Architecture
        </h1>
        <p className="text-lg text-slate-400">Setiap VM punya OS sendiri</p>
      </div>

      {/* Architecture diagram */}
      <div className="flex flex-col items-center mt-4">
        {layers.map((layer, i) => {
          const delay = 15 + i * 12;
          const layerSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });

          return (
            <div
              key={layer.id}
              className="flex flex-col items-center mb-3"
              style={{
                transform: `translateY(${(1 - layerSpring) * 30}px)`,
                opacity: layerSpring,
              }}
            >
              {/* Layer label */}
              <div className="flex items-center gap-4 mb-2">
                <span className="text-lg font-mono text-slate-500 w-32 text-right">{layer.label}</span>
                <div className="flex gap-3">
                  {layer.full ? (
                    <div
                      className="px-8 py-4 rounded-xl text-center"
                      style={{
                        backgroundColor: `${layer.color}20`,
                        border: `2px solid ${layer.color}`,
                        width: 700,
                      }}
                    >
                      <span className="text-xl" style={{ color: layer.color }}>{layer.items[0]}</span>
                    </div>
                  ) : (
                    layer.items.map((item, j) => (
                      <div
                        key={j}
                        className="px-6 py-4 rounded-xl text-center"
                        style={{
                          backgroundColor: `${layer.color}20`,
                          border: `2px solid ${layer.color}`,
                          width: 220,
                        }}
                      >
                        <span className="text-lg" style={{ color: layer.color }}>{item}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Connector arrows */}
              {i < layers.length - 1 && !layer.full && (
                <div className="flex gap-3 my-1">
                  {layer.items.map((_, j) => (
                    <div key={j} className="flex justify-center" style={{ width: 220 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M10 0 L10 15 M5 10 L10 18 L15 10" stroke={layer.color} strokeWidth="2" fill="none" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
              {i < layers.length - 1 && layer.full && (
                <div className="my-1">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M10 0 L10 15 M5 10 L10 18 L15 10" stroke={layer.color} strokeWidth="2" fill="none" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key points */}
      <div
        className="absolute bottom-8 left-12 text-lg"
        style={{
          opacity: spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color: TERMINAL_GREEN }}>+</span>
          <span className="text-slate-400">Isolasi penuh (separate kernel)</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color: TERMINAL_GREEN }}>+</span>
          <span className="text-slate-400">Bisa jalankan OS berbeda</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-400">-</span>
          <span className="text-slate-400">Resource heavy (GB per VM)</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
