#!/usr/bin/env node
/**
 * Generate FCPXML for DaVinci Resolve import
 * Creates a complete timeline with zoom/pan keyframes that can be imported directly
 *
 * Usage:
 *   node generate-fcpxml.mjs ep05
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join, basename } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = join(__dirname, '..');
const OUTPUT_DIR = join(PROJECT_DIR, 'rendered');

mkdirSync(OUTPUT_DIR, { recursive: true });

const episode = process.argv[2] || 'ep05';

// Load episode config
const configPath = join(PROJECT_DIR, 'scripts', 'episode-config', `${episode}.json`);
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Load keyframes
const zoomFilePath = join(PROJECT_DIR, 'src', 'tutorials', 'programming-fundamentals', `pf-05-zoom-manual.ts`);
const zoomFileContent = readFileSync(zoomFilePath, 'utf-8');

const actionsMatch = zoomFileContent.match(/const actions[^=]*=\s*\[([\s\S]*?)\];/);
const actionsText = actionsMatch[1];
const actions = [];
const actionRegex = /\{\s*camTime:\s*([\d.]+)\s*,\s*duration:\s*([\d.]+)\s*,\s*x:\s*([\d.]+)\s*,\s*y:\s*([\d.]+)\s*,\s*scale:\s*([\d.]+)/g;
let match;
while ((match = actionRegex.exec(actionsText)) !== null) {
  actions.push({
    camTime: parseFloat(match[1]),
    duration: parseFloat(match[2]),
    x: parseFloat(match[3]),
    y: parseFloat(match[4]),
    scale: parseFloat(match[5])
  });
}

const FPS = config.fps || 30;
const SYNC = config.syncOffset || 4.282;
const WIDTH = 1920;
const HEIGHT = 1080;

function camToScreenTime(camSec) {
  return camSec - SYNC;
}

// Generate full keyframe list
function generateKeyframes() {
  const keyframes = [];
  keyframes.push({ time: 0, x: 0.5, y: 0.5, scale: 1 });

  if (actions.length > 0) {
    const firstActionTime = camToScreenTime(actions[0].camTime);
    keyframes.push({ time: firstActionTime - 1, x: 0.5, y: 0.5, scale: 1 });
  }

  let lastEnd = 0;
  let lastScale = 1, lastX = 0.5, lastY = 0.5;

  actions.forEach((action, i) => {
    const startTime = camToScreenTime(action.camTime);
    const endTime = startTime + action.duration;

    // Add zoom out if gap > 5 seconds
    if (i > 0 && startTime - lastEnd > 5) {
      keyframes.push({ time: lastEnd + 1, x: 0.5, y: 0.5, scale: 1 });
      keyframes.push({ time: startTime - 1, x: 0.5, y: 0.5, scale: 1 });
    } else if (action.scale !== lastScale || action.x !== lastX || action.y !== lastY) {
      // Add transition keyframe
      keyframes.push({ time: startTime - 1, x: lastX, y: lastY, scale: lastScale });
    }

    keyframes.push({ time: startTime, x: action.x, y: action.y, scale: action.scale });
    keyframes.push({ time: endTime, x: action.x, y: action.y, scale: action.scale });

    lastEnd = endTime;
    lastScale = action.scale;
    lastX = action.x;
    lastY = action.y;
  });

  keyframes.push({ time: lastEnd + 1, x: 0.5, y: 0.5, scale: 1 });
  keyframes.push({ time: 9999, x: 0.5, y: 0.5, scale: 1 });

  return keyframes.sort((a, b) => a.time - b.time);
}

const allKeyframes = generateKeyframes();

// Convert to FCPXML time format (rational)
function toFCPTime(seconds) {
  const frames = Math.round(seconds * FPS);
  return `${frames}/${FPS}s`;
}

// Convert normalized position to DaVinci/FCPXML position
// FCPXML uses center-based positioning in pixels
function toFCPPosition(x, y, scale) {
  // When scale > 1, we're zooming in, so we need to offset to show the focus point
  // Position = (0.5 - focus) * dimension * (scale - 1)
  const posX = (0.5 - x) * WIDTH * (scale - 1);
  const posY = (0.5 - y) * HEIGHT * (scale - 1);
  return { x: posX, y: -posY }; // Y is inverted in FCPXML
}

// File paths
const VIDEO_DIR = join(PROJECT_DIR, 'public', 'footage');
const sources = {};
for (const [key, value] of Object.entries(config.sources)) {
  sources[key] = join(VIDEO_DIR, value);
}

// Timeline segments
const WELCOME_DURATION = 15;
const INTRO_DURATION = 5;
const CAMERA_ONLY_DURATION = 7;
const COFFEE_START = 558;
const COFFEE_END = 572;
const END_TIME = 1562;

const PART1_CAM_START = 7;
const PART1_CAM_END = COFFEE_START;
const PART1_SCREEN_START = PART1_CAM_START - SYNC;
const PART1_DURATION = PART1_CAM_END - PART1_CAM_START;

const PART2_CAM_START = COFFEE_END;
const PART2_CAM_END = END_TIME;
const PART2_SCREEN_START = PART2_CAM_START - SYNC;
const PART2_DURATION = PART2_CAM_END - PART2_CAM_START;

const OUTRO_DURATION = 6;

// Filter keyframes for each part
function getPartKeyframes(screenStart, duration) {
  return allKeyframes
    .filter(kf => kf.time >= screenStart && kf.time <= screenStart + duration)
    .map(kf => ({ ...kf, time: kf.time - screenStart }));
}

const part1Keyframes = getPartKeyframes(PART1_SCREEN_START, PART1_DURATION);
const part2Keyframes = getPartKeyframes(PART2_SCREEN_START, PART2_DURATION);

// Generate keyframe XML for transform
function generateKeyframeXML(keyframes, paramName, getValue) {
  if (keyframes.length === 0) return '';

  let xml = `                <param name="${paramName}">\n`;

  keyframes.forEach((kf, i) => {
    const value = getValue(kf);
    const time = toFCPTime(kf.time);
    const interp = i === 0 ? 'linear' : 'linear';
    xml += `                  <keyframe time="${time}" value="${value}" interp="${interp}"/>\n`;
  });

  xml += `                </param>\n`;
  return xml;
}

// Helper to convert path to proper file URL
function toFileURL(filePath) {
  return pathToFileURL(filePath).href;
}

// Build FCPXML
let fcpxml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <resources>
    <format id="r1" name="FFVideoFormat1080p30" frameDuration="${toFCPTime(1/FPS)}" width="${WIDTH}" height="${HEIGHT}"/>
    <asset id="camera_intro" name="DSC_8022.MOV" src="${toFileURL(sources['camera-intro'])}" hasVideo="1" hasAudio="1"/>
    <asset id="camera_main" name="DSC_8023.MOV" src="${toFileURL(sources.camera)}" hasVideo="1" hasAudio="1"/>
    <asset id="screen" name="Screen Recording" src="${toFileURL(sources.screen)}" hasVideo="1" hasAudio="1"/>
    <asset id="intro" name="intro.mov" src="${toFileURL(join(OUTPUT_DIR, 'overlays-ep05/intro.mov'))}" hasVideo="1" hasAudio="0"/>
    <asset id="outro" name="outro.mov" src="${toFileURL(join(OUTPUT_DIR, 'overlays-ep05/outro.mov'))}" hasVideo="1" hasAudio="0"/>
  </resources>
  <library>
    <event name="EP05 Import">
      <project name="EP05-Statement-Komentar">
        <sequence format="r1" tcStart="0s" tcFormat="NDF">
          <spine>
`;

let timelinePos = 0;

// 1. Welcome (camera-1)
fcpxml += `            <!-- Welcome: Camera 1, 0-15s -->
            <asset-clip name="Welcome" ref="camera_intro" offset="${toFCPTime(timelinePos)}" duration="${toFCPTime(WELCOME_DURATION)}" start="0s" audioRole="dialogue"/>
`;
timelinePos += WELCOME_DURATION;

// 2. Intro
fcpxml += `            <!-- Series Intro -->
            <asset-clip name="PFIntro" ref="intro" offset="${toFCPTime(timelinePos)}" duration="${toFCPTime(INTRO_DURATION)}" start="0s"/>
`;
timelinePos += INTRO_DURATION;

// 3. Camera only (first 7s of camera-2)
fcpxml += `            <!-- Camera Only: First 7s -->
            <asset-clip name="Camera Only" ref="camera_main" offset="${toFCPTime(timelinePos)}" duration="${toFCPTime(CAMERA_ONLY_DURATION)}" start="0s" audioRole="dialogue"/>
`;
timelinePos += CAMERA_ONLY_DURATION;

// 4. Part 1: Screen with PIP
fcpxml += `            <!-- Part 1: Screen with PIP, 7s-558s -->
            <asset-clip name="Screen Part1" ref="screen" offset="${toFCPTime(timelinePos)}" duration="${toFCPTime(PART1_DURATION)}" start="${toFCPTime(PART1_SCREEN_START)}">
              <!-- Zoom/Pan Transform Keyframes -->
              <adjust-transform>
`;

// Add keyframes for Part 1
part1Keyframes.forEach(kf => {
  const pos = toFCPPosition(kf.x, kf.y, kf.scale);
  fcpxml += `                <param name="scale" keyTime="${toFCPTime(kf.time)}" value="${kf.scale} ${kf.scale}"/>
                <param name="position" keyTime="${toFCPTime(kf.time)}" value="${pos.x.toFixed(1)} ${pos.y.toFixed(1)}"/>
`;
});

fcpxml += `              </adjust-transform>
              <!-- Camera PIP -->
              <video name="Camera PIP Part1" ref="camera_main" offset="0s" duration="${toFCPTime(PART1_DURATION)}" start="${toFCPTime(PART1_CAM_START)}" lane="1">
                <adjust-transform scale="0.167 0.167" position="${WIDTH/2 - 160 - 40} ${-HEIGHT/2 + 120 + 40}"/>
              </video>
            </asset-clip>
`;

// Note: Part 1 audio from camera
fcpxml += `            <audio name="Part1 Audio" ref="camera_main" offset="${toFCPTime(timelinePos)}" duration="${toFCPTime(PART1_DURATION)}" start="${toFCPTime(PART1_CAM_START)}" role="dialogue" lane="-1"/>
`;
timelinePos += PART1_DURATION;

// 5. Part 2: Screen with PIP
fcpxml += `            <!-- Part 2: Screen with PIP, 572s-1562s -->
            <asset-clip name="Screen Part2" ref="screen" offset="${toFCPTime(timelinePos)}" duration="${toFCPTime(PART2_DURATION)}" start="${toFCPTime(PART2_SCREEN_START)}">
              <adjust-transform>
`;

part2Keyframes.forEach(kf => {
  const pos = toFCPPosition(kf.x, kf.y, kf.scale);
  fcpxml += `                <param name="scale" keyTime="${toFCPTime(kf.time)}" value="${kf.scale} ${kf.scale}"/>
                <param name="position" keyTime="${toFCPTime(kf.time)}" value="${pos.x.toFixed(1)} ${pos.y.toFixed(1)}"/>
`;
});

fcpxml += `              </adjust-transform>
              <video name="Camera PIP Part2" ref="camera_main" offset="0s" duration="${toFCPTime(PART2_DURATION)}" start="${toFCPTime(PART2_CAM_START)}" lane="1">
                <adjust-transform scale="0.167 0.167" position="${WIDTH/2 - 160 - 40} ${-HEIGHT/2 + 120 + 40}"/>
              </video>
            </asset-clip>
`;

fcpxml += `            <audio name="Part2 Audio" ref="camera_main" offset="${toFCPTime(timelinePos)}" duration="${toFCPTime(PART2_DURATION)}" start="${toFCPTime(PART2_CAM_START)}" role="dialogue" lane="-1"/>
`;
timelinePos += PART2_DURATION;

// 6. Outro
fcpxml += `            <!-- Series Outro -->
            <asset-clip name="PFOutro" ref="outro" offset="${toFCPTime(timelinePos)}" duration="${toFCPTime(OUTRO_DURATION)}" start="0s"/>
`;
timelinePos += OUTRO_DURATION;

fcpxml += `          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
`;

const outputPath = join(OUTPUT_DIR, `${episode}-timeline.fcpxml`);
writeFileSync(outputPath, fcpxml);
console.log(`FCPXML saved to: ${outputPath}`);
console.log(`Total duration: ${Math.floor(timelinePos/60)}m ${Math.round(timelinePos%60)}s`);
console.log(`
To import in DaVinci Resolve:
1. File > Import > Timeline... > Select ${basename(outputPath)}
2. Check that media is linked correctly
3. Render: Deliver > Add to Render Queue
`);
