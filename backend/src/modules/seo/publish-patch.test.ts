import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPublishPatch, PUBLISH_PATCH_KEYS } from './publish-patch';

test('publish patch writes meta fields and leaves indexing flags untouched', () => {
  const patch = buildPublishPatch({
    metaTitle: 'Auto Loan Calculator',
    metaDescription: 'Estimate a monthly auto loan payment.',
    keywords: 'auto loan calculator',
  });
  assert.deepEqual([...Object.keys(patch)].sort(), [...PUBLISH_PATCH_KEYS].sort());
  assert.equal(patch.metaTitle, 'Auto Loan Calculator');
  assert.equal(patch.metaDescription, 'Estimate a monthly auto loan payment.');
  assert.equal(patch.keywords, 'auto loan calculator');
  assert.equal(patch.ogTitle, patch.metaTitle);
  assert.equal(patch.ogDescription, patch.metaDescription);
  assert.equal(patch.twitterTitle, patch.metaTitle);
  assert.equal(patch.twitterDescription, patch.metaDescription);
  assert.equal(patch.includeFaqSchema, true);
  for (const key of ['isActive', 'indexable', 'isDeveloped', 'embedEnabled', 'componentKey', 'pillar', 'category', 'subPillar']) {
    assert.equal(key in patch, false);
  }
});
