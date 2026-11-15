import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const YOUTUBE_MONEY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-youtube-money', label: 'What This Calculator Does' },
  { id: 'youtube-money-formulas', label: 'Formulas' },
  { id: 'youtube-money-gross-net', label: 'Gross vs Net' },
  { id: 'youtube-money-example', label: 'Example' },
  { id: 'youtube-money-faq', label: 'Frequently Asked Questions' },
];

export const YOUTUBE_MONEY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is RPM?',
    answer:
      'RPM (revenue per mille) is estimated earnings per 1,000 views. Creator RPM generally already reflects YouTube’s revenue share with the creator.',
  },
  {
    question: 'Why are gross and net the same?',
    answer:
      'This calculator does not invent a hidden platform cut on top of RPM. Gross shows the RPM-based estimate; net is the same creator estimate because RPM is already after typical platform sharing.',
  },
  {
    question: 'How do time periods work?',
    answer:
      'Enter views for a period (day, week, month, or year). Revenue periods convert that rate using 365 days, 52 weeks, and 12 months per year.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter RPM in the currency you want displayed.',
  },
];
