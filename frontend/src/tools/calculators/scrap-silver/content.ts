import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SCRAP_SILVER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'silver-characteristics-usage',
    label: "Silver's characteristics and usage",
  },
  { id: 'how-much-is-silver-worth', label: 'How much is silver worth?' },
  {
    id: 'scrap-silver-value-example',
    label: 'Scrap silver value calculator – an example',
  },
  { id: 'interesting-facts-silver', label: 'Interesting facts about silver' },
  { id: 'scrap-silver-sources', label: 'Sources' },
  { id: 'scrap-silver-faq', label: 'Frequently asked questions' },
];

export const SCRAP_SILVER_FAQS: readonly FAQItem[] = [
  {
    question: 'How does this Scrap Silver Calculator work?',
    answer:
      'Enter scrap weight and unit, choose a purity preset or custom %, and a pure-silver market price per unit. The tool converts weight to grams, applies purity once, then multiplies pure silver by the price converted to a per-gram rate.',
  },
  {
    question: 'Is the price a live silver quote?',
    answer:
      'No. Enter a current pure-silver spot price from a reliable source. The currency selector only changes formatting — it does not convert between currencies.',
  },
  {
    question: 'What is the difference between melt value and selling value?',
    answer:
      'Melt value is weight × purity × spot. Estimated selling value subtracts optional dealer discount %, refining fees, and transaction fees you enter in the buy/sell section.',
  },
  {
    question: 'Which ounce does this calculator use?',
    answer:
      'Troy ounces (oz t), the standard for precious metals — about 31.1034768 grams — not avoirdupois ounces.',
  },
];

export const SCRAP_GOLD_CALCULATOR_HREF = '/tools/scrap-gold-calculator';
export const GOLD_MELT_CALCULATOR_HREF = '/tools/gold-melt-calculator';

/** Authoritative references only — do not invent URLs. */
export const SCRAP_SILVER_SOURCES: readonly {
  title: string;
  href: string;
  note: string;
}[] = [
  {
    title: 'Silver — Wikipedia',
    href: 'https://en.wikipedia.org/wiki/Silver',
    note: 'Overview of properties, history, and uses.',
  },
  {
    title: 'Sterling silver — Wikipedia',
    href: 'https://en.wikipedia.org/wiki/Sterling_silver',
    note: 'Sterling composition (.925) and hallmarks.',
  },
  {
    title: 'Britannia silver — Wikipedia',
    href: 'https://en.wikipedia.org/wiki/Britannia_silver',
    note: 'Britannia standard (.958) background.',
  },
  {
    title: 'USGS Mineral Commodity Summaries — Silver',
    href: 'https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-silver.pdf',
    note: 'U.S. Geological Survey silver commodity summary (2024).',
  },
  {
    title: 'LBMA — Precious metals market',
    href: 'https://www.lbma.org.uk/',
    note: 'London Bullion Market Association market standards and information.',
  },
];
