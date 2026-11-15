import assert from 'node:assert/strict';
import {
  buildAutoResizeSnippet,
  buildEmbedPath,
  buildEmbedUrl,
  buildIframeSnippet,
  escapeHtmlAttr,
  isEmbedResizeMessage,
  isToolEmbedEligible,
  normalizeEmbedHeight,
  parseAllowedDomains,
  resolveEmbedEnabled,
} from './tool-embed';

assert.equal(buildEmbedPath('loan-calculator'), '/embed/loan-calculator');
assert.equal(
  buildEmbedUrl('https://omegacalculators.com', 'loan-calculator'),
  'https://omegacalculators.com/embed/loan-calculator'
);
assert.equal(normalizeEmbedHeight(undefined), 650);
assert.equal(normalizeEmbedHeight(100), 320);
assert.equal(normalizeEmbedHeight(99999), 4000);

assert.equal(escapeHtmlAttr('A "B" <C>'), 'A &quot;B&quot; &lt;C&gt;');

assert.equal(resolveEmbedEnabled(true), true);
assert.equal(resolveEmbedEnabled(false), false);
assert.equal(resolveEmbedEnabled(undefined), true);
assert.equal(resolveEmbedEnabled(null), true);

assert.equal(
  isToolEmbedEligible({
    embedEnabled: true,
    isActive: true,
    componentKey: 'LoanCalculator',
    embedDefaultHeight: 650,
    embedPreferredLayout: 'responsive',
    embedAllowedDomains: '',
  }),
  true
);
assert.equal(
  isToolEmbedEligible({
    // Missing config inherits enabled
    embedEnabled: undefined as unknown as boolean,
    isActive: true,
    componentKey: 'LoanCalculator',
    embedDefaultHeight: 650,
    embedPreferredLayout: 'responsive',
    embedAllowedDomains: '',
  }),
  true
);
assert.equal(
  isToolEmbedEligible({
    embedEnabled: false,
    isActive: true,
    componentKey: 'LoanCalculator',
    embedDefaultHeight: 650,
    embedPreferredLayout: 'responsive',
    embedAllowedDomains: '',
  }),
  false
);
assert.equal(
  isToolEmbedEligible({
    embedEnabled: true,
    isActive: false,
    componentKey: 'LoanCalculator',
    embedDefaultHeight: 650,
    embedPreferredLayout: 'responsive',
    embedAllowedDomains: '',
  }),
  false
);
assert.equal(
  isToolEmbedEligible({
    embedEnabled: true,
    isActive: true,
    componentKey: '',
    embedDefaultHeight: 650,
    embedPreferredLayout: 'responsive',
    embedAllowedDomains: '',
  }),
  false
);

const snippet = buildIframeSnippet({
  embedUrl: 'https://example.com/embed/loan-calculator',
  title: 'Loan Calculator - Omega Calculators',
  height: 700,
});
assert.match(snippet, /src="https:\/\/example\.com\/embed\/loan-calculator"/);
assert.match(snippet, /height="700"/);
assert.match(snippet, /referrerpolicy="strict-origin-when-cross-origin"/);
assert.doesNotMatch(snippet, /localhost/);

const auto = buildAutoResizeSnippet({
  embedUrl: 'https://example.com/embed/auto-loan-calculator',
  title: 'Auto Loan',
  siteOrigin: 'https://example.com',
});
assert.match(auto, /data-omega-embed-id=/);
assert.match(auto, /embed\.js/);
assert.match(auto, /data-omega-embed-origin="https:\/\/example\.com"/);

assert.deepEqual(parseAllowedDomains('Example.com, https://Foo.org/path'), [
  'example.com',
  'foo.org',
]);

assert.equal(
  isEmbedResizeMessage({
    source: 'omega-calculators-embed',
    type: 'resize',
    embedId: 'abc',
    height: 800,
  }),
  true
);
assert.equal(
  isEmbedResizeMessage({
    source: 'evil',
    type: 'resize',
    embedId: 'abc',
    height: 800,
  }),
  false
);
assert.equal(
  isEmbedResizeMessage({
    source: 'omega-calculators-embed',
    type: 'resize',
    embedId: 'abc',
    height: 50,
  }),
  false
);

console.log('tool-embed.test.ts: ok');
