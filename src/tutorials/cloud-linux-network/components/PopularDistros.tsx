import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const distros = [
  { name: "Ubuntu", color: "#E95420", tagline: "Linux for human beings", useCase: "Desktop & Server, Pemula" },
  { name: "Debian", color: "#A80030", tagline: "The universal OS", useCase: "Server, Stabilitas" },
  { name: "Fedora", color: "#51A2DA", tagline: "Bleeding edge", useCase: "Developer, Latest tech" },
  { name: "Arch", color: "#1793D1", tagline: "Keep it simple", useCase: "Advanced users, DIY" },
  { name: "CentOS/Rocky", color: "#932279", tagline: "Enterprise ready", useCase: "Enterprise server" },
  { name: "Linux Mint", color: "#87CF3E", tagline: "From freedom came elegance", useCase: "Desktop, Ex-Windows user" },
];

export const PopularDistros: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="p-12">
      {/* Title */}
      <div
        className="text-center mb-10"
        style={{
          transform: `translateY(${(1 - titleSpring) * -30}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          Distro Linux Populer
        </h1>
        <p className="text-xl text-slate-400">Pilih sesuai kebutuhan</p>
      </div>

      {/* Distro grid */}
      <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
        {distros.map((distro, i) => {
          const delay = 15 + i * 8;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div
              key={distro.name}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: `${distro.color}15`,
                border: `2px solid ${distro.color}60`,
                boxShadow: `0 0 25px ${distro.color}20`,
                transform: `scale(${cardSpring})`,
                opacity: cardSpring,
              }}
            >
              {/* Header with logo placeholder */}
              <div
                className="p-4 flex items-center gap-4"
                style={{ backgroundColor: `${distro.color}25` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: distro.color, color: "white" }}
                >
                  {distro.name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: distro.color }}>
                    {distro.name}
                  </h3>
                  <p className="text-sm text-slate-400 italic">"{distro.tagline}"</p>
                </div>
              </div>

              {/* Use case */}
              <div className="p-4">
                <p className="text-sm text-slate-500 uppercase tracking-wide">Best for</p>
                <p className="text-lg text-slate-300">{distro.useCase}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendation */}
      <div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center"
        style={{
          opacity: spring({ frame: frame - 70, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <p className="text-xl text-slate-400">
          Seri ini menggunakan{" "}
          <span className="font-bold" style={{ color: "#E95420" }}>Ubuntu</span>
          {" "}— paling banyak tutorial & komunitas
        </p>
      </div>
    </AbsoluteFill>
  );
};
