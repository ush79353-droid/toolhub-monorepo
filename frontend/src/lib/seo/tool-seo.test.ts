import assert from 'node:assert/strict';
import {
  buildToolJsonLd,
  buildToolPageMetadata,
  emptyToolSeoFields,
  isSafeHttpUrl,
  normalizeSiteOrigin,
  resolveCanonicalUrl,
  resolveEffectiveIndexable,
  resolveSitemapEligible,
  serializeJsonLd,
  type ToolSeoSource,
} from './tool-seo';

function tool(overrides: Partial<ToolSeoSource> = {}): ToolSeoSource {
  return {
    name: 'Loan Calculator',
    slug: 'loan-calculator',
    shortDescription: 'Estimate loan payments.',
    componentKey: 'LoanCalculator',
    isActive: true,
    ...emptyToolSeoFields(),
    ...overrides,
  };
}

assert.equal(normalizeSiteOrigin('https://omegacalculators.com/'), 'https://omegacalculators.com');
assert.equal(isSafeHttpUrl('https://example.com/tools/x'), true);
assert.equal(isSafeHttpUrl('javascript:alert(1)'), false);
assert.equal(isSafeHttpUrl(''), true);

assert.equal(
  resolveCanonicalUrl({
    adminCanonical: '',
    siteOrigin: 'https://omegacalculators.com',
    slug: 'loan-calculator',
  }),
  'https://omegacalculators.com/tools/loan-calculator'
);

assert.equal(
  resolveCanonicalUrl({
    adminCanonical: 'https://omegacalculators.com/tools/loan-calculator/',
    siteOrigin: 'https://example.com',
    slug: 'loan-calculator',
  }).replace(/\/$/, ''),
  'https://omegacalculators.com/tools/loan-calculator'
);

assert.equal(
  resolveCanonicalUrl({
    adminCanonical: 'javascript:alert(1)',
    siteOrigin: 'https://omegacalculators.com',
    slug: 'loan-calculator',
  }),
  'https://omegacalculators.com/tools/loan-calculator'
);

const meta = buildToolPageMetadata(
  tool({
    metaTitle: 'Dynamic Meta Title',
    metaDescription: 'Dynamic Meta Description',
    ogTitle: 'OG Title',
    twitterTitle: '',
  }),
  {
    siteName: 'Omega Calculators',
    siteUrl: 'https://omegacalculators.com',
    isImplemented: true,
  }
);

assert.deepEqual(meta.title, { absolute: 'Dynamic Meta Title' });
assert.equal(meta.description, 'Dynamic Meta Description');
assert.equal(meta.openGraph?.title, 'OG Title');
assert.equal(meta.twitter?.title, 'OG Title');

const fallbackMeta = buildToolPageMetadata(tool(), {
  siteName: 'Omega Calculators',
  siteUrl: 'https://omegacalculators.com',
  isImplemented: true,
});
assert.deepEqual(fallbackMeta.title, { absolute: 'Loan Calculator | Omega Calculators' });
assert.equal(fallbackMeta.description, 'Estimate loan payments.');

assert.equal(resolveEffectiveIndexable(tool({ indexable: true }), false), false);
assert.equal(resolveEffectiveIndexable(tool({ indexable: true, isActive: false }), true), false);
assert.equal(resolveEffectiveIndexable(tool({ indexable: true }), true), true);
assert.equal(resolveSitemapEligible(tool({ sitemapInclude: false }), true), false);
assert.equal(resolveSitemapEligible(tool({ sitemapInclude: true }), true), true);

const other = buildToolPageMetadata(tool({ slug: 'auto-loan-calculator', name: 'Auto Loan Calculator', metaTitle: 'Auto SEO' }), {
  siteName: 'Omega Calculators',
  siteUrl: 'https://omegacalculators.com',
  isImplemented: true,
});
assert.deepEqual(other.title, { absolute: 'Auto SEO' });
assert.notDeepEqual(other.title, meta.title);

const jsonLd = buildToolJsonLd({
  tool: tool({ includeFaqSchema: true, schemaType: 'WebApplication' }),
  siteName: 'Omega Calculators',
  siteUrl: 'https://omegacalculators.com',
  isImplemented: true,
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Loan Calculator', path: '/tools/loan-calculator' },
  ],
  faqs: [{ question: 'Is it free?', answer: 'Yes.' }],
});
assert.ok(jsonLd.some((node) => node['@type'] === 'WebApplication'));
assert.ok(jsonLd.some((node) => node['@type'] === 'BreadcrumbList'));
assert.ok(jsonLd.some((node) => node['@type'] === 'FAQPage'));

const serialized = serializeJsonLd(jsonLd);
assert.equal(serialized.includes('<'), false);
assert.match(serialized, /\\u003c|WebApplication/);

console.log('tool-seo.test.ts ok');
