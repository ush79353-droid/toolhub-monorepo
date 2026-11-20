/**
 * Export every MongoDB tool into the client content template, one JSON file per category.
 *
 * Usage (from backend/):
 *   npm run tools:export-content
 *   npm run tools:export-content -- --domain https://omegacalculators.com
 *
 * Fills fields that exist on the tools collection. Article, FAQ, formula, and
 * reference slots stay empty strings so the client can complete them.
 * Localhost canonicals are not copied. Pass --domain for absolute public URLs.
 */
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Category } from '../modules/categories/category.model';
import { Tool } from '../modules/tools/tool.model';

void Category;

const OUTPUT_DIR = path.resolve(__dirname, '../../data/tool-content');

interface CategoryRef {
  name?: string;
  slug?: string;
}

interface ToolRow {
  name: string;
  nameKey: string;
  slug: string;
  category?: CategoryRef | null;
  pillar?: CategoryRef | null;
  subPillar?: CategoryRef | null;
  shortDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  ogImageAlt?: string;
  ogType?: string;
  ogSiteName?: string;
  keywords?: string;
  indexable?: boolean;
  robotsFollow?: boolean;
  robotsMaxSnippet?: number | null;
  robotsMaxImagePreview?: string;
  robotsMaxVideoPreview?: number | null;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImageUrl?: string;
  twitterImageAlt?: string;
  isActive?: boolean;
  isDeveloped?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function fileName(categoryName: string): string {
  const base = categoryName
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `${base || 'uncategorized'}.json`;
}

function splitKeywords(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function pad(values: string[], size: number): string[] {
  const next = values.slice(0, size);
  while (next.length < size) next.push('');
  return next;
}

function publicOrigin(): string {
  const fromFlag = argValue('--domain')?.trim().replace(/\/+$/, '') ?? '';
  if (fromFlag && !/localhost|127\.0\.0\.1/i.test(fromFlag)) return fromFlag;
  const fromEnv = (process.env.PUBLIC_SITE_URL || process.env.SITE_URL || '').trim().replace(/\/+$/, '');
  if (fromEnv && !/localhost|127\.0\.0\.1/i.test(fromEnv)) return fromEnv;
  return '';
}

function absoluteUrl(origin: string, pathname: string): string {
  if (!origin) return '';
  return `${origin}${pathname}`;
}

function storedPublicUrl(value: string | undefined): string {
  const url = value?.trim() ?? '';
  if (!url || /localhost|127\.0\.0\.1/i.test(url)) return '';
  return url;
}

function iso(value: Date | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function emptyFaq(id: string) {
  return { id, question: '', answer: '' };
}

function articleTemplate(name: string, excerpt: string) {
  const topic = name.replace(/\s+calculator$/i, '').trim() || name;
  return {
    h1: name,
    subtitle: '',
    excerpt,
    introduction: ['', '', ''],
    readingTimeMinutes: null as number | null,
    tableOfContents: [
      { id: 'what-is', title: topic ? `What is ${topic}?` : '', level: 2 },
      { id: 'formula', title: topic ? `${topic} formula` : '', level: 2 },
      { id: 'how-to-calculate', title: topic ? `How to calculate ${topic}` : '', level: 2 },
      { id: 'example', title: topic ? `${topic} calculation example` : '', level: 2 },
      { id: 'interpretation', title: 'How to interpret the results', level: 2 },
      { id: 'applications', title: 'Practical applications', level: 2 },
      { id: 'limitations', title: 'Limitations and considerations', level: 2 },
      { id: 'faq', title: 'Frequently asked questions', level: 2 },
    ],
    sections: [
      {
        id: 'what-is',
        heading: topic ? `What is ${topic}?` : '',
        headingLevel: 2,
        blocks: [
          { type: 'paragraph', text: '' },
          { type: 'paragraph', text: '' },
          { type: 'list', style: 'unordered', items: ['', '', ''] },
        ],
      },
      {
        id: 'formula',
        heading: topic ? `${topic} formula` : '',
        headingLevel: 2,
        blocks: [
          { type: 'paragraph', text: '' },
          { type: 'formula', label: '', latex: '', plainText: '' },
          { type: 'paragraph', text: 'Where:' },
          {
            type: 'definitionList',
            items: [
              { term: '', definition: '' },
              { term: '', definition: '' },
            ],
          },
        ],
      },
      {
        id: 'how-to-calculate',
        heading: topic ? `How to calculate ${topic}` : '',
        headingLevel: 2,
        blocks: [
          { type: 'paragraph', text: '' },
          {
            type: 'steps',
            items: [
              { title: '', description: '' },
              { title: '', description: '' },
              { title: '', description: '' },
            ],
          },
        ],
      },
      {
        id: 'example',
        heading: topic ? `${topic} calculation example` : '',
        headingLevel: 2,
        blocks: [
          { type: 'paragraph', text: '' },
          {
            type: 'table',
            caption: 'Example input values',
            columns: ['Input', 'Value'],
            rows: [
              ['', ''],
              ['', ''],
            ],
          },
          { type: 'formula', label: 'Example calculation', latex: '', plainText: '' },
          { type: 'result', label: '', value: '', unit: '' },
          { type: 'paragraph', text: '' },
        ],
      },
      {
        id: 'interpretation',
        heading: 'How to interpret the results',
        headingLevel: 2,
        blocks: [
          { type: 'paragraph', text: '' },
          { type: 'list', style: 'unordered', items: ['', '', ''] },
          { type: 'callout', variant: 'info', title: 'Important', text: '' },
        ],
      },
      {
        id: 'applications',
        heading: 'Practical applications',
        headingLevel: 2,
        blocks: [
          { type: 'paragraph', text: '' },
          { type: 'list', style: 'unordered', items: ['', '', ''] },
        ],
      },
      {
        id: 'limitations',
        heading: 'Limitations and considerations',
        headingLevel: 2,
        blocks: [
          { type: 'paragraph', text: '' },
          { type: 'list', style: 'unordered', items: ['', '', ''] },
        ],
      },
    ],
    conclusion: { heading: 'Key takeaways', paragraphs: ['', ''] },
  };
}

function buildTool(tool: ToolRow, origin: string) {
  const categoryName = tool.category?.name?.trim() || '';
  const categorySlug = tool.category?.slug?.trim() || '';
  const subCategory = tool.subPillar?.name?.trim() || tool.pillar?.name?.trim() || '';
  const keywords = splitKeywords(tool.keywords);
  const primary = keywords[0] ?? '';
  const toolPath = `/tools/${tool.slug}`;
  const categoryPath = categorySlug ? `/category/${categorySlug}` : '';
  const pageUrl = storedPublicUrl(tool.canonicalUrl) || absoluteUrl(origin, toolPath);
  const homeUrl = absoluteUrl(origin, '/');
  const categoryUrl = categoryPath ? absoluteUrl(origin, categoryPath) : '';
  const published = iso(tool.createdAt);
  const modified = iso(tool.updatedAt);

  return {
    tool: {
      name: tool.name ?? '',
      nameKey: tool.nameKey ?? '',
      slug: tool.slug ?? '',
      category: categoryName,
      subCategory,
      primaryKeyword: primary,
      shortDescription: tool.shortDescription ?? '',
      language: 'en',
      isActive: tool.isActive ?? false,
      isDeveloped: tool.isDeveloped ?? false,
    },
    seo: {
      metaTitle: tool.metaTitle ?? '',
      metaDescription: tool.metaDescription ?? '',
      metaKeywords: pad(keywords, 4),
      canonicalUrl: pageUrl,
      robots: {
        index: tool.indexable ?? false,
        follow: tool.robotsFollow ?? true,
        maxImagePreview: tool.robotsMaxImagePreview || 'large',
        maxSnippet: tool.robotsMaxSnippet ?? -1,
        maxVideoPreview: tool.robotsMaxVideoPreview ?? -1,
      },
      author: 'Omega Calculators Editorial Team',
      publisher: 'Omega Calculators',
      language: 'en',
      contentType: 'calculator',
      searchIntent: 'informational and transactional',
      focusKeyword: primary,
      secondaryKeywords: pad(keywords.slice(1), 2),
    },
    openGraph: {
      ogType: tool.ogType || 'website',
      ogTitle: tool.ogTitle ?? '',
      ogDescription: tool.ogDescription ?? '',
      ogUrl: pageUrl,
      ogSiteName: tool.ogSiteName || 'Omega Calculators',
      ogImage: storedPublicUrl(tool.ogImageUrl),
      ogImageAlt: tool.ogImageAlt ?? '',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogLocale: 'en_US',
    },
    twitter: {
      twitterCard: tool.twitterCard || 'summary_large_image',
      twitterTitle: tool.twitterTitle ?? '',
      twitterDescription: tool.twitterDescription ?? '',
      twitterImage: storedPublicUrl(tool.twitterImageUrl),
      twitterImageAlt: tool.twitterImageAlt ?? '',
    },
    breadcrumbs: [
      { name: 'Home', url: homeUrl },
      { name: categoryName, url: categoryUrl },
      { name: tool.name ?? '', url: pageUrl },
    ],
    jsonLd: {
      webPage: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': pageUrl ? `${pageUrl}#webpage` : '',
        name: tool.name ?? '',
        description: tool.metaDescription ?? '',
        url: pageUrl,
        inLanguage: 'en',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Omega Calculators',
          url: homeUrl,
        },
      },
      softwareApplication: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        '@id': pageUrl ? `${pageUrl}#calculator` : '',
        name: tool.name ?? '',
        description: tool.shortDescription ?? '',
        url: pageUrl,
        applicationCategory: '',
        operatingSystem: 'Any',
        browserRequirements: 'Modern web browser',
        inLanguage: 'en',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        isAccessibleForFree: true,
        featureList: ['', '', ''],
      },
      article: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': pageUrl ? `${pageUrl}#article` : '',
        headline: '',
        description: '',
        mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        author: { '@type': 'Organization', name: 'Omega Calculators Editorial Team' },
        publisher: { '@type': 'Organization', name: 'Omega Calculators' },
        datePublished: published,
        dateModified: modified,
        inLanguage: 'en',
      },
      breadcrumbList: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
          { '@type': 'ListItem', position: 2, name: categoryName, item: categoryUrl },
          { '@type': 'ListItem', position: 3, name: tool.name ?? '', item: pageUrl },
        ],
      },
      faqPage: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [1, 2].map(() => ({
          '@type': 'Question',
          name: '',
          acceptedAnswer: { '@type': 'Answer', text: '' },
        })),
      },
    },
    article: articleTemplate(tool.name ?? '', tool.shortDescription ?? ''),
    calculatorGuide: {
      description: '',
      inputs: [
        { key: '', label: '', description: '', unit: '', required: true, tooltip: '' },
      ],
      outputs: [{ key: '', label: '', description: '', unit: '' }],
      formulas: [{ name: '', latex: '', plainText: '', explanation: '' }],
      assumptions: ['', ''],
      validationNotes: ['', ''],
    },
    faqs: ['faq-1', 'faq-2', 'faq-3', 'faq-4', 'faq-5'].map(emptyFaq),
    relatedCalculators: [1, 2].map(() => ({ name: '', slug: '', url: '', description: '' })),
    references: [{ title: '', url: '', publisher: '', accessedAt: '' }],
    contentQuality: {
      contentStatus: 'draft',
      factChecked: false,
      formulaVerified: false,
      reviewedBy: null,
      lastReviewedAt: null,
      originalContent: true,
      editorialNotes: [] as string[],
    },
  };
}

async function run() {
  const connected = await connectDB();
  if (!connected) {
    console.error('Failed to connect to MongoDB.');
    process.exit(1);
  }

  const origin = publicOrigin();
  const rows = (await Tool.find()
    .populate('category', 'name slug')
    .populate('pillar', 'name slug')
    .populate('subPillar', 'name slug')
    .sort({ name: 1 })
    .lean()) as unknown as ToolRow[];

  const groups = new Map<string, { name: string; tools: ReturnType<typeof buildTool>[] }>();
  for (const row of rows) {
    const name = row.category?.name?.trim() || 'Uncategorized';
    const group = groups.get(name) ?? { name, tools: [] };
    group.tools.push(buildTool(row, origin));
    groups.set(name, group);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const written: string[] = [];
  for (const group of [...groups.values()].sort((a, b) => a.name.localeCompare(b.name))) {
    const filename = fileName(group.name);
    const payload = {
      category: group.name,
      toolCount: group.tools.length,
      tools: group.tools,
    };
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    written.push(`${filename} (${group.tools.length})`);
  }

  console.log(
    JSON.stringify(
      {
        outputDir: OUTPUT_DIR,
        tools: rows.length,
        files: written,
        publicOrigin: origin || null,
      },
      null,
      2,
    ),
  );
}

run()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
