/**
 * Video file paths for Programming Fundamentals series.
 *
 * Footage is stored in public/footage/ within the project.
 * Remotion serves files from public/ directory by default.
 */

import { staticFile } from "remotion";

export const VIDEO_PATHS = {
  // Episode 1
  "pf-01-camera": staticFile("footage/ep-01/camera/DSC_8013.MOV"),

  // Episode 2
  "pf-02-camera-1": staticFile("footage/ep-02/camera/DSC_8014.MOV"),
  "pf-02-camera-2": staticFile("footage/ep-02/camera/DSC_8015.MOV"),
  "pf-02-screen-1": staticFile("footage/ep-02/screen/Screen Recording 2026-01-30 at 10.35.40.mov"),
  "pf-02-screen-2": staticFile("footage/ep-02/screen/Screen Recording 2026-01-30 at 11.02.07.mov"),

  // Episode 3
  "pf-03-camera": staticFile("footage/ep-03/camera/DSC_8016.MOV"),
} as const;

export type VideoKey = keyof typeof VIDEO_PATHS;

export function getVideoPath(key: VideoKey): string {
  return VIDEO_PATHS[key];
}
