import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GEORGIA_OVERTIME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-georgia-overtime', label: 'What Is This Calculator?' },
  { id: 'georgia-overtime-formula', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'legal-limitations', label: 'Legal Limitations' },
  { id: 'georgia-overtime-faq', label: 'Frequently Asked Questions' },
];

export const GEORGIA_OVERTIME_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this enforce Georgia or FLSA overtime eligibility?',
    answer:
      'No. Inputs are a regular rate, weekly hours, a multiplier (default 1.5×), and overtime hours. Without verified eligibility and a workweek schedule, this tool cannot determine statutory overtime entitlement — use it as a pay estimate only.',
  },
  {
    question: 'How is monthly regular pay calculated?',
    answer:
      'Hourly rate × weekly hours × 52/12. Non-hourly rate units are converted to hourly using your regular work schedule. Time-unit selectors convert durations; they are never currency-converted.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Every money field has an independent currency. Results are computed in the regular-pay currency at full precision, then converted with the stored FX snapshot for display. Changing a money currency converts that amount; multipliers and time units are never FX-converted. Missing rates block cross-currency switching.',
  },
];
