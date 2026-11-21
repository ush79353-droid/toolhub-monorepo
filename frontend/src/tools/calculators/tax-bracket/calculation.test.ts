import assert from 'node:assert/strict';
import { calculateTaxBracket } from './calculation';

// TY 2024 Single · $0 income
{
  const r = calculateTaxBracket({
    taxYear: 2024,
    filingStatus: 'single',
    incomeEntered: 0,
    deductions: 0,
  })!;
  assert.equal(r.estimatedTax, 0);
  assert.equal(r.effectiveRate, 0);
  assert.equal(r.marginalRate, 0.1);
}

// TY 2024 Single · $11,600 exactly at first threshold → all at 10%
{
  const r = calculateTaxBracket({
    taxYear: 2024,
    filingStatus: 'single',
    incomeEntered: 11_600,
    deductions: 0,
  })!;
  assert.equal(r.estimatedTax, 1_160);
  assert.equal(r.marginalRate, 0.1);
}

// TY 2024 Single · $50,000 progressive
{
  const r = calculateTaxBracket({
    taxYear: 2024,
    filingStatus: 'single',
    incomeEntered: 50_000,
    deductions: 0,
  })!;
  // 11600*0.10 + (47150-11600)*0.12 + (50000-47150)*0.22
  const expected = 11600 * 0.1 + (47150 - 11600) * 0.12 + (50000 - 47150) * 0.22;
  assert.ok(Math.abs(r.estimatedTax - expected) < 1e-9);
  assert.equal(r.marginalRate, 0.22);
}

// Deductions reduce taxable income
{
  const r = calculateTaxBracket({
    taxYear: 2024,
    filingStatus: 'single',
    incomeEntered: 50_000,
    deductions: 10_000,
  })!;
  assert.equal(r.taxableIncome, 40_000);
}

// Deductions > income → taxable 0
{
  const r = calculateTaxBracket({
    taxYear: 2024,
    filingStatus: 'single',
    incomeEntered: 5_000,
    deductions: 8_000,
  })!;
  assert.equal(r.taxableIncome, 0);
  assert.equal(r.estimatedTax, 0);
}

// QSS uses MFJ brackets (same tax as joint for same income)
{
  const joint = calculateTaxBracket({
    taxYear: 2024,
    filingStatus: 'married-joint',
    incomeEntered: 100_000,
    deductions: 0,
  })!;
  const qss = calculateTaxBracket({
    taxYear: 2024,
    filingStatus: 'qualifying-surviving-spouse',
    incomeEntered: 100_000,
    deductions: 0,
  })!;
  assert.equal(qss.estimatedTax, joint.estimatedTax);
}

console.log('tax-bracket calculation.test.ts: all assertions passed');
