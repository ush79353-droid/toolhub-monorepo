import OpenAI from 'openai';
import { env } from '../../config/env';
import type { KeywordFact, SuggestedLink } from './choose-keyword';
import { clipSeoRaw, seoContentSchema, type SeoContent } from './content';
import type { SeoSnapshot, SerpItem } from './seo.model';

const DRAFT_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'metaTitle',
    'metaDescription',
    'keywords',
    'primaryKeyword',
    'sections',
    'faqs',
    'links',
    'disclaimer',
  ],
  properties: {
    metaTitle: { type: 'string' },
    metaDescription: { type: 'string' },
    keywords: { type: 'string' },
    primaryKeyword: { type: 'string' },
    disclaimer: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'title', 'paragraphs', 'bullets', 'formula', 'formulaNote'],
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          paragraphs: { type: 'array', items: { type: 'string' } },
          bullets: { type: 'array', items: { type: 'string' } },
          formula: { type: 'string' },
          formulaNote: { type: 'string' },
        },
      },
    },
    faqs: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['question', 'answer'],
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
        },
      },
    },
    links: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['slug', 'anchor'],
        properties: {
          slug: { type: 'string' },
          anchor: { type: 'string' },
        },
      },
    },
  },
};

const SYSTEM = `You write original educational SEO copy for one finance calculator page.
Use only the keyword metrics and SERP titles provided. Never invent search volume, keyword difficulty, CPC, rankings, tax rates, or formulas.
Leave formula and formulaNote as empty strings unless you are quoting a formula the user message already contains. Any formula is reviewed by a person.
Echo primaryKeyword exactly as given.
Copy the provided links exactly: same slugs and anchors, between 3 and 6.
Write about 500 to 900 words across the sections.
metaTitle at most 70 characters. metaDescription at most 160 characters. keywords at most 200 characters.
Include 3 to 5 FAQs.
disclaimer must say the page is educational and is not financial, tax, or investment advice.
Use these section ids in order: what-this-covers, how-to-use, how-it-works, worked-example, how-to-read, mistakes.
Do not copy competitor titles or claim a ranking.`;

export async function draftSeoContent(input: {
  snapshot: SeoSnapshot;
  primaryKeyword: string;
  secondaryKeywords: string[];
  keywordFacts: KeywordFact[];
  serpItems: SerpItem[];
  suggestedLinks: SuggestedLink[];
}): Promise<SeoContent> {
  if (!env.OPENAI_API_KEY || !env.OPENAI_SEO_MODEL) {
    throw new Error('OpenAI SEO model is not configured.');
  }
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY, timeout: 60_000 });
  const completion = await client.chat.completions.create({
    model: env.OPENAI_SEO_MODEL,
    messages: [
      { role: 'system', content: SYSTEM },
      {
        role: 'user',
        content: JSON.stringify({
          tool: input.snapshot,
          primaryKeyword: input.primaryKeyword,
          secondaryKeywords: input.secondaryKeywords,
          keywordFacts: input.keywordFacts.map((fact) => ({
            keyword: fact.keyword,
            searchVolume: fact.searchVolume,
            difficulty: fact.difficulty,
            cpc: fact.cpc,
          })),
          serpTitles: input.serpItems.map((item) => ({ position: item.position, title: item.title })),
          links: input.suggestedLinks.map((link) => ({ slug: link.slug, anchor: link.anchor })),
        }),
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'seo_tool_draft',
        strict: true,
        schema: DRAFT_SCHEMA,
      },
    },
  });
  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error('OpenAI returned an empty draft.');
  return seoContentSchema.parse(clipSeoRaw(JSON.parse(text) as unknown));
}
