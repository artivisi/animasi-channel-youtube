import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const components = [
  { id: "kernel", label: "Linux Kernel", desc: "Inti sistem operasi", color: "#f59e0b" },
  { id: "packages", label: "Software Packages", desc: "apt, nginx, python, dll", color: "#8b5cf6" },
  { id: "desktop", label: "Desktop Environment", desc: "GNOME, KDE, XFCE", color: "#06b6d4" },
  { id: "config", label: "Default Configuration", desc: "Settings & preferences", color: "#ec4899" },
];

export const WhatIsDistro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="flex flex-col items-center p-12">
      {/* Title */}
      <div
        className="text-center mb-8"
        style={{
          transform: `translateY(${(1 - titleSpring) * -30}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-5xl font-bold mb-3"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          Apa Itu Distro?
        </h1>
        <p className="text-xl text-slate-400">Distribution = Kernel + Packages + Desktop + Config</p>
      </div>

      {/* Visual equation */}
      <div className="flex items-center justify-center gap-6 mt-8">
        {components.map((comp, i) => {
          const delay = 20 + i * 15;
          const compSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
          const plusSpring = spring({ frame: frame - delay - 5, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div key={comp.id} className="flex items-center gap-6">
              {i > 0 && (
                <span
                  className="text-5xl font-bold"
                  style={{ color: TERMINAL_GREEN, opacity: plusSpring }}
                >
                  +
                </span>
              )}
              <div
                className="flex flex-col items-center p-6 rounded-2xl"
                style={{
                  backgroundColor: `${comp.color}15`,
                  border: `2px solid ${comp.color}60`,
                  boxShadow: `0 0 25px ${comp.color}20`,
                  transform: `scale(${compSpring}) translateY(${(1 - compSpring) * 30}px)`,
                  opacity: compSpring,
                  width: 200,
                }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${comp.color}30` }}
                >
                  <ComponentIcon id={comp.id} color={comp.color} />
                </div>
                <span className="text-lg font-bold text-center" style={{ color: comp.color }}>
                  {comp.label}
                </span>
                <span className="text-sm text-slate-400 text-center mt-1">{comp.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Equals */}
      <div
        className="flex items-center justify-center mt-10"
        style={{
          opacity: spring({ frame: frame - 85, fps, config: { damping: 12, stiffness: 100 } }),
        }}
      >
        <span className="text-5xl font-bold mr-8" style={{ color: TERMINAL_GREEN }}>=</span>
        <div
          className="p-8 rounded-2xl"
          style={{
            backgroundColor: `${TERMINAL_GREEN}15`,
            border: `3px solid ${TERMINAL_GREEN}`,
            boxShadow: `0 0 40px ${TERMINAL_GREEN}30`,
          }}
        >
          <span className="text-4xl font-bold" style={{ color: TERMINAL_GREEN }}>
            Linux Distribution
          </span>
          <p className="text-xl text-slate-400 mt-2 text-center">Ubuntu, Fedora, Debian, dll</p>
        </div>
      </div>

      {/* Bottom note */}
      <div
        className="absolute bottom-10 text-center"
        style={{
          opacity: spring({ frame: frame - 100, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <p className="text-xl text-slate-500">
          Kernel sama, tapi <span style={{ color: TERMINAL_GREEN }}>"rasa"</span> berbeda
        </p>
      </div>
    </AbsoluteFill>
  );
};

const ComponentIcon: React.FC<{ id: string; color: string }> = ({ id, color }) => {
  const style = { width: 32, height: 32, color };

  const icons: Record<string, JSX.Element> = {
    kernel: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" strokeWidth={2} />
        <path strokeWidth={2} d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    packages: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    desktop: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    config: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  };

  return icons[id] || null;
};
