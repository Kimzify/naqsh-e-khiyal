// Focused regression checks for Saadi Ghazal 187: No Retreat.
// Usage: node tests/saadi-187.mjs [baseURL]
// Optional: SCREENSHOTS=/tmp/no-retreat-review node tests/saadi-187.mjs
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:8000/';
const screenshots = process.env.SCREENSHOTS;
if (screenshots) await mkdir(screenshots, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('pageerror', e => { errors.push(e.stack || e.message); console.error(e.stack || e.message); });
// Observe the synthesized output without changing the score or production code.
await page.addInitScript(() => {
  const Native = window.AudioContext;
  if (!Native) return;
  window.AudioContext = class extends Native {
    constructor(...args) {
      super(...args);
      const analyser = this.createAnalyser();
      analyser.fftSize = 2048;
      analyser.connect(this.destination);
      window.__audioProbe = { analyser, context: this };
      const create = this.createDynamicsCompressor.bind(this);
      this.createDynamicsCompressor = () => {
        const node = create(), connect = node.connect.bind(node);
        node.connect = destination => connect(destination === this.destination ? analyser : destination);
        return node;
      };
    }
  };
});
const seek = async t => {
  await page.evaluate(t => window.__seek(t), t);
  await page.waitForTimeout(50);
};
const running = () => page.locator('body').evaluate(el => el.classList.contains('running'));
const position = () => page.locator('#seek').inputValue().then(Number);
const canvas = () => page.locator('#canvas').evaluate(c => c.toDataURL());
const snap = async name => { if (screenshots) await page.screenshot({ path: `${screenshots}/${name}.png` }); };
const rms = () => page.evaluate(() => {
  const a = window.__audioProbe?.analyser;
  if (!a) return 0;
  const data = new Float32Array(a.fftSize);
  a.getFloatTimeDomainData(data);
  return Math.sqrt(data.reduce((sum, x) => sum + x * x, 0) / data.length);
});

try {
  await page.goto(new URL('saadi/ghazal-187/', base).href);
  await page.evaluate(() => document.fonts.ready);
  await snap('desktop-intro');
  assert.deepEqual(await page.evaluate(() => window.__poemInfo), {
    couplets: 8, secondsPerCouplet: 22, duration: 176,
  });

  await page.click('#intro-read');
  assert.equal(await page.locator('#reading').evaluate(d => d.open), true);
  assert.equal(await page.locator('.couplet').count(), 8);
  assert.equal(await page.locator('.couplet .translation').count(), 8);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#reading').evaluate(d => d.open), false);
  assert.equal(await page.locator('#intro-read').evaluate(el => el === document.activeElement), true);

  for (const [name, width, height] of [
    ['desktop', 1440, 1000], ['mobile', 390, 844], ['small', 320, 568], ['landscape', 844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    for (let b = 0; b < 8; b++) {
      for (const t of [0.5, 7, 16, 21.5]) {
        await seek(b * 22 + t);
        const geometry = await page.evaluate(() => {
          const rect = id => document.getElementById(id).getBoundingClientRect();
          const f = rect('film'), c = rect('caption'), v = rect('verse'), bar = rect('transport');
          return { width: innerWidth, scroll: document.body.scrollWidth, filmBottom: f.bottom,
            captionTop: c.top, captionBottom: c.bottom, barTop: bar.top,
            verseLeft: v.left, verseRight: v.right, filmHeight: f.height,
            words: [...document.querySelectorAll('#verse .word')].map(el => {
              const r = el.getBoundingClientRect(); return [r.left, r.right, r.bottom];
            }) };
        });
        assert(geometry.scroll <= width + 1, `${name}: horizontal overflow`);
        assert(geometry.filmHeight > 90, `${name}: no room for artwork`);
        assert(geometry.filmBottom <= geometry.captionTop + 2, `${name}: art overlaps caption`);
        assert(geometry.captionBottom <= geometry.barTop + 2, `${name}: caption overlaps controls`);
        for (const [left, right, bottom] of geometry.words) {
          assert(left >= -1 && right <= width + 1, `${name}: clipped verse word`);
          assert(bottom <= geometry.barTop, `${name}: verse word beneath controls`);
        }
        assert.match(await page.locator('#scene-title').textContent(), new RegExp(`^0${b + 1} /`));
        if (t === 16) await snap(`${name}-${b + 1}`);
      }
    }
    console.log(`ok   ${name}: all eight scenes, four moments, caption geometry`);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const t of [16, 38, 60, 82, 104, 126, 148, 170]) {
    await seek(t);
    const first = await canvas();
    await seek((t + 51) % 176);
    await seek(t);
    assert.equal(await canvas(), first, `Non-deterministic frame at ${t}s`);
  }
  await seek(-100);
  assert.equal(await position(), 0);
  await seek(10000);
  assert((await position()) < 176);
  await seek(38);
  const frozen = await canvas();
  await page.waitForTimeout(180);
  assert.equal(await canvas(), frozen, 'Paused artwork changed');
  console.log('ok   deterministic seeking, clamped bounds, paused frames');

  await page.click('#play');
  assert(await running());
  await page.keyboard.press('Space');
  assert.equal(await running(), false);
  await page.keyboard.press('ArrowRight');
  assert.equal(await position(), 44);
  await page.keyboard.press('ArrowLeft');
  assert.equal(await position(), 22);
  assert.equal(await running(), false, 'Chapter navigation unexpectedly resumed playback');
  await page.click('#read');
  await page.locator('.couplet').nth(3).click();
  assert(await running());
  assert.match(await page.locator('#scene-title').textContent(), /^04 /);
  await page.click('#read');
  assert.equal(await running(), false);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.body.classList.contains('running'));
  assert(await running(), 'Reading dialog did not restore playback');
  console.log('ok   keyboard navigation, reading dialog, pause/resume');

  // A fresh phrase should make actual samples, not merely create an AudioContext.
  await seek(1.8);
  await page.click('#play');
  await page.waitForTimeout(1400);
  const audible = await rms();
  assert(audible > 0.0001, `No synthesized audio (${audible})`);
  await page.click('#sound');
  await page.waitForTimeout(650);
  assert((await rms()) < audible * 0.12, 'Mute did not silence output');
  await seek(24);
  await page.click('#play');
  await page.waitForTimeout(500);
  assert.equal(await page.locator('#sound').getAttribute('aria-pressed'), 'false');
  assert((await rms()) < 0.0001, 'Seeking lost mute state');
  await page.click('#sound');
  await page.waitForTimeout(700);
  assert((await rms()) > 0.0001, 'Unmute did not restore output');
  await page.click('#play');
  await page.waitForTimeout(200);
  assert((await rms()) < 0.00001, 'Paused voices leaked into output');
  console.log('ok   synthesized audio, mute persistence, no sound after pause');

  await seek(175.7);
  await page.click('#play');
  await page.waitForTimeout(900);
  assert.equal(await page.locator('#ending').isVisible(), true);
  await page.click('#replay');
  assert(await running());
  assert((await position()) < 1);
  await seek(16);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seek(3);
  const still = await canvas();
  await seek(16);
  assert.equal(await canvas(), still, 'Reduced-motion scene still animates');
  await seek(38);
  assert.notEqual(await canvas(), still, 'Reduced motion prevented chapter changes');
  console.log('ok   ending/replay and reduced-motion stills');
  assert.deepEqual(errors, [], 'Browser errors');
} finally {
  await browser.close();
}
