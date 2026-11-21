import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NEW_YORK_OVERTIME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-new-york-overtime', label: 'What Is New York Overtime Pay?' },
  { id: 'new-york-overtime-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'new-york-overtime-faq', label: 'Frequently Asked Questions' },
];

export const NEW_YORK_OVERTIME_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this calculator enforce New York overtime law?',
    answer:
      'No. It estimates pay from the rates, hours, and multiplier you enter. New York and FLSA overtime can depend on weekly thresholds, industry rules, exemptions, and other eligibility factors. Without verified eligibility and a qualifying schedule, this tool cannot claim statutory compliance. Use it as a pay estimate only.',
  },
  {
    question: 'How is monthly regular pay calculated?',
    answer:
      'Regular hourly rate × weekly regular hours × 52/12. Changing the regular-pay period converts your entered wage into an hourly rate using the regular weekly schedule before that monthly figure is computed.',
  },
  {
    question: 'What does the overtime multiplier do?',
    answer:
      'Overtime hourly rate = regular hourly rate × multiplier. New York commonly uses time-and-a-half (1.5). Total overtime pay multiplies that rate by your overtime hours after normalizing those hours to a monthly amount.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Changing regular-pay currency converts that wage with stored MongoDB FX rates. Result currencies only re-express calculated pay. Hours, time units, and the multiplier never convert. Missing rates block cross-currency switches; stale rates show a warning.',
  },
];
