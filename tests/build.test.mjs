import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { build, PUBLIC_FILES } from '../tools/build.mjs';

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listFiles(join(dir, e.name)) : [join(dir, e.name)]);
}

test('build outputs exactly the public files, nothing dev-only', async () => {
  const out = mkdtempSync(join(tmpdir(), 'jarrib-dist-'));
  try {
    await build(out);
    const files = listFiles(out).map((f) => relative(out, f)).sort();
    assert.deepEqual(files, [...PUBLIC_FILES].sort());
    assert.ok(!files.some((f) => f.endsWith('.otf') || f.endsWith('.jpg')));
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('every local file the page references is in the build', async () => {
  const out = mkdtempSync(join(tmpdir(), 'jarrib-dist-'));
  try {
    await build(out);
    const sources = ['index.html', 'css/site.css', 'js/hero.js'];
    const refs = new Set();
    for (const src of sources) {
      const text = readFileSync(join(out, src), 'utf8');
      for (const m of text.matchAll(/(?:src|href)="([^"#:]+)"|url\("?\.\.\/([^")]+)"?\)|'(assets\/[^']+)'/g)) {
        refs.add(m[1] ?? m[2] ?? m[3]);
      }
    }
    refs.add('og.png'); // referenced by absolute URL in og:image
    for (const ref of refs) assert.ok(existsSync(join(out, ref)), `missing in build: ${ref}`);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
