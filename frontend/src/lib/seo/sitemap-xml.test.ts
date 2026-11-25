import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareSitemapCategories, resolveSitemapPath, sitemapIndexFiles } from './sitemap-tree';
import { sitemapIndex, sitemapUrlset } from './sitemap-xml';

test('sitemap index lists child files and escapes urls', () => {
  const xml = sitemapIndex(['https://example.com/sitemap/static.xml', 'https://example.com/sitemap/a&b.xml']);
  assert.match(xml, /<sitemapindex/);
  assert.match(xml, /a&amp;b\.xml/);
  assert.doesNotMatch(xml, /<urlset/);
});

test('urlset keeps a stored lastmod and does not invent one', () => {
  const xml = sitemapUrlset([
    { url: 'https://example.com/about', lastModified: '2026-11-25' },
    { url: 'https://example.com/tools/loan-calculator' },
  ]);
  assert.match(xml, /<lastmod>2026-11-25<\/lastmod>/);
  assert.equal(xml.match(/<loc>/g)?.length, 2);
});

test('category file lists its own tools, then pillar sitemaps', () => {
  const loose = { slug: 'loose', componentKey: 'Loose', publishedAt: null };
  const categories = prepareSitemapCategories(
    [
      {
        slug: 'static',
        tools: [loose],
        pillars: [
          {
            slug: 'cards',
            tools: [{ slug: 'direct', componentKey: 'Direct', publishedAt: null }],
            subpillars: [
              {
                slug: 'rewards',
                tools: [{ slug: 'nested', componentKey: 'Nested', publishedAt: null }],
              },
            ],
          },
          {
            slug: 'loans',
            tools: [
              { slug: 'kept', componentKey: 'Kept', publishedAt: null },
              { slug: 'dropped', componentKey: 'Dropped', publishedAt: null },
            ],
            subpillars: [],
          },
        ],
      },
    ],
    (tool) => tool.componentKey !== 'Dropped'
  );
  assert.deepEqual(sitemapIndexFiles(categories), [
    'static.xml',
    'section-static.xml',
    'section-static/cards.xml',
    'section-static/cards/rewards.xml',
    'section-static/loans.xml',
  ]);
  assert.deepEqual(resolveSitemapPath(categories, ['section-static']), {
    kind: 'tools',
    tools: [loose],
    children: ['section-static/cards.xml', 'section-static/loans.xml'],
  });
  assert.deepEqual(resolveSitemapPath(categories, ['section-static', 'loans']), {
    kind: 'tools',
    tools: [{ slug: 'kept', componentKey: 'Kept', publishedAt: null }],
    children: [],
  });
  assert.deepEqual(resolveSitemapPath(categories, ['section-static', 'cards']), {
    kind: 'tools',
    tools: [{ slug: 'direct', componentKey: 'Direct', publishedAt: null }],
    children: ['section-static/cards/rewards.xml'],
  });
  const nested = resolveSitemapPath(categories, ['section-static', 'cards', 'rewards']);
  assert.equal(nested.kind, 'tools');
  if (nested.kind === 'tools') assert.deepEqual(nested.tools.map((tool) => tool.slug), ['nested']);
});
