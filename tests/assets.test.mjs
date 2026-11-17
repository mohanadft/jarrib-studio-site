import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync, existsSync } from "node:fs";

const KB = 1024;
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url));

const webps = {
  "assets/img/reel-arm.webp": 120 * KB,
  "assets/img/reel-head.webp": 120 * KB,
  "assets/img/proof-ig-30d.webp": 160 * KB,
  "assets/img/proof-whistle.webp": 160 * KB,
};
const woff2 = ["assets/fonts/thmanyah-bold.woff2", "assets/fonts/thmanyah-medium.woff2"];
const all = [...Object.keys(webps), ...woff2, "favicon.svg", "favicon-32.png", "apple-touch-icon.png"];

for (const p of all) {
  test(`${p} exists and is non-empty`, () => {
    assert.ok(existsSync(new URL(`../${p}`, import.meta.url)), "missing");
    assert.ok(statSync(new URL(`../${p}`, import.meta.url)).size > 0);
  });
}

for (const [p, max] of Object.entries(webps)) {
  test(`${p} is webp under ${max / KB} KB`, () => {
    const b = read(p);
    assert.equal(b.subarray(0, 4).toString("latin1"), "RIFF");
    assert.equal(b.subarray(8, 12).toString("latin1"), "WEBP");
    assert.ok(b.length < max, `size ${b.length}`);
  });
}

for (const p of woff2) {
  test(`${p} has wOF2 signature`, () => {
    assert.equal(read(p).subarray(0, 4).toString("latin1"), "wOF2");
  });
}

for (const [p, size] of [["favicon-32.png", 32], ["apple-touch-icon.png", 180]]) {
  test(`${p} is ${size}x${size}`, () => {
    const b = read(p);
    assert.equal(b.subarray(1, 4).toString("latin1"), "PNG");
    assert.equal(b.readUInt32BE(16), size);
    assert.equal(b.readUInt32BE(20), size);
  });
}
