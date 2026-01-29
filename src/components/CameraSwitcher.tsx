import { AbsoluteFill, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraSwitchCue, getCameraModeAtFrame } from "../tutorials/camera-types";

export type CameraSwitcherProps = {
  screenSrc: string;
  webcamSrc: string;
  cues: CameraSwitchCue[];
  screenVolume?: number;
  webcamVolume?: number;
  pipBorderColor?: string;
  children?: React.ReactNode; // For overlays on top of screen (zoom, etc.)
};

export const CameraSwitcher: React.FC<CameraSwitcherProps> = ({
  screenSrc,
  webcamSrc,
  cues,
  screenVolume = 1,
  webcamVolume = 0,
  pipBorderColor = "#22c55e",
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { mode, cue } = getCameraModeAtFrame(cues, frame, "pip");

  // Calculate transition progress
  let transitionProgress = 1;
  if (cue && cue.transition === "fade") {
    const transitionFrames = 10;
    if (frame < cue.startFrame + transitionFrames) {
      transitionProgress = interpolate(
        frame,
        [cue.startFrame, cue.startFrame + transitionFrames],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
  }

  const pipPosition = cue?.pipPosition || "bottom-right";
  const pipSize = cue?.pipSize || "medium";

  const sizeMap = {
    small: { width: 240, height: 180 },
    medium: { width: 360, height: 270 },
    large: { width: 480, height: 360 },
  };

  const positionMap = {
    "bottom-right": { bottom: 40, right: 40 },
    "bottom-left": { bottom: 40, left: 40 },
    "top-right": { top: 40, right: 40 },
    "top-left": { top: 40, left: 40 },
  };

  const { width: pipWidth, height: pipHeight } = sizeMap[pipSize];

  return (
    <AbsoluteFill>
      {/* Webcam fullscreen (behind screen when in PIP mode) */}
      <AbsoluteFill
        style={{
          opacity: mode === "fullscreen" ? transitionProgress : 0,
          zIndex: mode === "fullscreen" ? 1 : 0,
        }}
      >
        <OffthreadVideo
          src={webcamSrc}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          volume={mode === "fullscreen" ? webcamVolume : 0}
        />
      </AbsoluteFill>

      {/* Screen recording */}
      <AbsoluteFill
        style={{
          opacity: mode === "fullscreen" ? 1 - transitionProgress : 1,
          zIndex: mode === "fullscreen" ? 0 : 1,
        }}
      >
        <OffthreadVideo
          src={screenSrc}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          volume={screenVolume}
        />
        {/* Children (zoom wrapper, etc.) rendered on top of screen */}
        {children}
      </AbsoluteFill>

      {/* Webcam PIP */}
      {mode === "pip" && (
        <div
          className="absolute overflow-hidden"
          style={{
            ...positionMap[pipPosition],
            width: pipWidth,
            height: pipHeight,
            borderRadius: 16,
            border: `4px solid ${pipBorderColor}`,
            boxShadow: `0 0 30px ${pipBorderColor}60, 0 10px 40px rgba(0,0,0,0.5)`,
            opacity: transitionProgress,
            transform: `scale(${interpolate(transitionProgress, [0, 1], [0.8, 1])})`,
            zIndex: 10,
          }}
        >
          <OffthreadVideo
            src={webcamSrc}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            volume={webcamVolume}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
