import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatorFolders, extractUiLabels, readCalculatorSource } from './calculator-source';

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

test('keeps form labels and result titles and drops chrome', () => {
  const labels = extractUiLabels(`
    <label className="text-accent">Auto Price</label>
    <InfoTooltip label="Auto Price" text="Agreed purchase price of the vehicle before taxes." />
    <span className="text-[13px] font-medium text-accent">Trade-In</span>
    <span>Copy Results</span>
    <p className="text-xs font-medium text-primary">Estimated Monthly Payment</p>
    <p className="text-xs text-muted-foreground">Amount Financed</p>
    <p className="text-xs text-muted-foreground">No loan balance required.</p>
  `);
  assert.deepEqual(labels.inputs, ['Auto Price', 'Trade-In']);
  assert.deepEqual(labels.results, ['Estimated Monthly Payment', 'Amount Financed']);
});

test('reads the auto loan calculation source from the frontend module', () => {
  const source = readCalculatorSource('AutoLoanCalculator');
  assert.match(source, /Inputs: .*Auto Price/);
  assert.match(source, /Results: .*Estimated Monthly Payment/);
  assert.match(source, /calculation\.ts/);
  assert.doesNotMatch(source, /from 'react'/);
});
