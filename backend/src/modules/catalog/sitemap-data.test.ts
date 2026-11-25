import assert from 'node:assert/strict';
import test from 'node:test';
import { groupSitemapTools, type SitemapGroupNode, type SitemapGroupTool } from './sitemap-data';

function node(id: string, slug: string, parentId: string | null, sortOrder: number, name = slug): SitemapGroupNode {
  return { id, slug, parentId, sortOrder, name };
}

function tool(
  slug: string,
  categoryId: string,
  pillarId: string | null = null,
  subPillarId: string | null = null
): SitemapGroupTool {
  return { slug, componentKey: `${slug}Key`, publishedAt: '2026-11-25', categoryId, pillarId, subPillarId };
}

test('nests tools under category, then pillar, then subpillar', () => {
  const categories = groupSitemapTools(
    [node('c1', 'finance', null, 1, 'Finance'), node('c2', 'health', null, 2, 'Health')],
    [node('p1', 'loan-calculator', 'c1', 2, 'Loans'), node('p2', 'credit-cards', 'c1', 1, 'Cards')],
    [node('s1', 'auto-loan', 'p1', 1, 'Auto'), node('s2', 'rewards', 'p2', 1, 'Rewards')],
    [
      tool('loose-calc', 'c1'),
      tool('orphan-calc', 'c1', 'missing'),
      tool('loan-calc', 'c1', 'p1'),
      tool('auto-calc', 'c1', 'p1', 's1'),
      tool('card-calc', 'c1', null, 's2'),
      tool('other-calc', 'missing'),
    ]
  );

  assert.deepEqual(
    categories.map((category) => category.slug),
    ['finance']
  );
  const finance = categories[0];
  assert.deepEqual(
    finance?.tools.map((row) => row.slug),
    ['loose-calc', 'orphan-calc']
  );
  assert.deepEqual(
    finance?.pillars.map((pillar) => pillar.slug),
    ['credit-cards', 'loan-calculator']
  );
  assert.deepEqual(finance?.pillars[0]?.tools.map((row) => row.slug), []);
  assert.deepEqual(finance?.pillars[0]?.subpillars[0]?.tools.map((row) => row.slug), ['card-calc']);
  assert.deepEqual(finance?.pillars[1]?.tools.map((row) => row.slug), ['loan-calc']);
  assert.deepEqual(finance?.pillars[1]?.subpillars[0]?.tools.map((row) => row.slug), ['auto-calc']);
});
