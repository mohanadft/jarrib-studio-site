import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import { serve } from './helpers/serve.mjs';

let server;
let browser;

before(async () => {
  server = await serve();
  browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
});

after(async () => {
  await browser?.close();
  await server?.close();
});

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function open({ width = 390, height = 844, reduced = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(server.url, { waitUntil: 'networkidle0' });
  return page;
}

// Returns { kind, src, text, active } describing the phone and dots.
const state = (page) => page.evaluate(() => {
  const img = document.querySelector('#phone-screen img');
  return {
    src: img ? img.getAttribute('src') : null,
    text: document.querySelector('#phone-screen').textContent,
    active: [...document.querySelectorAll('#dots .dot')].findIndex((d) => d.classList.contains('is-active')),
    current: [...document.querySelectorAll('#dots .dot')].map((d) => d.getAttribute('aria-current')),
    down: document.querySelector('#press').classList.contains('is-down'),
  };
});

function assertSlide(s, i) {
  if (i === 0) assert.match(s.src, /reel-arm\.webp$/);
  if (i === 1) assert.match(s.src, /reel-head\.webp$/);
  if (i === 2) { assert.equal(s.src, null); assert.ok(s.text.includes('براندك')); }
  assert.equal(s.active, i);
  assert.deepEqual(s.current, [0, 1, 2].map((n) => (n === i ? 'true' : null)));
}

test('nextIndex wraps', async () => {
  const page = await open();
  const r = await page.evaluate(async () => {
    const m = await import('/js/hero.js');
    return { wrap: m.nextIndex(2), step: m.nextIndex(0), len: m.SLIDES.length };
  });
  assert.deepEqual(r, { wrap: 0, step: 1, len: 3 });
  await page.close();
});

test('click cycles', async () => {
  const page = await open();
  assertSlide(await state(page), 0);
  for (const i of [1, 2, 0]) {
    await page.click('#press');
    await sleep(200);
    assertSlide(await state(page), i);
  }
  await page.close();
});

test('rapid presses do not desync', async () => {
  const page = await open();
  await page.evaluate(() => { for (let i = 0; i < 5; i++) document.querySelector('#press').click(); });
  await sleep(400);
  const s = await state(page);
  assertSlide(s, 5 % 3);
  assert.equal(s.down, false);
  await page.close();
});

test('keyboard advances', async () => {
  const page = await open();
  await page.focus('#press');
  await page.keyboard.press('Enter');
  await sleep(200);
  assertSlide(await state(page), 1);
  await page.keyboard.press('Space');
  await sleep(200);
  assertSlide(await state(page), 2);
  await page.close();
});

test('reduced motion still advances', async () => {
  const page = await open({ reduced: true });
  await page.click('#press');
  await sleep(50);
  assertSlide(await state(page), 1);
  await page.close();
});

test('no horizontal overflow at 320 and 390', async () => {
  for (const width of [320, 390, 1440]) {
    const page = await open({ width });
    const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    assert.ok(sw <= iw, `overflow at ${width}: scrollWidth ${sw} > ${iw}`);
    await page.close();
  }
});

test('no console errors and no 404s', async () => {
  const page = await browser.newPage();
  const problems = [];
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url().startsWith(server.url)) problems.push(`${r.status()} ${r.url()}`);
  });
  page.on('requestfailed', (r) => {
    if (r.url().startsWith(server.url)) problems.push(`failed ${r.url()}`);
  });
  await page.goto(server.url, { waitUntil: 'networkidle0' });
  assert.deepEqual(problems, []);
  await page.close();
});
