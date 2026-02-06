import { ZoomPoint } from "../../components";

/**
 * Manual zoom/pan keyframes for EP05
 *
 * Screen time = Camera time - 4.282s
 * Frame = Screen time * 30
 *
 * Focus positions (VSCode layout):
 *   - Wide view:     x=0.5,  y=0.5,  scale=1
 *   - File explorer: x=0.15, y=0.4,  scale=1.5
 *   - Editor:        x=0.5,  y=0.35, scale=1.5
 *   - Terminal:      x=0.5,  y=0.75, scale=1.5
 *
 * Transition timing:
 *   - 1 second (30 frames) for zoom in/out
 *   - Pan while zoomed: instant position change is fine
 */

const FPS = 30;
const SYNC = 4.282;

// Helper: camera time to screen frame
const camToFrame = (camSec: number) => Math.round((camSec - SYNC) * FPS);

// Define actions with camera timestamps for easier reference to transcript
const actions: Array<{
  camTime: number;      // Camera time in seconds (from transcript)
  duration: number;     // How long to hold (seconds)
  x: number;
  y: number;
  scale: number;
  note: string;
}> = [
  // ===== JAVA SECTION =====

  // 2:14 - Open Java file in explorer
  { camTime: 134, duration: 5, x: 0.15, y: 0.4, scale: 1.5, note: "Open Java file - file explorer" },

  // 2:17 - Show semicolon in editor
  { camTime: 142, duration: 10, x: 0.5, y: 0.35, scale: 1.8, note: "Show semicolon requirement" },

  // 2:35 - First java command (wrong folder)
  { camTime: 160, duration: 10, x: 0.5, y: 0.65, scale: 1.8, note: "java hello.java - wrong folder" },

  // 2:46 - Look at file explorer to see folder structure
  { camTime: 175, duration: 5, x: 0.15, y: 0.4, scale: 1.7, note: "File explorer - see folder structure" },

  // 2:56 - cd and run java (correct folder)
  { camTime: 181, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "cd + java hello.java - success" },

  // 3:04 - Delete semicolon in editor
  { camTime: 188, duration: 5, x: 0.5, y: 0.35, scale: 1.7, note: "Delete semicolon to show error" },

  // 3:09 - Show error in terminal
  { camTime: 194, duration: 10, x: 0.5, y: 0.75, scale: 1.7, note: "Show semicolon error message" },

  // 3:38 - Fix semicolon
  { camTime: 224, duration: 3, x: 0.5, y: 0.35, scale: 1.7, note: "Add semicolon back" },

  // 3:41 - Run again
  { camTime: 227, duration: 5, x: 0.5, y: 0.75, scale: 1.7, note: "java hello.java - fixed" },

  // 3:45 - Add second statement
  { camTime: 235, duration: 15, x: 0.5, y: 0.35, scale: 1.7, note: "Add second print statement" },

  // 4:01 - Run with two statements
  { camTime: 246, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "Run - two statements output" },

  // 4:37 - Combine to one line (no whitespace matters)
  { camTime: 282, duration: 8, x: 0.5, y: 0.35, scale: 1.7, note: "Combine code to one line" },

  // 4:45 - Run combined code
  { camTime: 290, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "Run combined - still works" },

  // 5:20 - Show error when keywords merged
  { camTime: 324, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "Error - voidmain merged" },

  // 6:32 - Format document (right-click menu)
  { camTime: 397, duration: 8, x: 0.5, y: 0.4, scale: 1.7, note: "Right-click - Format Document" },

  // 7:02 - Add comment in editor
  { camTime: 426, duration: 10, x: 0.5, y: 0.35, scale: 1.7, note: "Add single-line comment" },

  // 7:50 - Multi-line comment
  { camTime: 475, duration: 10, x: 0.5, y: 0.35, scale: 1.7, note: "Add multi-line comment" },

  // ===== JAVASCRIPT SECTION =====

  // 10:19 - Open JavaScript file
  { camTime: 624, duration: 5, x: 0.15, y: 0.4, scale: 1.7, note: "Open hello.js - file explorer" },

  // 10:25 - Show JS code in editor
  { camTime: 629, duration: 5, x: 0.5, y: 0.35, scale: 1.7, note: "Show console.log code" },

  // 10:31 - Run node hello.js
  { camTime: 635, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "node hello.js" },

  // 10:44 - Error when combined without semicolon
  { camTime: 649, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "Error - missing semicolon" },

  // 11:07 - Editor hint about semicolon
  { camTime: 672, duration: 5, x: 0.5, y: 0.35, scale: 1.7, note: "Editor shows semicolon hint" },

  // 11:11 - Add semicolon
  { camTime: 676, duration: 5, x: 0.5, y: 0.35, scale: 1.7, note: "Add semicolon" },

  // 11:25 - Run again
  { camTime: 689, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "Run - now works" },

  // 11:37 - One statement per line (no semicolon needed)
  { camTime: 701, duration: 8, x: 0.5, y: 0.35, scale: 1.7, note: "One statement per line" },

  // 11:48 - Run without semicolons
  { camTime: 713, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "Run - works without semicolon" },

  // 12:18 - JavaScript comments
  { camTime: 743, duration: 10, x: 0.5, y: 0.35, scale: 1.7, note: "Add JS comments (same as Java)" },

  // ===== PYTHON SECTION =====

  // 13:43 - Switch to Python
  { camTime: 828, duration: 5, x: 0.15, y: 0.4, scale: 1.7, note: "Open hello.py - file explorer" },

  // 13:49 - Show Python code
  { camTime: 834, duration: 5, x: 0.5, y: 0.35, scale: 1.7, note: "Python - no semicolon needed" },

  // ~13:54 - "coba kita kasih titik koma" - typing semicolon
  { camTime: 840, duration: 5, x: 0.5, y: 0.5, scale: 1, note: "Wide view - typing semicolon test" },

  // 14:01 - Run python hello.py
  { camTime: 845, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "python hello.py" },

  // 14:14 - after "coba kita tes" - zoom to terminal
  { camTime: 859, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "Run python - after coba kita tes" },

  // ~14:19 - After "error ya", switch to wide view to show code editing
  { camTime: 865, duration: 10, x: 0.5, y: 0.5, scale: 1, note: "Wide view - edit code after error" },

  // 14:34 - Indentation error
  { camTime: 879, duration: 8, x: 0.5, y: 0.65, scale: 1.7, note: "IndentationError - unexpected indent" },

  // 14:50 - Explain indentation significance
  { camTime: 895, duration: 10, x: 0.5, y: 0.35, scale: 1.7, note: "Python indentation is significant" },

  // 15:31 - Python comments with hash
  { camTime: 936, duration: 5, x: 0.5, y: 0.35, scale: 1.7, note: "Python comment - hash/pagar" },

  // 15:48 - Show hash symbol
  { camTime: 953, duration: 8, x: 0.5, y: 0.35, scale: 1.7, note: "Type comment with #" },

  // 16:03 - Multi-line docstring
  { camTime: 967, duration: 10, x: 0.5, y: 0.35, scale: 1.7, note: "Multi-line docstring with triple quotes" },

  // ===== COMPARISON/CLOSING SECTION =====

  // 18:27 - Test Java with odd indentation
  { camTime: 1112, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "Java - indentation doesn't matter" },

  // 18:37 - Test JavaScript with odd indentation
  { camTime: 1122, duration: 5, x: 0.5, y: 0.65, scale: 1.7, note: "JS - indentation doesn't matter" },

  // 18:50 - Test Python with indentation (error)
  { camTime: 1135, duration: 8, x: 0.5, y: 0.65, scale: 1.7, note: "Python - indentation error" },

];

// Generate keyframes from actions
export const pf_05_intelligentZoomKeyframes: ZoomPoint[] = (() => {
  const keyframes: ZoomPoint[] = [];

  // Start wide and STAY wide until first action
  keyframes.push({ frame: 0, x: 0.5, y: 0.5, scale: 1 });

  if (actions.length > 0) {
    const firstActionFrame = camToFrame(actions[0].camTime);
    // Stay wide until 1 second before first action
    keyframes.push({ frame: firstActionFrame - FPS, x: 0.5, y: 0.5, scale: 1 });
  }

  let lastEnd = 0;

  actions.forEach((action, i) => {
    const startFrame = camToFrame(action.camTime);
    const endFrame = startFrame + action.duration * FPS;

    // If there's a gap > 5 seconds from last action, zoom out first
    if (i > 0 && startFrame - lastEnd > 5 * FPS) {
      // Zoom out after last action
      keyframes.push({ frame: lastEnd + FPS, x: 0.5, y: 0.5, scale: 1 });
      // Stay wide until this action
      keyframes.push({ frame: startFrame - FPS, x: 0.5, y: 0.5, scale: 1 });
    }

    // Zoom/pan to target
    keyframes.push({ frame: startFrame, x: action.x, y: action.y, scale: action.scale });

    // Hold position
    keyframes.push({ frame: endFrame, x: action.x, y: action.y, scale: action.scale });

    lastEnd = endFrame;
  });

  // End wide
  keyframes.push({ frame: lastEnd + FPS, x: 0.5, y: 0.5, scale: 1 });
  keyframes.push({ frame: 50000, x: 0.5, y: 0.5, scale: 1 });

  return keyframes;
})();
