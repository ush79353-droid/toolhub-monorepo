import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SCRAP_GOLD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'gold-characteristics-karat',
    label: 'Gold characteristics – what is a karat?',
  },
  {
    id: 'gold-value-calculations-example',
    label: 'Gold value calculations example',
  },
  { id: 'scrap-gold-faq', label: 'Frequently asked questions' },
];

export const SCRAP_GOLD_FAQS: readonly FAQItem[] = [
  {
    question: 'How does this Scrap Gold Calculator work?',
    answer:
      'Enter scrap weight and unit, karat or purity %, and a pure-gold market price per unit. The tool converts weight to grams, applies purity once, then multiplies pure gold by the price converted to a per-gram rate.',
  },
  {
    question: 'Is the price a live gold quote?',
    answer:
      'No. Enter the current pure-gold market price yourself from a reliable source. The currency selector only changes formatting — it does not convert between currencies.',
  },
  {
    question: 'Does the total value include dealer fees?',
    answer:
      'No. The result is an estimated melt/market value before refining fees, assay deductions, or dealer spreads. Offers you receive may be lower.',
  },
  {
    question: 'Which ounce does this calculator use?',
    answer:
      'Troy ounces (oz t), the standard for precious metals — about 31.1034768 grams — not avoirdupois ounces.',
  },
];

export const GOLD_MELT_CALCULATOR_HREF = '/tools/gold-melt-calculator';
