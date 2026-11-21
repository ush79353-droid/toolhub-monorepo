import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TIME_AND_A_HALF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'what-is-time-and-a-half-calculator',
    label: 'What Is a Time and a Half Calculator?',
  },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'overtime-pay-formulas', label: 'Overtime Pay Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'time-and-a-half-faq', label: 'Frequently Asked Questions' },
];

export const TIME_AND_A_HALF_FAQS: readonly FAQItem[] = [
  {
    question: 'How are time-and-a-half, double time, and triple time rates calculated?',
    answer:
      'Enter your standard hourly rate. Time and a half = 1.5× standard, double time = 2×, and triple time = 3×. Enter hours separately for each category; this tool does not auto-classify overtime from a weekly threshold.',
  },
  {
    question: 'How is total pay calculated?',
    answer:
      'Standard pay = rate × standard hours. Time-and-a-half pay = (1.5× rate) × those hours; double and triple similarly. Total = sum of the four category earnings. Premium hours are not counted again under standard hours.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Math runs in the standard pay rate currency at full precision; other rate and earnings fields convert for display. Hours and the fixed 1.5/2/3 multipliers never FX-convert. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this a legal overtime determination?',
    answer:
      'No. Multipliers and hours are user-entered estimate categories. Local labor law, workweek rules, and exemptions are not applied automatically.',
  },
];
