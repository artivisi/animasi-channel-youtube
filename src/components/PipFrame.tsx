import { AbsoluteFill } from "remotion";

/**
 * PIP Frame - simple border overlay for FFmpeg
 *
 * Just a rounded border frame. The camera video corners
 * will be slightly visible but less noticeable than black masks.
 */
export const PipFrame: React.FC<{
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
}> = ({
  borderWidth = 4,
  borderColor = "#22c55e",
  borderRadius = 16,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius,
          boxSizing: "border-box",
          backgroundColor: "transparent",
          boxShadow: `0 0 15px ${borderColor}50`,
        }}
      />
    </AbsoluteFill>
  );
};
