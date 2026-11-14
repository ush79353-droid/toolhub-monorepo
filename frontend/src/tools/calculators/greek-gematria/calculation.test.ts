import assert from 'node:assert/strict';
import {
  calculateGreekGematria,
  getGreekLetterValue,
  normalizeGreekText,
} from './calculation';

// Letter values
{
  assert.equal(getGreekLetterValue('Α'), 1);
  assert.equal(getGreekLetterValue('Β'), 2);
  assert.equal(getGreekLetterValue('Γ'), 3);
  assert.equal(getGreekLetterValue('Ι'), 10);
  assert.equal(getGreekLetterValue('Κ'), 20);
  assert.equal(getGreekLetterValue('Π'), 80);
  assert.equal(getGreekLetterValue('Ρ'), 100);
  assert.equal(getGreekLetterValue('Σ'), 200);
  assert.equal(getGreekLetterValue('ς'), 200);
  assert.equal(getGreekLetterValue('Τ'), 300);
  assert.equal(getGreekLetterValue('Υ'), 400);
  assert.equal(getGreekLetterValue('Φ'), 500);
  assert.equal(getGreekLetterValue('Χ'), 600);
  assert.equal(getGreekLetterValue('Ψ'), 700);
  assert.equal(getGreekLetterValue('Ω'), 800);
  assert.equal(getGreekLetterValue('ϛ'), 6);
  assert.equal(getGreekLetterValue('ϟ'), 90);
  assert.equal(getGreekLetterValue('ϡ'), 900);
  assert.equal(getGreekLetterValue('α'), 1);
  assert.equal(getGreekLetterValue('ω'), 800);
}

// Words
{
  assert.equal(calculateGreekGematria('ΑΛΦΑ').total, 532);
  assert.equal(calculateGreekGematria('ΛΟΓΟΣ').total, 373);
  assert.equal(calculateGreekGematria('λογος').total, 373);
  assert.equal(calculateGreekGematria('λόγος').total, 373);
  assert.equal(calculateGreekGematria('ΙΗΣΟΥΣ').total, 888);
  assert.equal(calculateGreekGematria('σος').total, 470);
  assert.equal(calculateGreekGematria('ΑΒΓ').total, 6);
  assert.equal(calculateGreekGematria('Ω').total, 800);
  assert.equal(calculateGreekGematria('ΣΟΣ').total, 470);
}

// Normalization (use code points so source encoding cannot confuse tonos forms)
{
  const tonos = (cp: number) => String.fromCodePoint(cp);
  assert.equal(normalizeGreekText(tonos(0x03ac)), tonos(0x03b1)); // ά → α
  assert.equal(normalizeGreekText(tonos(0x03ad)), tonos(0x03b5)); // έ → ε
  assert.equal(normalizeGreekText(tonos(0x03ae)), tonos(0x03b7)); // ή → η
  assert.equal(normalizeGreekText(tonos(0x03af)), tonos(0x03b9)); // ί → ι
  assert.equal(normalizeGreekText(tonos(0x03cc)), tonos(0x03bf)); // ό → ο
  assert.equal(normalizeGreekText(tonos(0x03cd)), tonos(0x03c5)); // ύ → υ
  assert.equal(normalizeGreekText(tonos(0x03ce)), tonos(0x03c9)); // ώ → ω
  assert.equal(normalizeGreekText('ἄ'), 'α');
  assert.equal(normalizeGreekText('Ἀ'), 'Α');
  assert.equal(normalizeGreekText('ῆ'), 'η');
  assert.equal(calculateGreekGematria(tonos(0x03ac)).total, 1);
}

// Final sigma + formula
{
  const result = calculateGreekGematria('σος');
  assert.equal(result.letterCount, 3);
  assert.equal(result.additionFormula, '200 + 70 + 200 = 470');
  assert.equal(result.breakdown[2]?.normalizedCharacter, 'ς');
  assert.equal(result.breakdown[2]?.value, 200);
}

// Spaces ignored; Latin ignored with notice
{
  const spaced = calculateGreekGematria('ΛΟ ΓΟΣ');
  assert.equal(spaced.total, 373);
  const mixed = calculateGreekGematria('ΛΟΓΟΣ ABC');
  assert.equal(mixed.total, 373);
  assert.ok(mixed.ignoredCharacters.includes('A'));
}

// Empty / no Greek
{
  const empty = calculateGreekGematria('');
  assert.equal(empty.letterCount, 0);
  assert.equal(empty.total, 0);
  const latin = calculateGreekGematria('HELLO');
  assert.equal(latin.letterCount, 0);
  assert.ok(latin.ignoredCharacters.length > 0);
}

// ΑΛΦΑ breakdown
{
  const result = calculateGreekGematria('ΑΛΦΑ');
  assert.deepEqual(
    result.breakdown.map((row) => row.value),
    [1, 30, 500, 1]
  );
  assert.equal(result.additionFormula, '1 + 30 + 500 + 1 = 532');
}

console.log('greek-gematria calculation.test.ts: ok');
