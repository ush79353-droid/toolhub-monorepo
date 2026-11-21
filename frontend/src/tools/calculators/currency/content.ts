import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CURRENCY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-currency-calculator', label: 'What This Calculator Does' },
  { id: 'currency-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'currency-faq', label: 'Frequently Asked Questions' },
];

export const CURRENCY_FAQS: readonly FAQItem[] = [
  {
    question: 'Where do the exchange rates come from?',
    answer:
      'Rates are loaded from Omega’s stored FX snapshot (synced server-side from ExchangeRate-API into MongoDB). The calculator never invents rates or calls the provider from the browser.',
  },
  {
    question: 'What does “Show most popular currencies only” do?',
    answer:
      'When checked, From and To lists show a curated popular subset. Uncheck it for the full searchable supported catalog.',
  },
  {
    question: 'What if rates are missing or stale?',
    answer:
      'Missing rates block cross-currency conversion (no silent 1:1). Snapshots older than 48 hours still convert but show a stale warning. Same-currency conversion always works.',
  },
  {
    question: 'Is this mid-market or a bank quote?',
    answer:
      'It uses the stored mid-style provider map for education and estimation. Retail bank/card spreads, fees, and weekend liquidity are not included.',
  },
];
