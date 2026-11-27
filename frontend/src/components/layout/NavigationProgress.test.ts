import assert from 'node:assert/strict';
import test from 'node:test';
import { navigationTarget } from './NavigationProgress';

const here = 'http://localhost:3000/tools';

test('starts for another page on this site', () => {
  assert.equal(navigationTarget('/categories/finance-business', here), '/categories/finance-business');
  assert.equal(navigationTarget('http://localhost:3000/tools/auto-loan-calculator', here), '/tools/auto-loan-calculator');
});

test('stays quiet for the current page, hashes, and other sites', () => {
  assert.equal(navigationTarget('/tools', here), null);
  assert.equal(navigationTarget('/tools#results', here), null);
  assert.equal(navigationTarget('https://example.com/tools', here), null);
});
