import assert from 'node:assert/strict';
import { hexToRgb, rgbToHex } from './calculation';
import { parseHexField, parseRgbFields } from './validation';

assert.equal(rgbToHex(255, 0, 0), '#FF0000');
assert.equal(rgbToHex(0, 255, 0), '#00FF00');
assert.equal(rgbToHex(0, 0, 255), '#0000FF');
assert.equal(rgbToHex(255, 255, 255), '#FFFFFF');
assert.equal(rgbToHex(0, 0, 0), '#000000');
assert.equal(rgbToHex(255, 100, 50), '#FF6432');
assert.equal(rgbToHex(52, 152, 219), '#3498DB');
assert.equal(rgbToHex(15, 0, 0), '#0F0000');

assert.throws(() => rgbToHex(-1, 0, 0), RangeError);
assert.throws(() => rgbToHex(256, 0, 0), RangeError);
assert.throws(() => rgbToHex(12.5, 0, 0), RangeError);

assert.deepEqual(hexToRgb('#FF0000'), { r: 255, g: 0, b: 0 });
assert.deepEqual(hexToRgb('#FFFFFF'), { r: 255, g: 255, b: 255 });
assert.deepEqual(hexToRgb('#3498DB'), { r: 52, g: 152, b: 219 });
assert.deepEqual(hexToRgb('#F00'), { r: 255, g: 0, b: 0 });
assert.deepEqual(hexToRgb('ff6432'), { r: 255, g: 100, b: 50 });
assert.deepEqual(hexToRgb('#0f0'), { r: 0, g: 255, b: 0 });

assert.throws(() => hexToRgb('#GG0000'));
assert.throws(() => hexToRgb('#12345'));
assert.throws(() => hexToRgb('#1234567'));
assert.throws(() => hexToRgb('#FF000080')); // alpha not supported here

{
  const ok = parseRgbFields({ r: '255', g: '100', b: '50' });
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.hex, '#FF6432');
}
{
  const bad = parseRgbFields({ r: '300', g: '0', b: '0' });
  assert.equal(bad.ok, false);
  if (!bad.ok) assert.match(bad.errors.r ?? '', /0 and 255/);
}
{
  const ok = parseHexField('#3498db');
  assert.equal(ok.ok, true);
  if (ok.ok) assert.deepEqual(ok.rgb, { r: 52, g: 152, b: 219 });
}
{
  const bad = parseHexField('#xyz');
  assert.equal(bad.ok, false);
}

console.log('rgb-to-hex calculation.test.ts: ok');
