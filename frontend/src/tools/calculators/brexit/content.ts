import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BREXIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Brexit Calculator' },
  { id: 'how-it-works', label: 'How the Estimate Works' },
  { id: 'dual-rate', label: 'Dual GDP-Loss Rates' },
  { id: 'opportunity', label: 'Opportunity Comparisons' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'sources', label: 'Sources & Assumptions' },
  { id: 'brexit-faq', label: 'Frequently Asked Questions' },
];

export const BREXIT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this Brexit calculator measure?',
    answer:
      'It builds an illustrative running total from a start time (default: the June 2016 referendum), a dual-rate unrealised GDP-loss model, and an editable lump-sum government-spending add-on. It then divides that total by fixed unit costs to show how many hospitals, schools, and other items the same money could notionally buy.',
  },
  {
    question: 'Is this an official UK government cost of Brexit?',
    answer:
      'No. The figures are educational illustrations based on commonly cited research-style weekly/annual GDP-loss rates and dated unit-cost notes. They are not HM Treasury accounts, OBR forecasts, or audited public spending.',
  },
  {
    question: 'Why are there two GDP-loss rates?',
    answer:
      'The reference model uses about £440 million per week before 1 January 2020 and about £70 billion per year afterward (shown as an editable weekly rate ≈ £70bn ÷ 52). Changing “Current cost” updates the post-2020 leg only.',
  },
  {
    question: 'Why does the total keep changing?',
    answer:
      'When “Follow live clock” is enabled, the end time tracks now, so the post-2020 leg grows every second. Reload restores defaults; clear blanks the form.',
  },
  {
    question: 'What currency does the calculator use?',
    answer:
      'All amounts are fixed pounds sterling (GBP). There is no currency selector and no live FX conversion.',
  },
  {
    question: 'Are satirical rows like Freddos or Boris Johnsons real policy options?',
    answer:
      'No. A few rows are intentionally light-hearted. Serious rows (hospitals, schools, nurses, etc.) still use fixed illustrative unit costs, not live procurement quotes.',
  },
];
