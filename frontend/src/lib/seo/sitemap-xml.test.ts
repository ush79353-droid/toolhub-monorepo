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

test('category index lists loose tools first, then pillars', () => {
  const categories = prepareSitemapCategories(
    [
      {
        slug: 'static',
        tools: [{ slug: 'loose', componentKey: 'Loose', publishedAt: null }],
        pillars: [
          {
            slug: 'tools',
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
  assert.deepEqual(sitemapIndexFiles(categories), ['static.xml', 'section-static.xml']);
  assert.deepEqual(resolveSitemapPath(categories, ['section-static']), {
    kind: 'index',
    files: ['section-static/tools.xml', 'section-static/section-tools.xml', 'section-static/loans.xml'],
  });
  assert.deepEqual(resolveSitemapPath(categories, ['section-static', 'tools']), {
    kind: 'tools',
    tools: [{ slug: 'loose', componentKey: 'Loose', publishedAt: null }],
  });
  assert.deepEqual(resolveSitemapPath(categories, ['section-static', 'loans']).kind, 'tools');
  assert.deepEqual(resolveSitemapPath(categories, ['section-static', 'section-tools']), {
    kind: 'index',
    files: ['section-static/section-tools/tools.xml', 'section-static/section-tools/rewards.xml'],
  });
  const nested = resolveSitemapPath(categories, ['section-static', 'section-tools', 'rewards']);
  assert.equal(nested.kind, 'tools');
  if (nested.kind === 'tools') assert.deepEqual(nested.tools.map((tool) => tool.slug), ['nested']);
});
