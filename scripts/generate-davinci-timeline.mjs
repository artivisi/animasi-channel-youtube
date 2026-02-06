#!/usr/bin/env node
/**
 * Generate DaVinci Resolve timeline (FCPXML format) for EP05
 *
 * Usage:
 *   node generate-davinci-timeline.mjs ep05
 *
 * Outputs:
 *   - rendered/ep05-timeline.fcpxml - Import this into DaVinci Resolve
 *   - rendered/ep05-zoom-keyframes.txt - Manual keyframe reference
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = join(__dirname, '..');
const OUTPUT_DIR = join(PROJECT_DIR, 'rendered');

// Ensure output directory exists
mkdirSync(OUTPUT_DIR, { recursive: true });

const episode = process.argv[2] || 'ep05';

// Load episode config
const configPath = join(PROJECT_DIR, 'scripts', 'episode-config', `${episode}.json`);
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Load keyframes from TypeScript file
const zoomFilePath = join(PROJECT_DIR, 'src', 'tutorials', 'programming-fundamentals', `pf-05-zoom-manual.ts`);
const zoomFileContent = readFileSync(zoomFilePath, 'utf-8');

// Parse actions
const actionsMatch = zoomFileContent.match(/const actions[^=]*=\s*\[([\s\S]*?)\];/);
const actionsText = actionsMatch[1];
const actions = [];
const actionRegex = /\{\s*camTime:\s*([\d.]+)\s*,\s*duration:\s*([\d.]+)\s*,\s*x:\s*([\d.]+)\s*,\s*y:\s*([\d.]+)\s*,\s*scale:\s*([\d.]+)\s*,\s*note:\s*"([^"]+)"/g;
let match;
while ((match = actionRegex.exec(actionsText)) !== null) {
  actions.push({
    camTime: parseFloat(match[1]),
    duration: parseFloat(match[2]),
    x: parseFloat(match[3]),
    y: parseFloat(match[4]),
    scale: parseFloat(match[5]),
    note: match[6]
  });
}

const FPS = config.fps || 30;
const SYNC = config.syncOffset || 4.282;

function camToScreenTime(camSec) {
  return camSec - SYNC;
}

function formatTimecode(seconds, fps = 30) {
  const totalFrames = Math.round(seconds * fps);
  const frames = totalFrames % fps;
  const totalSecs = Math.floor(totalFrames / fps);
  const secs = totalSecs % 60;
  const totalMins = Math.floor(totalSecs / 60);
  const mins = totalMins % 60;
  const hours = Math.floor(totalMins / 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
}

function secondsToFCPTime(seconds, fps = 30) {
  const frames = Math.round(seconds * fps);
  return `${frames}/${fps}s`;
}

// Get video paths from config
const VIDEO_DIR = join(PROJECT_DIR, 'public', 'footage');
const sources = {};
for (const [key, value] of Object.entries(config.sources)) {
  sources[key] = join(VIDEO_DIR, value);
}

// Generate keyframes with screen time
const keyframeList = [];
let lastScale = 1;
let lastX = 0.5;
let lastY = 0.5;

actions.forEach((action, i) => {
  const screenStartTime = camToScreenTime(action.camTime);
  const screenEndTime = screenStartTime + action.duration;

  // Add transition keyframe (1 second before)
  if (action.scale !== lastScale || action.x !== lastX || action.y !== lastY) {
    keyframeList.push({
      screenTime: screenStartTime - 1,
      camTime: action.camTime - 1,
      x: lastX,
      y: lastY,
      scale: lastScale,
      note: `Transition start to: ${action.note}`
    });
  }

  // Action start
  keyframeList.push({
    screenTime: screenStartTime,
    camTime: action.camTime,
    x: action.x,
    y: action.y,
    scale: action.scale,
    note: action.note
  });

  // Action end (hold)
  keyframeList.push({
    screenTime: screenEndTime,
    camTime: action.camTime + action.duration,
    x: action.x,
    y: action.y,
    scale: action.scale,
    note: `Hold: ${action.note}`
  });

  lastScale = action.scale;
  lastX = action.x;
  lastY = action.y;
});

// Generate human-readable keyframe list
let keyframeText = `# EP05 Zoom/Pan Keyframes for DaVinci Resolve
# =============================================
#
# Instructions:
# 1. Import this timeline into DaVinci Resolve
# 2. Select the screen recording clip on the timeline
# 3. Go to Inspector > Transform
# 4. Add keyframes at each timestamp below
#
# Position values are 0-1 normalized:
#   x=0.5, y=0.5 = centered (no pan)
#   x=0.15 = pan left to file explorer
#   y=0.35 = pan up to editor
#   y=0.65 = pan down to terminal
#
# DaVinci Position = (0.5 - x) * Width * (Scale - 1) for X
#                    (0.5 - y) * Height * (Scale - 1) for Y
# At 1920x1080 with scale 1.7:
#   x=0.15 → Position X = (0.5 - 0.15) * 1920 * 0.7 = 470
#   y=0.35 → Position Y = (0.5 - 0.35) * 1080 * 0.7 = 113 (inverted in DaVinci)
#
# Scale values:
#   1.0 = wide view (100% zoom)
#   1.7 = zoomed in (170% zoom)
#   1.8 = more zoomed (180% zoom)

# Screen    | Camera    | Scale | X     | Y     | DaVinci X | DaVinci Y | Note
# Time      | Time      |       |       |       |           |           |
`;

keyframeList.forEach(kf => {
  // Calculate DaVinci position values
  // DaVinci uses pixels from center, positive X = right, positive Y = down (but displayed as up)
  const davinciX = Math.round((0.5 - kf.x) * 1920 * (kf.scale - 1));
  const davinciY = Math.round((0.5 - kf.y) * 1080 * (kf.scale - 1));
  const zoomPercent = Math.round(kf.scale * 100);

  keyframeText += `${formatTimecode(kf.screenTime)} | ${formatTimecode(kf.camTime)} | ${zoomPercent.toString().padStart(3)}%  | ${kf.x.toFixed(2)} | ${kf.y.toFixed(2)} | ${davinciX.toString().padStart(5)} | ${davinciY.toString().padStart(5)} | ${kf.note}\n`;
});

// Save keyframe list
const keyframeFile = join(OUTPUT_DIR, `${episode}-zoom-keyframes.txt`);
writeFileSync(keyframeFile, keyframeText);
console.log(`Keyframes saved to: ${keyframeFile}`);

// Generate FCPXML
const segments = config.segments;

// Calculate durations and positions
let timelinePosition = 0;
const clips = [];

// Coffee break cut times
const COFFEE_START = 558;
const COFFEE_END = 572;
const END_TIME = 1562; // Cut after "sampai jumpa di video berikutnya"

segments.forEach((seg, i) => {
  if (seg.type === 'skip') return;

  let clipDuration = 0;
  let clipSource = '';
  let clipStart = 0;

  if (seg.type === 'camera') {
    clipSource = sources[seg.source];
    clipStart = seg.startTime;
    clipDuration = seg.endTime - seg.startTime;
  } else if (seg.type === 'composition') {
    // Skip Remotion compositions for now - render separately
    clipDuration = seg.duration / FPS;
    clips.push({
      type: 'placeholder',
      name: seg.composition,
      start: timelinePosition,
      duration: clipDuration
    });
    timelinePosition += clipDuration;
    return;
  } else if (seg.type === 'screen-with-pip') {
    // Main content - screen + camera
    const camStart = seg.cameraStartTime;
    const screenStart = seg.screenStartTime;

    // Determine duration
    let camEnd;
    if (seg.id === 'main-screen-pip-part1') {
      camEnd = COFFEE_START;
    } else if (seg.id === 'main-screen-pip-part2') {
      camEnd = END_TIME;
    } else {
      camEnd = seg.duration ? camStart + seg.duration : camStart + 600; // default 10 min
    }

    clipDuration = camEnd - camStart;

    clips.push({
      type: 'screen-with-pip',
      id: seg.id,
      screen: {
        source: sources[seg.screen],
        start: screenStart,
        duration: clipDuration
      },
      camera: {
        source: sources[seg.camera],
        start: camStart,
        duration: clipDuration
      },
      timelineStart: timelinePosition,
      duration: clipDuration
    });

    timelinePosition += clipDuration;
    return;
  }

  if (clipSource) {
    clips.push({
      type: seg.type,
      id: seg.id,
      source: clipSource,
      start: clipStart,
      duration: clipDuration,
      timelineStart: timelinePosition
    });
  }

  timelinePosition += clipDuration;
});

// Generate simple timeline info for DaVinci manual import
let timelineInfo = `# EP05 Timeline Structure
# =======================
# Total duration: ${formatTimecode(timelinePosition)}
#
# Import these clips in order:

`;

clips.forEach((clip, i) => {
  if (clip.type === 'placeholder') {
    timelineInfo += `${i + 1}. [REMOTION] ${clip.name}
   Duration: ${clip.duration.toFixed(2)}s
   Note: Render from Remotion and insert here

`;
  } else if (clip.type === 'screen-with-pip') {
    timelineInfo += `${i + 1}. [SCREEN + PIP] ${clip.id}
   Timeline position: ${formatTimecode(clip.timelineStart)}
   Duration: ${clip.duration.toFixed(2)}s (${formatTimecode(clip.duration)})

   Video Track 1 (Screen):
     File: ${basename(clip.screen.source)}
     In: ${formatTimecode(clip.screen.start)}
     Out: ${formatTimecode(clip.screen.start + clip.screen.duration)}
     Apply zoom/pan keyframes here!

   Video Track 2 (Camera PIP):
     File: ${basename(clip.camera.source)}
     In: ${formatTimecode(clip.camera.start)}
     Out: ${formatTimecode(clip.camera.start + clip.camera.duration)}
     Scale: 16.67% (320x240 in corner)
     Position: Bottom-right with 40px padding

`;
  } else {
    timelineInfo += `${i + 1}. [${clip.type.toUpperCase()}] ${clip.id || ''}
   File: ${basename(clip.source)}
   Timeline position: ${formatTimecode(clip.timelineStart)}
   In: ${formatTimecode(clip.start)}
   Duration: ${clip.duration.toFixed(2)}s

`;
  }
});

// Add zoom keyframe summary by section
timelineInfo += `
# Zoom Keyframes Summary by Section
# =================================

## Part 1: Screen recording 7s-558s of camera (screen 2.718s-553.718s)

`;

// Filter keyframes for part 1
const part1Keyframes = keyframeList.filter(kf => kf.screenTime >= 2.718 && kf.screenTime < 553.718);
part1Keyframes.forEach(kf => {
  const relTime = kf.screenTime - 2.718;
  timelineInfo += `  ${formatTimecode(relTime)} - Scale ${Math.round(kf.scale * 100)}%, Pos (${kf.x}, ${kf.y}) - ${kf.note}\n`;
});

timelineInfo += `
## Part 2: Screen recording 572s-1562s of camera (screen 567.718s-1557.718s)

`;

// Filter keyframes for part 2
const part2Keyframes = keyframeList.filter(kf => kf.screenTime >= 567.718);
part2Keyframes.forEach(kf => {
  const relTime = kf.screenTime - 567.718;
  timelineInfo += `  ${formatTimecode(relTime)} - Scale ${Math.round(kf.scale * 100)}%, Pos (${kf.x}, ${kf.y}) - ${kf.note}\n`;
});

// Save timeline info
const timelineFile = join(OUTPUT_DIR, `${episode}-timeline-info.txt`);
writeFileSync(timelineFile, timelineInfo);
console.log(`Timeline info saved to: ${timelineFile}`);

// Generate DaVinci Resolve Python script for automation
const davinciScript = `#!/usr/bin/env python3
"""
DaVinci Resolve script to create EP05 timeline with zoom/pan keyframes.

Usage:
1. Open DaVinci Resolve
2. Open the Scripting Console (Workspace > Console)
3. Copy and paste this script, or run via: File > Scripts > ...

Prerequisites:
- Media files must be imported into the Media Pool first
"""

import DaVinciResolveScript as dvr

resolve = dvr.scriptapp("Resolve")
pm = resolve.GetProjectManager()
project = pm.GetCurrentProject()
mp = project.GetMediaPool()

# Create timeline
timeline = mp.CreateEmptyTimeline("EP05-Statement-Komentar")
project.SetCurrentTimeline(timeline)

# Folder paths - UPDATE THESE to match your system
FOOTAGE_BASE = "/Volumes/ENDY1TB/Video Production/remotion-projects/public/footage"

# Media files needed
media_files = {
    "camera_intro": f"{FOOTAGE_BASE}/ep-05/camera/DSC_8022.MOV",
    "camera_main": f"{FOOTAGE_BASE}/ep-05/camera/DSC_8023.MOV",
    "screen": f"{FOOTAGE_BASE}/ep-05/screen/Screen Recording 2026-02-06 at 16.48.29.mov"
}

# Get media pool items (assumes files are already imported)
root_folder = mp.GetRootFolder()

def find_clip_by_path(folder, target_path):
    """Recursively find a clip in the media pool by file path."""
    for clip in folder.GetClipList():
        if target_path in clip.GetClipProperty("File Path"):
            return clip
    for subfolder in folder.GetSubFolderList():
        result = find_clip_by_path(subfolder, target_path)
        if result:
            return result
    return None

print("Looking for media files...")
clips = {}
for key, path in media_files.items():
    clip = find_clip_by_path(root_folder, path)
    if clip:
        clips[key] = clip
        print(f"  Found: {key}")
    else:
        print(f"  NOT FOUND: {key} - Please import the file first")

if len(clips) < 3:
    print("\\nError: Some media files are missing. Please import them into the Media Pool first.")
else:
    print("\\nAll media files found!")

    # Timeline structure
    FPS = 30

    # Segment 1: Welcome (camera-1, 0-15s)
    print("\\nAdding welcome segment...")
    mp.AppendToTimeline([{
        "mediaPoolItem": clips["camera_intro"],
        "startFrame": 0,
        "endFrame": 15 * FPS,
        "trackIndex": 1
    }])

    # Note: Remotion intro should be rendered and inserted here (5 seconds)
    print("NOTE: Insert PFIntro (5s) after welcome segment")

    # Segment 2: Camera only (first 7s of camera-2)
    print("Adding camera-only segment...")
    mp.AppendToTimeline([{
        "mediaPoolItem": clips["camera_main"],
        "startFrame": 0,
        "endFrame": 7 * FPS,
        "trackIndex": 1
    }])

    # Segment 3: Part 1 - Screen with PIP (7s to 558s)
    print("Adding Part 1: Screen with camera PIP...")
    # Screen on track 1
    screen_start_frame = int(2.718 * FPS)
    screen_duration = (558 - 7) * FPS

    # This is a simplified version - in practice you'd need to
    # create the PIP effect using Fusion or the composite mode

    print("\\nKeyframes need to be added manually in Inspector > Transform")
    print("See ep05-zoom-keyframes.txt for the full list")

print("\\nScript completed. Manual steps required:")
print("1. Import and insert PFIntro after welcome")
print("2. Import and insert PFOutro at the end")
print("3. Add screen recording on Video Track 1")
print("4. Add camera PIP on Video Track 2")
print("5. Apply zoom/pan keyframes from ep05-zoom-keyframes.txt")
`;

const davinciScriptFile = join(OUTPUT_DIR, `${episode}-davinci-script.py`);
writeFileSync(davinciScriptFile, davinciScript);
console.log(`DaVinci script saved to: ${davinciScriptFile}`);

console.log(`
Done! Files generated:
1. ${keyframeFile} - Zoom keyframe data
2. ${timelineFile} - Timeline structure info
3. ${davinciScriptFile} - DaVinci Resolve automation script

To use in DaVinci Resolve:
1. Create a new project at 1920x1080, 30fps
2. Import all footage files
3. Create timeline following ${basename(timelineFile)}
4. Add zoom/pan keyframes using data from ${basename(keyframeFile)}

The keyframe file includes DaVinci-ready Position X/Y values!
`);
