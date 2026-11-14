import assert from 'node:assert/strict';
import {
  binaryToOctal,
  calculateBinaryOctal,
  octalToBinary,
} from './calculation';
import { parseBinaryOctalInput } from './validation';

// Binary → octal
{
  assert.equal(binaryToOctal('0'), '0');
  assert.equal(binaryToOctal('1'), '1');
  assert.equal(binaryToOctal('10'), '2');
  assert.equal(binaryToOctal('111'), '7');
  assert.equal(binaryToOctal('1000'), '10');
  assert.equal(binaryToOctal('1010'), '12');
  assert.equal(binaryToOctal('101101'), '55');
  assert.equal(binaryToOctal('11010110'), '326');
  assert.equal(binaryToOctal('111111111'), '777');
  assert.equal(binaryToOctal('111111'), '77');
  assert.equal(binaryToOctal('1000000'), '100');
  assert.equal(binaryToOctal('000000'), '0');
}

// Octal → binary
{
  assert.equal(octalToBinary('0'), '0');
  assert.equal(octalToBinary('1'), '1');
  assert.equal(octalToBinary('7'), '111');
  assert.equal(octalToBinary('10'), '1000');
  assert.equal(octalToBinary('12'), '1010');
  assert.equal(octalToBinary('55'), '101101');
  assert.equal(octalToBinary('326'), '11010110');
  assert.equal(octalToBinary('472'), '100111010');
  assert.equal(octalToBinary('777'), '111111111');
  assert.equal(octalToBinary('0007'), '111');
}

// Steps for 11010110
{
  const result = calculateBinaryOctal('11010110', 'binary-to-octal');
  assert.equal(result.output, '326');
  assert.deepEqual(
    result.steps.map((s) => s.inputGroup),
    ['011', '010', '110']
  );
  assert.deepEqual(
    result.steps.map((s) => s.outputGroup),
    ['3', '2', '6']
  );
}

// Reverse steps for 326
{
  const result = calculateBinaryOctal('326', 'octal-to-binary');
  assert.equal(result.output, '11010110');
  assert.deepEqual(
    result.steps.map((s) => s.outputGroup),
    ['011', '010', '110']
  );
}

// Round-trip
for (const bin of ['0', '1', '1010', '11010110', '111111111', '1' + '0'.repeat(90)]) {
  const norm = bin.replace(/^0+/, '') || '0';
  assert.equal(octalToBinary(binaryToOctal(bin)), norm);
}
for (const oct of ['0', '1', '12', '326', '472', '777', '1' + '0'.repeat(40)]) {
  const norm = oct.replace(/^0+/, '') || '0';
  assert.equal(binaryToOctal(octalToBinary(oct)), norm);
}

// Beyond safe integer (direct triad path — no Number)
{
  const big = '1' + '0'.repeat(100);
  const oct = binaryToOctal(big);
  assert.equal(octalToBinary(oct), big);
}

// Validation
{
  assert.equal(parseBinaryOctalInput('', 'binary-to-octal').blank, true);
  assert.ok(parseBinaryOctalInput('10201', 'binary-to-octal').error);
  assert.ok(parseBinaryOctalInput('ABC', 'binary-to-octal').error);
  assert.ok(parseBinaryOctalInput('10.11', 'binary-to-octal').error);
  assert.ok(parseBinaryOctalInput('-101', 'binary-to-octal').error);
  assert.ok(parseBinaryOctalInput('128', 'octal-to-binary').error);
  assert.ok(parseBinaryOctalInput('789', 'octal-to-binary').error);
  assert.equal(parseBinaryOctalInput('326', 'octal-to-binary').value, '326');
}

console.log('binary-to-octal calculation.test.ts: ok');
