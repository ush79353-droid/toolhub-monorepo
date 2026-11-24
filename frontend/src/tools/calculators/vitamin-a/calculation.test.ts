import assert from 'node:assert/strict';
import {
  assertFactorParityWithMcgToIu,
  calculateVitaminA,
  formatMeasure,
  iuToMcg,
  lookupRda,
  mcgToIu,
  resolveSourcePair,
  syncSourceDraft,
} from './calculation';
import { createDefaultInput, SOURCE_OPTIONS } from './types';
import { validateVitaminA } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

{
  // Local factors must match mcg-to-iu NIH vitamin A presets.
  assertFactorParityWithMcgToIu();
  assert.equal(SOURCE_OPTIONS.find((s) => s.id === 'retinol')?.mcgPerIu, 0.3);
  assert.equal(SOURCE_OPTIONS.find((s) => s.id === 'supplementalBetaCarotene')?.mcgPerIu, 0.3);
  assert.equal(SOURCE_OPTIONS.find((s) => s.id === 'dietaryBetaCarotene')?.mcgPerIu, 0.05);
  assert.equal(SOURCE_OPTIONS.find((s) => s.id === 'dietaryOtherCarotenoids')?.mcgPerIu, 0.025);
}

{
  // NIH ODS: 1 IU retinol = 0.3 mcg RAE → 900 mcg RAE = 3000 IU
  assertClose(iuToMcg(3000, 0.3), 900);
  assertClose(mcgToIu(900, 0.3), 3000);
  assertClose(iuToMcg(1, 0.05), 0.05);
  assertClose(iuToMcg(1, 0.025), 0.025);
}

{
  // Same IU across sources must not produce equal RAE (no double-count / shared factor).
  const iu = 1000;
  assertClose(iuToMcg(iu, 0.3), 300);
  assertClose(iuToMcg(iu, 0.05), 50);
  assertClose(iuToMcg(iu, 0.025), 25);
  assert.notEqual(iuToMcg(iu, 0.3), iuToMcg(iu, 0.05));
}

{
  // Adult female RDA 700; adult male 900; infant AI 400.
  assert.equal(lookupRda('female', 'y19_50').mcgRae, 700);
  assert.equal(lookupRda('male', 'y19_50').mcgRae, 900);
  assert.equal(lookupRda('female', 'y14_18').mcgRae, 700);
  assert.equal(lookupRda('male', 'y14_18').mcgRae, 900);
  assert.equal(lookupRda('male', 'birth_6mo').mcgRae, 400);
  assert.equal(lookupRda('male', 'birth_6mo').kind, 'ai');
  assert.equal(lookupRda('female', 'y1_3').mcgRae, 300);
}

{
  // Inverse edit: editing IU updates RAE; editing RAE updates IU — one source only.
  const fromIu = syncSourceDraft('retinol', {
    iuText: '3000',
    raeText: '0',
    lastEdited: 'iu',
  });
  assert.equal(fromIu.raeText, formatMeasure(900));

  const fromRae = syncSourceDraft('dietaryBetaCarotene', {
    iuText: '0',
    raeText: '50',
    lastEdited: 'rae',
  });
  assert.equal(fromRae.iuText, formatMeasure(1000));

  // Incomplete trailing dot must not overwrite the pair (prevents inverse thrash).
  const incomplete = syncSourceDraft('retinol', {
    iuText: '12.',
    raeText: '900',
    lastEdited: 'iu',
  });
  assert.equal(incomplete.raeText, '900');
}

{
  // Defaults: Female 19–50, all zeros → total 0, RDA 700.
  const defaults = createDefaultInput();
  const result = calculateVitaminA(defaults);
  assert.equal(result.sex, 'female');
  assert.equal(result.rdaMcgRae, 700);
  assert.equal(result.totalRaeMcg, 0);
  assert.equal(result.vsRdaPercent, 0);
}

{
  // Sum RAE once per source — do not sum IU or double-count both sides.
  const input = createDefaultInput();
  input.sources.retinol = { iuText: '3000', raeText: '900', lastEdited: 'iu' };
  input.sources.dietaryBetaCarotene = {
    iuText: '1000',
    raeText: '50',
    lastEdited: 'iu',
  };
  input.sources.supplementalBetaCarotene = {
    iuText: '1000',
    raeText: '300',
    lastEdited: 'iu',
  };
  input.sources.dietaryOtherCarotenoids = {
    iuText: '1000',
    raeText: '25',
    lastEdited: 'iu',
  };
  const result = calculateVitaminA(input);
  assertClose(result.totalRaeMcg, 900 + 50 + 300 + 25);
  assert.equal(result.sources.length, 4);
}

{
  const pair = resolveSourcePair('retinol', {
    iuText: '3000',
    raeText: '',
    lastEdited: 'iu',
  });
  assert.ok(pair);
  assertClose(pair!.raeMcg, 900);
}

{
  const bad = validateVitaminA({
    ...createDefaultInput(),
    sources: {
      ...createDefaultInput().sources,
      retinol: { iuText: '-1', raeText: '0', lastEdited: 'iu' },
    },
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.retinolIu);

  const ok = validateVitaminA(createDefaultInput());
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
}

console.log('vitamin-a calculation.test.ts: ok');
