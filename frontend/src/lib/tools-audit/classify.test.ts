import assert from 'node:assert/strict';
import { classifyTools, type SourceIndex } from './classify';
import { loadSourceIndex } from './read-source';

function index(overrides: Partial<SourceIndex> = {}): SourceIndex {
  return {
    version: 1,
    available: true,
    source: 'filesystem',
    scannedAt: '2026-11-13T00:00:00.000Z',
    warning: '',
    routeFileExists: true,
    routeUsesRegistry: true,
    detailRequired: true,
    embedUsesRegistry: true,
    registeredKeys: ['LoanCalculator'],
    bindings: [
      {
        key: 'LoanCalculator',
        importPath: '@/tools/calculators/loan/LoanCalculator',
        expectedPath: 'src/tools/calculators/loan/LoanCalculator.tsx',
        relativePath: 'src/tools/calculators/loan/LoanCalculator.tsx',
        exportName: 'LoanCalculator',
        exportFound: true,
        fileExists: true,
        placeholder: false,
        detailImportPath: '@/tools/calculators/loan/detail',
        detailExpectedPath: 'src/tools/calculators/loan/detail.tsx',
        detailFileExists: true,
        detailExportsPageDetail: true,
      },
    ],
    files: [
      {
        relativePath: 'src/tools/calculators/loan/LoanCalculator.tsx',
        exports: ['LoanCalculator'],
        placeholder: false,
      },
    ],
    ...overrides,
  };
}

const developed = classifyTools(
  [
    {
      id: 'a',
      name: 'Loan',
      slug: 'loan-calculator',
      category: 'Finance',
      componentKey: 'LoanCalculator',
      isDeveloped: false,
      isDevelopedPersisted: true,
    },
    {
      id: 'b',
      name: 'Loan copy',
      slug: 'loan-copy',
      category: 'Finance',
      componentKey: 'LoanCalculator',
      isDeveloped: true,
      isDevelopedPersisted: true,
    },
  ],
  index()
);
assert.equal(developed.rows.every((row) => row.status === 'developed' && row.isDeveloped), true);
assert.deepEqual(developed.updates.map((item) => item.slug), ['loan-calculator']);
assert.equal(developed.duplicates.sharedComponents.length, 1);
assert.equal(developed.duplicates.sharedComponents[0]?.component, 'LoanCalculator');
assert.equal(developed.totals.completionPercent, 100);

const missing = classifyTools(
  [
    {
      id: 'c',
      name: 'Nope',
      slug: 'nope-calculator',
      category: 'Math',
      componentKey: '',
      isDeveloped: true,
      isDevelopedPersisted: false,
    },
  ],
  index()
);
assert.equal(missing.rows[0]?.status, 'not_developed');
assert.equal(missing.rows[0]?.isDeveloped, false);
assert.deepEqual(missing.updates, [{ id: 'c', slug: 'nope-calculator', isDeveloped: false }]);

const similar = classifyTools(
  [
    {
      id: 'd',
      name: 'Unwired loan',
      slug: 'loan-calculator',
      category: 'Finance',
      componentKey: '',
      isDeveloped: true,
      isDevelopedPersisted: true,
    },
  ],
  index()
);
assert.equal(similar.rows[0]?.status, 'needs_review');
assert.equal(similar.rows[0]?.isDeveloped, true);
assert.deepEqual(similar.updates, []);
assert.equal(similar.rows[0]?.issueCode, 'unwired');

const placeholder = classifyTools(
  [
    {
      id: 'e',
      name: 'Stub',
      slug: 'stub',
      category: 'Math',
      componentKey: 'LoanCalculator',
      isDeveloped: true,
      isDevelopedPersisted: true,
    },
  ],
  index({
    bindings: [
      {
        ...index().bindings[0],
        placeholder: true,
      },
    ],
  })
);
assert.equal(placeholder.rows[0]?.status, 'needs_review');
assert.equal(placeholder.rows[0]?.issueCode, 'placeholder');
assert.deepEqual(placeholder.updates, []);

const duplicateSlug = classifyTools(
  [
    {
      id: 'f1',
      name: 'One',
      slug: 'same',
      category: 'Math',
      componentKey: '',
      isDeveloped: false,
      isDevelopedPersisted: true,
    },
    {
      id: 'f2',
      name: 'Two',
      slug: 'same',
      category: 'Math',
      componentKey: '',
      isDeveloped: false,
      isDevelopedPersisted: true,
    },
  ],
  index({ files: [], bindings: [], registeredKeys: [] })
);
assert.equal(duplicateSlug.duplicates.slugs.length, 1);
assert.equal(duplicateSlug.duplicates.routes.length, 1);
assert.equal(duplicateSlug.duplicates.ids.length, 0);

const live = loadSourceIndex();
assert.equal(live.available, true);
assert.equal(live.source, 'filesystem');
assert.equal(live.routeUsesRegistry, true);
assert.equal(live.detailRequired, true);
assert.equal(live.embedUsesRegistry, true);
assert.ok(live.bindings.length >= 7);
for (const binding of live.bindings) {
  assert.equal(binding.fileExists, true, binding.key);
  assert.equal(binding.exportFound, true, binding.key);
  assert.equal(binding.detailFileExists, true, binding.key);
  assert.equal(binding.detailExportsPageDetail, true, binding.key);
  assert.equal(binding.placeholder, false, binding.key);
}

const liveReport = classifyTools(
  [
    {
      id: '1',
      name: 'Auto Loan Calculator',
      slug: 'auto-loan-calculator',
      category: 'Finance',
      componentKey: 'AutoLoanCalculator',
      isDeveloped: true,
      isDevelopedPersisted: true,
    },
    {
      id: '2',
      name: 'RREF Calculator',
      slug: 'reduced-row-echelon-form-calculator',
      category: 'Math',
      componentKey: 'RrefCalculator',
      isDeveloped: false,
      isDevelopedPersisted: true,
    },
    {
      id: '3',
      name: 'Missing Tool',
      slug: 'this-tool-does-not-exist-xyz',
      category: 'Math',
      componentKey: '',
      isDeveloped: true,
      isDevelopedPersisted: false,
    },
    {
      id: '4',
      name: 'Unknown key',
      slug: 'unknown-key-tool',
      category: 'Math',
      componentKey: 'DoesNotExistCalculator',
      isDeveloped: true,
      isDevelopedPersisted: true,
    },
  ],
  live
);
assert.equal(liveReport.rows.find((row) => row.slug === 'auto-loan-calculator')?.status, 'developed');
assert.equal(liveReport.rows.find((row) => row.slug === 'reduced-row-echelon-form-calculator')?.status, 'developed');
assert.equal(liveReport.rows.find((row) => row.slug === 'reduced-row-echelon-form-calculator')?.isDeveloped, true);
assert.equal(liveReport.rows.find((row) => row.slug === 'this-tool-does-not-exist-xyz')?.status, 'not_developed');
assert.equal(liveReport.rows.find((row) => row.slug === 'unknown-key-tool')?.status, 'not_developed');
assert.ok(liveReport.rows.some((row) => row.componentPath.startsWith('src/')));
assert.equal(liveReport.rows.some((row) => row.componentPath.includes('..') || row.componentPath.includes(':\\')), false);

console.log('tools audit classify: ok');
