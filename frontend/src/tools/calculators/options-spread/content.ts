import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OPTIONS_SPREAD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-options-spread', label: 'What This Calculator Does' },
  { id: 'options-spread-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'options-spread-faq', label: 'Frequently Asked Questions' },
];

export const OPTIONS_SPREAD_FAQS: readonly FAQItem[] = [
  {
    question: 'Which strategies are supported?',
    answer:
      'Four vertical spreads: bull call, bull put, bear call, and bear put. Labels for buy/sell legs update with the selected strategy.',
  },
  {
    question: 'Why multiply by 100?',
    answer:
      'Standard U.S.-style equity options typically deliver 100 shares per contract. This tool uses that multiplier; other products may differ.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Money fields have independent FX. Values are normalized into the target-price currency before spread math. Contract counts are never converted.',
  },
  {
    question: 'What if my premiums make max profit negative?',
    answer:
      'That usually means the debit/credit is wider than the strike width (economically incoherent for a simple vertical). The calculator rejects that case instead of showing negative “max profit.”',
  },
];
