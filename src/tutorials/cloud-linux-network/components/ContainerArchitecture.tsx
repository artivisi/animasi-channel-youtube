import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";
const DOCKER_BLUE = "#2496ED";

export const ContainerArchitecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  const layers = [
    { id: "apps", label: "Apps", items: ["App A", "App B", "App C"], color: "#8b5cf6", y: 80 },
    { id: "bins", label: "Bins/Libs", items: ["Deps A", "Deps B", "Deps C"], color: "#f472b6", y: 200 },
    { id: "engine", label: "Container Engine", items: ["Docker / Podman / containerd"], color: DOCKER_BLUE, y: 340, full: true },
    { id: "hostos", label: "Host OS (Shared Kernel)", items: ["Linux"], color: TERMINAL_GREEN, y: 460, full: true },
    { id: "hardware", label: "Hardware", items: ["CPU, RAM, Storage"], color: "#ef4444", y: 580, full: true },
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
          style={{ color: DOCKER_BLUE, textShadow: `0 0 30px ${DOCKER_BLUE}40` }}
        >
          Container Architecture
        </h1>
        <p className="text-lg text-slate-400">Berbagi kernel dengan host</p>
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
              {/* Container boxes for apps and bins */}
              {(layer.id === "apps" || layer.id === "bins") && i === 0 && (
                <div className="flex gap-3 mb-2">
                  {[0, 1, 2].map((j) => (
                    <div
                      key={j}
                      className="rounded-xl overflow-hidden"
                      style={{
                        border: `2px dashed ${DOCKER_BLUE}60`,
                        width: 220,
                      }}
                    >
                      {/* App */}
                      <div
                        className="px-4 py-3 text-center"
                        style={{
                          backgroundColor: `${layers[0].color}20`,
                          borderBottom: `1px solid ${layers[0].color}40`,
                        }}
                      >
                        <span className="text-lg" style={{ color: layers[0].color }}>
                          {layers[0].items[j]}
                        </span>
                      </div>
                      {/* Bins */}
                      <div
                        className="px-4 py-3 text-center"
                        style={{ backgroundColor: `${layers[1].color}20` }}
                      >
                        <span className="text-lg" style={{ color: layers[1].color }}>
                          {layers[1].items[j]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skip bins layer as it's combined with apps */}
              {layer.id === "bins" && null}

              {/* Full width layers */}
              {layer.full && (
                <>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-lg font-mono text-slate-500 w-40 text-right">{layer.label}</span>
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
                  </div>
                  {i < layers.length - 1 && (
                    <div className="my-1">
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M10 0 L10 15 M5 10 L10 18 L15 10" stroke={layer.color} strokeWidth="2" fill="none" />
                      </svg>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Label for containers */}
      <div
        className="absolute top-48 left-32 flex items-center gap-2"
        style={{
          opacity: spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <span className="text-lg font-mono text-slate-500">Containers</span>
        <svg width="30" height="20" viewBox="0 0 30 20">
          <path d="M0 10 H25 M20 5 L28 10 L20 15" stroke={DOCKER_BLUE} strokeWidth="2" fill="none" />
        </svg>
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
          <span className="text-slate-400">Ringan (MB, bukan GB)</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color: TERMINAL_GREEN }}>+</span>
          <span className="text-slate-400">Start dalam detik</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-400">-</span>
          <span className="text-slate-400">Harus sama OS family dengan host</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
