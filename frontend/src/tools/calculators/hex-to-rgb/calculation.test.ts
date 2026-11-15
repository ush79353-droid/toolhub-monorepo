import assert from 'node:assert/strict';
import { formatRgbTuple, hexToRgb, rgbToHex } from './calculation';
import { parseHexField, parseRgbFields } from './validation';

assert.deepEqual(hexToRgb('#FF0000'), { r: 255, g: 0, b: 0 });
assert.deepEqual(hexToRgb('#FFFFFF'), { r: 255, g: 255, b: 255 });
assert.deepEqual(hexToRgb('#000000'), { r: 0, g: 0, b: 0 });
assert.deepEqual(hexToRgb('#3498DB'), { r: 52, g: 152, b: 219 });
assert.deepEqual(hexToRgb('#F80'), { r: 255, g: 136, b: 0 });
assert.deepEqual(hexToRgb('ABC'), { r: 170, g: 187, b: 204 });
assert.deepEqual(hexToRgb('#ff8300'), { r: 255, g: 131, b: 0 });
assert.deepEqual(hexToRgb('FF8300'), { r: 255, g: 131, b: 0 });

assert.equal(rgbToHex(255, 0, 0), '#FF0000');
assert.equal(rgbToHex(0, 255, 0), '#00FF00');
assert.equal(rgbToHex(0, 0, 255), '#0000FF');
assert.equal(rgbToHex(255, 131, 0), '#FF8300');
assert.equal(rgbToHex(52, 152, 219), '#3498DB');

assert.equal(formatRgbTuple({ r: 255, g: 131, b: 0 }), '(255, 131, 0)');

{
  const ok = parseHexField('#FF8300', false);
  assert.equal(ok.ok, true);
  if (ok.ok) assert.deepEqual(ok.rgb, { r: 255, g: 131, b: 0 });
}
{
  const blocked = parseHexField('#F80', false);
  assert.equal(blocked.ok, false);
  if (!blocked.ok) assert.match(blocked.errors.hex ?? '', /shorthand/i);
}
{
  const ok = parseHexField('#F80', true);
  assert.equal(ok.ok, true);
  if (ok.ok) assert.deepEqual(ok.rgb, { r: 255, g: 136, b: 0 });
}
{
  const bad = parseHexField('#GGGGGG', true);
  assert.equal(bad.ok, false);
}
{
  const ok = parseRgbFields({ r: '255', g: '131', b: '0' });
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.hex, '#FF8300');
}

console.log('hex-to-rgb calculation.test.ts: ok');
