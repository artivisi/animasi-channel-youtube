const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '../src/tutorials/cloud-linux-network/assets/screenshots');

async function captureScreenshots() {
  // Ensure directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // Retina quality
  });

  const page = await context.newPage();

  const screenshots = [
    // Episode 2: Ubuntu screenshots (website only, actual OS screenshots need VM)
    {
      name: 'M1E2-ubuntu-download',
      url: 'https://ubuntu.com/download/desktop',
      waitFor: 3000,
    },
    {
      name: 'M1E2-ubuntu-server-download',
      url: 'https://ubuntu.com/download/server',
      waitFor: 3000,
    },
    // Episode 3: Virtualization software websites
    {
      name: 'M1E3-06-virtualbox-download',
      url: 'https://www.virtualbox.org/wiki/Downloads',
      waitFor: 2000,
    },
    {
      name: 'M1E3-07-vmware-workstation',
      url: 'https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion',
      waitFor: 3000,
    },
    {
      name: 'M1E3-08-hyper-v-docs',
      url: 'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/',
      waitFor: 2000,
    },
    {
      name: 'M1E3-09-parallels',
      url: 'https://www.parallels.com/',
      waitFor: 3000,
    },
    {
      name: 'M1E3-10-docker',
      url: 'https://www.docker.com/',
      waitFor: 3000,
    },
    // Additional useful screenshots
    {
      name: 'M1E3-utm-mac',
      url: 'https://mac.getutm.app/',
      waitFor: 2000,
    },
    {
      name: 'M1E3-podman',
      url: 'https://podman.io/',
      waitFor: 2000,
    },
  ];

  for (const item of screenshots) {
    console.log(`Capturing: ${item.name} from ${item.url}`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle', timeout: 30000 });
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

      if (item.selector) {
        const element = await page.$(item.selector);
        if (element) {
          await element.screenshot({ path: filePath });
        } else {
          console.log(`  Selector not found, taking full screenshot`);
          await page.screenshot({ path: filePath, fullPage: false });
        }
      } else {
        await page.screenshot({ path: filePath, fullPage: false });
      }

      console.log(`  Saved: ${filePath}`);
    } catch (error) {
      console.error(`  Error capturing ${item.name}: ${error.message}`);
    }
  }

  await browser.close();
  console.log('\nDone! Screenshots saved to:', ASSETS_DIR);
  console.log('\nNote: The following screenshots require manual capture:');
  console.log('  - Ubuntu Desktop (fresh install in VirtualBox)');
  console.log('  - Ubuntu Server login prompt (in VirtualBox)');
  console.log('  - BIOS virtualization setting');
  console.log('  - VirtualBox Manager interface');
}

captureScreenshots().catch(console.error);
