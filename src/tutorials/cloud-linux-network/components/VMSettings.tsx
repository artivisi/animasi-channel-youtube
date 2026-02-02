import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const settings = [
  { icon: "cpu", label: "CPU", value: "2 cores", note: "Minimal 1, rekomendasi 2", color: "#f59e0b" },
  { icon: "ram", label: "RAM", value: "2 GB", note: "Minimal 1 GB untuk Desktop", color: "#8b5cf6" },
  { icon: "disk", label: "Disk", value: "25 GB", note: "Dynamic allocation", color: "#06b6d4" },
  { icon: "video", label: "Video", value: "128 MB", note: "Enable 3D jika tersedia", color: "#ec4899" },
];

export const VMSettings: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="flex flex-col items-center justify-center p-12">
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
          Recommended VM Settings
        </h1>
        <p className="text-xl text-slate-400">Untuk Ubuntu Desktop di VirtualBox</p>
      </div>

      {/* Settings grid */}
      <div className="grid grid-cols-2 gap-8 max-w-4xl">
        {settings.map((setting, i) => {
          const delay = 20 + i * 12;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div
              key={setting.label}
              className="flex items-center gap-6 p-6 rounded-2xl"
              style={{
                backgroundColor: `${setting.color}15`,
                border: `2px solid ${setting.color}60`,
                boxShadow: `0 0 25px ${setting.color}20`,
                transform: `scale(${cardSpring})`,
                opacity: cardSpring,
              }}
            >
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${setting.color}30` }}
              >
                <SettingIcon type={setting.icon} color={setting.color} />
              </div>
              <div>
                <p className="text-lg text-slate-400">{setting.label}</p>
                <p className="text-4xl font-bold" style={{ color: setting.color }}>{setting.value}</p>
                <p className="text-sm text-slate-500 mt-1">{setting.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div
        className="mt-12 p-6 rounded-xl"
        style={{
          backgroundColor: `${TERMINAL_GREEN}15`,
          border: `2px solid ${TERMINAL_GREEN}`,
          opacity: spring({ frame: frame - 70, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <p className="text-xl text-slate-300">
          Total kebutuhan laptop: <span style={{ color: TERMINAL_GREEN }} className="font-bold">~4 GB RAM free</span>
        </p>
        <p className="text-slate-500 text-sm mt-1">Host OS + VM = minimal 8 GB RAM total</p>
      </div>
    </AbsoluteFill>
  );
};

const SettingIcon: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const style = { width: 40, height: 40, color };

  const icons: Record<string, JSX.Element> = {
    cpu: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
        <rect x="8" y="8" width="8" height="8" strokeWidth={2} />
        <path strokeWidth={2} d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
      </svg>
    ),
    ram: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="12" rx="1" strokeWidth={2} />
        <path strokeWidth={2} d="M6 10v4M10 10v4M14 10v4M18 10v4" />
      </svg>
    ),
    disk: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={2} />
        <circle cx="12" cy="12" r="4" strokeWidth={2} />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    video: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="14" rx="2" strokeWidth={2} />
        <path strokeWidth={2} d="M8 20h8" />
        <path strokeWidth={2} d="M12 18v2" />
      </svg>
    ),
  };

  return icons[type] || null;
};
