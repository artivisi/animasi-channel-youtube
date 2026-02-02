import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const modes = [
  {
    name: "NAT",
    color: "#06b6d4",
    desc: "VM bisa akses internet, tapi tidak bisa diakses dari luar",
    useCase: "Default, browsing, updates",
    internet: true,
    hostAccess: false,
    vmToVm: false,
  },
  {
    name: "Bridged",
    color: "#8b5cf6",
    desc: "VM dapat IP dari jaringan rumah, seperti komputer fisik",
    useCase: "Server yang perlu diakses dari LAN",
    internet: true,
    hostAccess: true,
    vmToVm: true,
  },
  {
    name: "Internal",
    color: "#f59e0b",
    desc: "VM hanya bisa komunikasi sesama VM",
    useCase: "Lab jaringan, simulasi",
    internet: false,
    hostAccess: false,
    vmToVm: true,
  },
  {
    name: "Host-only",
    color: "#ec4899",
    desc: "VM bisa komunikasi dengan host dan sesama VM",
    useCase: "Development, testing",
    internet: false,
    hostAccess: true,
    vmToVm: true,
  },
];

export const VirtualBoxNetworkModes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="p-10">
      {/* Title */}
      <div
        className="text-center mb-8"
        style={{
          transform: `translateY(${(1 - titleSpring) * -30}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          VirtualBox Network Modes
        </h1>
        <p className="text-lg text-slate-400">Pilih sesuai kebutuhan lab</p>
      </div>

      {/* Network modes grid */}
      <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
        {modes.map((mode, i) => {
          const delay = 15 + i * 10;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div
              key={mode.name}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: `${mode.color}10`,
                border: `2px solid ${mode.color}60`,
                transform: `scale(${cardSpring})`,
                opacity: cardSpring,
              }}
            >
              <div className="p-4" style={{ backgroundColor: `${mode.color}20` }}>
                <h3 className="text-2xl font-bold" style={{ color: mode.color }}>{mode.name}</h3>
              </div>
              <div className="p-4">
                <p className="text-slate-300 mb-3">{mode.desc}</p>
                <p className="text-sm text-slate-500 mb-3">
                  <span className="font-semibold">Use case:</span> {mode.useCase}
                </p>

                {/* Capability indicators */}
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className={mode.internet ? "text-green-400" : "text-red-400"}>
                      {mode.internet ? "✓" : "✗"}
                    </span>
                    <span className="text-slate-400">Internet</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={mode.hostAccess ? "text-green-400" : "text-red-400"}>
                      {mode.hostAccess ? "✓" : "✗"}
                    </span>
                    <span className="text-slate-400">Host</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={mode.vmToVm ? "text-green-400" : "text-red-400"}>
                      {mode.vmToVm ? "✓" : "✗"}
                    </span>
                    <span className="text-slate-400">VM↔VM</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendation */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        style={{
          opacity: spring({ frame: frame - 60, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <p className="text-lg text-slate-400">
          Lab jaringan: kombinasi <span style={{ color: "#06b6d4" }}>NAT</span> +{" "}
          <span style={{ color: "#f59e0b" }}>Internal</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
