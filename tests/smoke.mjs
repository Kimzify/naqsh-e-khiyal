// Loads every page in headless Chromium, plays through a few moments of each couplet,
// and fails if any page throws a JavaScript error. Usage: node tests/smoke.mjs [baseURL]
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:8000/';
const pages = ['', 'hafez/ghazal-1/', 'hafez/ghazal-179/', 'hafez/ghazal-255/'];
const browser = await chromium.launch();
let failed = false;
for (const p of pages) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 760 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base + p);
  await page.waitForTimeout(500);
  const seekable = await page.evaluate(() => typeof window.__seek === 'function');
  if (seekable) {
    for (let t = 1; t < 200; t += 4.5) { await page.evaluate(x => window.__seek(x), t); await page.waitForTimeout(30); }
  }
  console.log(`${errors.length ? 'FAIL' : 'ok  '} /${p}${errors.length ? '\n  ' + errors.join('\n  ') : ''}`);
  if (errors.length) failed = true;
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
