#!/usr/bin/env node
/**
 * Capture PIP frame border as PNG using Puppeteer
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'public', 'assets', 'pip-frame.png');

const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body {
      width: 392px;
      height: 298px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .frame {
      width: 384px;
      height: 290px;
      border: 4px solid #22c55e;
      border-radius: 16px;
      box-shadow: 0 0 30px rgba(34, 197, 94, 0.4), 0 10px 40px rgba(0,0,0,0.5);
      box-sizing: border-box;
      background: transparent;
    }
  </style>
</head>
<body>
  <div class="frame"></div>
</body>
</html>
`;

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 392, height: 298 });
  await page.setContent(html);

  const screenshot = await page.screenshot({
    type: 'png',
    omitBackground: true, // Transparent background
  });

  writeFileSync(outputPath, screenshot);
  console.log(`Saved: ${outputPath}`);

  await browser.close();
}

main().catch(console.error);
