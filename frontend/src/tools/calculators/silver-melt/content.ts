import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SILVER_MELT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'silver-melt-history', label: 'Silver melt value – the history' },
  {
    id: 'silver-purity-coin-melt',
    label: 'Silver purity and silver coin melt value',
  },
  {
    id: 'silver-quarter-scrap',
    label: 'How much is a silver quarter worth in scrap?',
  },
  {
    id: 'silver-melt-in-practice',
    label: 'The silver melt calculator in practice',
  },
  { id: 'silver-melt-faq', label: 'Frequently asked questions' },
];

export const SILVER_MELT_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the Silver Melt Calculator work?',
    answer:
      'Enter the item weight and unit, select or enter silver purity, and a pure-silver market price per unit. Pure silver mass = weight × purity. Melt value = pure silver × price (normalized to grams).',
  },
  {
    question: 'What is the Alloy value section for?',
    answer:
      'It estimates a second metal (for example copper) separately, then adds that to the silver melt value. Combined totals are raw metal estimates, not jewelry resale prices.',
  },
  {
    question: 'Troy ounce vs ounce — which does this use?',
    answer:
      'Both are available. Troy ounces (oz t ≈ 31.1034768 g) are the precious-metal standard. Standard ounces (oz ≈ 28.349523125 g) are avoirdupois. Do not mix them when entering price and weight.',
  },
  {
    question: 'Is the market price a live quote?',
    answer:
      'No. Enter a current pure-silver spot price yourself. Currency only changes formatting; it does not convert amounts between currencies.',
  },
];

export const SCRAP_SILVER_CALCULATOR_HREF = '/tools/scrap-silver-calculator';
export const SCRAP_GOLD_CALCULATOR_HREF = '/tools/scrap-gold-calculator';
export const GOLD_MELT_CALCULATOR_HREF = '/tools/gold-melt-calculator';
