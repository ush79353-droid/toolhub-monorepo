import assert from 'node:assert/strict';
import {
  cmykToRgb,
  formatsFromCanonical,
  hexToRgb,
  hexToRgba,
  hslToRgb,
  hslaToRgba,
  hsvToRgb,
  parseHex,
  rgbToCmyk,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbaToHex,
  rgbaToHsla,
} from './calculation';
import { parseColorFields } from './validation';

assert.deepEqual(hexToRgb('#FF0000'), { r: 255, g: 0, b: 0 });
assert.deepEqual(hexToRgb('#FFFFFF'), { r: 255, g: 255, b: 255 });
assert.deepEqual(hexToRgb('#000000'), { r: 0, g: 0, b: 0 });
assert.deepEqual(hexToRgb('#FF6432'), { r: 255, g: 100, b: 50 });
assert.deepEqual(hexToRgb('#F00'), { r: 255, g: 0, b: 0 });
assert.deepEqual(hexToRgb('0f0'), { r: 0, g: 255, b: 0 });
assert.equal(hexToRgb('#GG0000'), null);
assert.equal(hexToRgb('#12345'), null);

assert.equal(rgbToHex(255, 0, 0), '#FF0000');
assert.equal(rgbToHex(0, 255, 0), '#00FF00');
assert.equal(rgbToHex(0, 0, 255), '#0000FF');
assert.equal(rgbToHex(255, 255, 255), '#FFFFFF');
assert.equal(rgbToHex(255, 100, 50), '#FF6432');

assert.deepEqual(hexToRgba('#FF000080'), { r: 255, g: 0, b: 0, a: 0.502 });
assert.ok(parseHex('#F008'));
assert.ok(Math.abs((parseHex('#F008')?.a ?? 0) - 136 / 255) < 0.001);
assert.equal(rgbaToHex(255, 0, 0, 1), '#FF0000FF');
assert.equal(rgbaToHex(255, 0, 0, 0), '#FF000000');

assert.deepEqual(rgbToCmyk(0, 0, 0), { c: 0, m: 0, y: 0, k: 100 });
assert.deepEqual(rgbToCmyk(255, 255, 255), { c: 0, m: 0, y: 0, k: 0 });
{
  const gray = rgbToCmyk(224, 224, 224);
  assert.equal(gray.c, 0);
  assert.equal(gray.m, 0);
  assert.equal(gray.y, 0);
  assert.ok(Math.abs(gray.k - 12.16) < 0.05);
}
assert.deepEqual(cmykToRgb(0, 100, 100, 0), { r: 255, g: 0, b: 0 });
assert.deepEqual(cmykToRgb(0, 0, 0, 0), { r: 255, g: 255, b: 255 });
assert.deepEqual(cmykToRgb(0, 0, 0, 100), { r: 0, g: 0, b: 0 });

assert.deepEqual(rgbToHsl(255, 0, 0), { h: 0, s: 100, l: 50 });
assert.equal(rgbToHsl(128, 128, 128).s, 0);
assert.deepEqual(hslToRgb(0, 100, 50), { r: 255, g: 0, b: 0 });
assert.deepEqual(hslToRgb(360, 100, 50), { r: 255, g: 0, b: 0 });
assert.deepEqual(hslToRgb(-60, 100, 50), hslToRgb(300, 100, 50));
{
  const hsl = rgbToHsl(255, 100, 50);
  const back = hslToRgb(hsl.h, hsl.s, hsl.l);
  assert.equal(back.r, 255);
  assert.ok(Math.abs(back.g - 100) <= 1);
  assert.ok(Math.abs(back.b - 50) <= 1);
}

assert.deepEqual(rgbToHsv(255, 0, 0), { h: 0, s: 100, v: 100 });
assert.deepEqual(rgbToHsv(0, 0, 0), { h: 0, s: 0, v: 0 });
assert.deepEqual(hsvToRgb(0, 100, 100), { r: 255, g: 0, b: 0 });
{
  const hsv = rgbToHsv(255, 100, 50);
  assert.deepEqual(hsvToRgb(hsv.h, hsv.s, hsv.v), { r: 255, g: 100, b: 50 });
}

{
  const hsla = rgbaToHsla(255, 0, 0, 0.5);
  assert.equal(hsla.a, 0.5);
  assert.equal(hslaToRgba(hsla.h, hsla.s, hsla.l, hsla.a).a, 0.5);
}

{
  const f = formatsFromCanonical({ r: 255, g: 100, b: 50, a: 1 });
  assert.equal(f.hex, '#FF6432');
  assert.equal(f.rgb, 'rgb(255, 100, 50)');
  assert.equal(f.rgba, 'rgba(255, 100, 50, 1)');
  assert.match(f.hsv, /^hsv\(/);
  assert.match(f.cmyk, /^cmyk\(/);
}

{
  const bad = parseColorFields('RGB', { r: '300', g: '0', b: '0' }, 1);
  assert.equal(bad.ok, false);
  if (!bad.ok) assert.match(bad.errors.r ?? '', /0 and 255/);
}
{
  const ok = parseColorFields('HEX', { hex: '#FF6432' }, 0.4);
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.color.a, 0.4);
}
{
  const ok = parseColorFields('HEX', { hex: '#FF643280' }, 1);
  assert.equal(ok.ok, true);
  if (ok.ok) assert.ok(Math.abs(ok.color.a - 0.502) < 0.01);
}

console.log('color calculation.test.ts: ok');
