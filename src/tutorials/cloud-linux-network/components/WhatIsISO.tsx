import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

export const WhatIsISO: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const cdSpring = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 100 } });
  const arrowSpring = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 100 } });
  const isoSpring = spring({ frame: frame - 50, fps, config: { damping: 12, stiffness: 100 } });
  const vmSpring = spring({ frame: frame - 70, fps, config: { damping: 12, stiffness: 100 } });

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
          Apa Itu ISO File?
        </h1>
        <p className="text-xl text-slate-400">CD/DVD installer dalam bentuk digital</p>
      </div>

      {/* Visual explanation */}
      <div className="flex items-center justify-center gap-8">
        {/* Physical CD */}
        <div
          className="flex flex-col items-center"
          style={{
            transform: `scale(${cdSpring})`,
            opacity: cdSpring,
          }}
        >
          <div
            className="w-48 h-48 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)",
            }}
          >
            <div className="w-16 h-16 rounded-full bg-slate-900" />
          </div>
          <p className="text-xl text-slate-300 mt-4">Physical CD/DVD</p>
          <p className="text-slate-500">Zaman dulu</p>
        </div>

        {/* Arrow */}
        <div
          className="flex flex-col items-center"
          style={{
            opacity: arrowSpring,
            transform: `scaleX(${arrowSpring})`,
          }}
        >
          <svg width="100" height="40" viewBox="0 0 100 40">
            <path
              d="M0 20 H80 M70 10 L90 20 L70 30"
              stroke={TERMINAL_GREEN}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-slate-500 text-sm mt-2">digitized</p>
        </div>

        {/* ISO File */}
        <div
          className="flex flex-col items-center"
          style={{
            transform: `scale(${isoSpring})`,
            opacity: isoSpring,
          }}
        >
          <div
            className="w-48 h-48 rounded-2xl flex flex-col items-center justify-center"
            style={{
              backgroundColor: `${TERMINAL_GREEN}20`,
              border: `3px solid ${TERMINAL_GREEN}`,
              boxShadow: `0 0 30px ${TERMINAL_GREEN}30`,
            }}
          >
            <svg className="w-20 h-20 mb-2" style={{ color: TERMINAL_GREEN }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-mono text-lg" style={{ color: TERMINAL_GREEN }}>.iso</span>
          </div>
          <p className="text-xl text-slate-300 mt-4">ISO File</p>
          <p className="text-slate-500">ubuntu-24.04-desktop.iso</p>
        </div>

        {/* Arrow */}
        <div
          className="flex flex-col items-center"
          style={{
            opacity: vmSpring,
            transform: `scaleX(${vmSpring})`,
          }}
        >
          <svg width="100" height="40" viewBox="0 0 100 40">
            <path
              d="M0 20 H80 M70 10 L90 20 L70 30"
              stroke={TERMINAL_GREEN}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-slate-500 text-sm mt-2">boot in VM</p>
        </div>

        {/* VM */}
        <div
          className="flex flex-col items-center"
          style={{
            transform: `scale(${vmSpring})`,
            opacity: vmSpring,
          }}
        >
          <div
            className="w-48 h-48 rounded-2xl flex flex-col items-center justify-center"
            style={{
              backgroundColor: "#06b6d420",
              border: "3px solid #06b6d4",
              boxShadow: "0 0 30px rgba(6, 182, 212, 0.3)",
            }}
          >
            <svg className="w-20 h-20 mb-2" style={{ color: "#06b6d4" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-mono text-lg" style={{ color: "#06b6d4" }}>VM</span>
          </div>
          <p className="text-xl text-slate-300 mt-4">Virtual Machine</p>
          <p className="text-slate-500">Install OS</p>
        </div>
      </div>

      {/* Bottom note */}
      <div
        className="absolute bottom-12 text-center"
        style={{
          opacity: spring({ frame: frame - 90, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <p className="text-lg text-slate-400">
          Download dari{" "}
          <span style={{ color: TERMINAL_GREEN }} className="font-mono">ubuntu.com/download</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
