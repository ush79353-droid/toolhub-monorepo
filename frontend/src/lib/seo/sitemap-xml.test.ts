import assert from 'node:assert/strict';
import test from 'node:test';
import { sitemapIdForPillar } from '../../config/static-sitemap';
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

test('reserved sitemap ids do not hide a pillar', () => {
  assert.equal(sitemapIdForPillar('loans'), 'loans');
  assert.equal(sitemapIdForPillar('static'), 'pillar-static');
  assert.equal(sitemapIdForPillar('unassigned'), 'pillar-unassigned');
});
