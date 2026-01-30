/**
 * Video file paths for Programming Fundamentals series.
 *
 * Using --public-dir flag to point directly to external drive.
 * Render command: npx remotion render ... --public-dir="/Volumes/ENDY1TB/Video Production/seri-programming-fundamental"
 */

import { staticFile } from "remotion";

function getPath(relativePath: string): string {
  return staticFile(relativePath);
}

export const VIDEO_PATHS = {
  // Episode 1
  "pf-01-camera": getPath("ep-01/camera/DSC_8013.MOV"),

  // Episode 2
  "pf-02-camera-1": getPath("ep-02/camera/DSC_8014.MOV"),
  "pf-02-camera-2": getPath("ep-02/camera/DSC_8015.MOV"),
  "pf-02-screen-1": getPath("ep-02/screen/Screen Recording 2026-01-30 at 10.35.40.mov"),
  "pf-02-screen-2": getPath("ep-02/screen/Screen Recording 2026-01-30 at 11.02.07.mov"),

  // Episode 3
  "pf-03-camera": getPath("ep-03/camera/DSC_8016.MOV"),
} as const;

export type VideoKey = keyof typeof VIDEO_PATHS;

export function getVideoPath(key: VideoKey): string {
  return VIDEO_PATHS[key];
}
