import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const operatingSystems = [
  {
    id: "windows",
    name: "Windows",
    color: "#0078d4",
    price: "Rp 2-3 juta",
    useCase: "Desktop, Gaming, Office",
    market: "~70% Desktop",
    pros: ["Familiar", "Software support", "Gaming"],
    cons: ["Bayar lisensi", "Resource heavy", "Virus target"],
  },
  {
    id: "macos",
    name: "macOS",
    color: "#a3aaae",
    price: "Gratis (bundled)",
    useCase: "Creative, Development",
    market: "~15% Desktop",
    pros: ["Polished UI", "Unix-based", "Ecosystem"],
    cons: ["Apple hardware only", "Mahal", "Limited games"],
  },
  {
    id: "linux",
    name: "Linux",
    color: TERMINAL_GREEN,
    price: "Gratis & Open Source",
    useCase: "Server, Development, IoT",
    market: "~96% Server",
    pros: ["Gratis", "Ringan", "Customizable", "Secure"],
    cons: ["Learning curve", "Less software", "Hardware support"],
  },
];

export const OSComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="p-12">
      {/* Title */}
      <div
        className="text-center mb-8"
        style={{
          transform: `translateY(${(1 - titleSpring) * -30}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          Perbandingan Sistem Operasi
        </h1>
      </div>

      {/* OS Cards */}
      <div className="flex justify-center gap-8 mt-4">
        {operatingSystems.map((os, i) => {
          const delay = 15 + i * 12;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div
              key={os.id}
              className="w-[540px] rounded-2xl overflow-hidden"
              style={{
                backgroundColor: `${os.color}10`,
                border: `2px solid ${os.color}60`,
                boxShadow: `0 0 30px ${os.color}20`,
                transform: `scale(${cardSpring}) translateY(${(1 - cardSpring) * 30}px)`,
                opacity: cardSpring,
              }}
            >
              {/* Header */}
              <div
                className="p-5 text-center"
                style={{ backgroundColor: `${os.color}20`, borderBottom: `1px solid ${os.color}40` }}
              >
                <h2 className="text-3xl font-bold" style={{ color: os.color }}>
                  {os.name}
                </h2>
                <p className="text-xl text-slate-300 mt-1">{os.price}</p>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-4">
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Use Case</p>
                  <p className="text-lg text-slate-200">{os.useCase}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Market Share</p>
                  <p className="text-lg font-mono" style={{ color: os.color }}>{os.market}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">Kelebihan</p>
                  <div className="flex flex-wrap gap-2">
                    {os.pros.map((pro, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: `${os.color}30`, color: os.color }}
                      >
                        + {pro}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">Kekurangan</p>
                  <div className="flex flex-wrap gap-2">
                    {os.cons.map((con, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 rounded-full text-sm bg-slate-800 text-slate-400"
                      >
                        - {con}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        style={{
          opacity: spring({ frame: frame - 60, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <p className="text-xl text-slate-400">
          <span style={{ color: TERMINAL_GREEN }}>→</span> Untuk server, <span style={{ color: TERMINAL_GREEN }}>Linux</span> adalah pilihan utama
        </p>
      </div>
    </AbsoluteFill>
  );
};
