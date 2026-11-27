export interface LlmsCategory {
  name: string;
  slug: string;
  description: string;
}

export interface LlmsTool {
  name: string;
  slug: string;
  shortDescription: string;
  categorySlug: string;
}

export interface LlmsTxtInput {
  origin: string;
  siteName: string;
  categories: LlmsCategory[];
  tools: LlmsTool[];
}

function oneLine(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function linkLabel(value: string, fallback: string): string {
  const label = oneLine(value).replace(/[\[\]]/g, '').trim();
  return label || fallback;
}

function absoluteUrl(origin: string, path: string): string {
  const base = origin.replace(/\/+$/, '');
  if (!base) return path;
  return path === '/' ? `${base}/` : `${base}${path}`;
}

function linkLine(label: string, url: string, description?: string): string {
  const line = `- [${label}](${url})`;
  const detail = description ? oneLine(description) : '';
  return detail ? `${line}: ${detail}` : line;
}

/**
 * Markdown index for language models, following https://llmstxt.org/.
 * Tool links are the calculators that are live on the site. The sitemap remains the crawler URL list.
 */
export function buildLlmsTxt(input: LlmsTxtInput): string {
  const origin = input.origin.replace(/\/+$/, '');
  const siteName = oneLine(input.siteName) || 'Omega Calculators';
  const lines: string[] = [
    `# ${siteName}`,
    '',
    `> ${siteName} is a free collection of online calculators and converters. Each tool page has the calculator, a plain-language explanation, the formula, a worked example, and answers to common questions. Calculations run in the browser. No account is required.`,
    '',
    'Open a category to see the calculators in that topic, or open a tool page to use that calculator. Results are not stored on the server.',
    '',
    '## Main pages',
    '',
    linkLine('Home', absoluteUrl(origin, '/'), 'Search calculators and start from a category.'),
    linkLine('All tools', absoluteUrl(origin, '/tools'), 'Full directory of calculators, with search.'),
    linkLine('Categories', absoluteUrl(origin, '/categories'), 'Every calculator category.'),
    linkLine('About', absoluteUrl(origin, '/about'), `What ${siteName} is and how each tool is written.`),
    linkLine('Contact', absoluteUrl(origin, '/contact'), 'How to reach the site.'),
    '',
  ];

  const toolsByCategory = new Map<string, LlmsTool[]>();
  const seen = new Set<string>();
  for (const tool of input.tools) {
    if (!tool.slug || seen.has(tool.slug)) continue;
    seen.add(tool.slug);
    const list = toolsByCategory.get(tool.categorySlug) ?? [];
    list.push(tool);
    toolsByCategory.set(tool.categorySlug, list);
  }

  const listedCategorySlugs = new Set<string>();
  for (const category of input.categories) {
    if (!category.slug || listedCategorySlugs.has(category.slug)) continue;
    listedCategorySlugs.add(category.slug);
    const tools = (toolsByCategory.get(category.slug) ?? []).slice().sort((a, b) => a.name.localeCompare(b.name));
    lines.push(`## ${linkLabel(category.name, category.slug)}`, '');
    lines.push(
      linkLine(
        category.name,
        absoluteUrl(origin, `/categories/${category.slug}`),
        category.description || 'Calculators in this category.'
      )
    );
    for (const tool of tools) {
      lines.push(
        linkLine(linkLabel(tool.name, tool.slug), absoluteUrl(origin, `/tools/${tool.slug}`), tool.shortDescription)
      );
    }
    lines.push('');
  }

  const ungrouped = [...toolsByCategory.entries()].filter(([slug]) => !listedCategorySlugs.has(slug));
  if (ungrouped.length > 0) {
    lines.push('## Other tools', '');
    const tools = ungrouped
      .flatMap(([, rows]) => rows)
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const tool of tools) {
      lines.push(
        linkLine(linkLabel(tool.name, tool.slug), absoluteUrl(origin, `/tools/${tool.slug}`), tool.shortDescription)
      );
    }
    lines.push('');
  }

  lines.push(
    '## Policies',
    '',
    linkLine('Privacy policy', absoluteUrl(origin, '/privacy-policy'), 'What the site stores and how analytics work.'),
    linkLine('Terms of service', absoluteUrl(origin, '/terms-of-service'), 'Rules for using the site.'),
    linkLine('Disclaimer', absoluteUrl(origin, '/disclaimer'), 'Calculators are for information, not professional advice.'),
    linkLine('DMCA policy', absoluteUrl(origin, '/dmca-policy'), 'How to send a copyright notice.'),
    '',
    '## Optional',
    '',
    linkLine('XML sitemap', absoluteUrl(origin, '/sitemap.xml'), 'Every public page, for crawlers.'),
    ''
  );

  return lines.join('\n');
}
