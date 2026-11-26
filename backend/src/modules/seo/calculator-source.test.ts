import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatorFolders, readCalculatorSource } from './calculator-source';

const registry = `
  MeterConverter: lazyTool(() =>
    import(
      '@/tools/calculators/meter-converter/MeterConverter'
    ).then((mod) => ({ default: mod.MeterConverter })),
  ),
  KetoCalculator: lazyTool(() =>
    import('@/tools/calculators/keto/KetoCalculator').then((mod) => ({
      default: mod.KetoCalculator,
    })),
  ),
  Evil: lazyTool(() => import('@/tools/calculators/../secret/Evil').then((mod) => ({ default: mod.Evil }))),
`;

test('maps a registry key to its calculator folder', () => {
  const folders = calculatorFolders(registry);
  assert.equal(folders.get('MeterConverter'), 'meter-converter');
  assert.equal(folders.get('KetoCalculator'), 'keto');
  assert.equal(folders.get('Evil'), undefined);
});

test('reads the auto loan calculation source from the frontend module', () => {
  const source = readCalculatorSource('AutoLoanCalculator');
  assert.match(source, /calculation\.ts/);
  assert.doesNotMatch(source, /from 'react'/);
});
