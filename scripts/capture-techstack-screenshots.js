const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '../src/tutorials/vlog/assets/screenshots');

async function captureScreenshots() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  const screenshots = [
    // Backend
    {
      name: 'postgresql-homepage',
      url: 'https://www.postgresql.org/',
      waitFor: 2000,
    },
    {
      name: 'docker-homepage',
      url: 'https://docs.docker.com/',
      waitFor: 3000,
      waitUntil: 'domcontentloaded', // docker.com blocks networkidle
    },
    {
      name: 'spring-boot-homepage',
      url: 'https://spring.io/projects/spring-boot',
      waitFor: 3000,
    },
    {
      name: 'golang-homepage',
      url: 'https://go.dev/',
      waitFor: 2000,
    },
    {
      name: 'htmx-homepage',
      url: 'https://htmx.org/',
      waitFor: 2000,
    },
    {
      name: 'alpinejs-homepage',
      url: 'https://alpinejs.dev/',
      waitFor: 2000,
    },
    // Dev Tools
    {
      name: 'testcontainers-homepage',
      url: 'https://testcontainers.com/',
      waitFor: 2000,
    },
    {
      name: 'sonarcloud-homepage',
      url: 'https://sonarcloud.io/',
      waitFor: 5000,
      waitUntil: 'load', // sonarcloud blocks networkidle
    },
    {
      name: 'zap-proxy-homepage',
      url: 'https://www.zaproxy.org/',
      waitFor: 2000,
    },
    {
      name: 'github-actions-homepage',
      url: 'https://github.com/features/actions',
      waitFor: 3000,
    },
  ];

  for (const item of screenshots) {
    console.log(`Capturing: ${item.name} from ${item.url}`);
    try {
      await page.goto(item.url, { waitUntil: item.waitUntil || 'networkidle', timeout: 30000 });
      await page.waitForTimeout(item.waitFor || 2000);

      // Close any cookie banners or popups
      try {
        const cookieButtons = await page.$$('button:has-text("Accept"), button:has-text("Got it"), button:has-text("Close"), [aria-label="Close"]');
        for (const btn of cookieButtons) {
          await btn.click().catch(() => {});
        }
        await page.waitForTimeout(500);
      } catch (e) {
        // Ignore popup dismissal errors
      }

      const filePath = path.join(ASSETS_DIR, `${item.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`  Saved: ${filePath}`);
    } catch (error) {
      console.error(`  Error capturing ${item.name}: ${error.message}`);
    }
  }

  await browser.close();
  console.log('\nDone! Screenshots saved to:', ASSETS_DIR);
}

captureScreenshots().catch(console.error);
