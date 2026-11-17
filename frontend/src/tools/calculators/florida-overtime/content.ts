import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FLORIDA_OVERTIME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-florida-overtime', label: 'What Is Florida Overtime Pay?' },
  { id: 'florida-overtime-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'florida-overtime-faq', label: 'Frequently Asked Questions' },
];

export const FLORIDA_OVERTIME_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this calculator apply Florida daily overtime rules?',
    answer:
      'No. This estimate uses your entered regular hours, overtime hours, and multiplier. It does not invent daily overtime thresholds or verify FLSA exemption status. Confirm eligibility and workweek details with your employer or counsel.',
  },
  {
    question: 'How is monthly regular pay calculated?',
    answer:
      'Regular hourly rate × weekly regular hours × 52/12. Changing the regular-pay period converts your entered wage into an hourly rate using the regular weekly schedule before that monthly figure is computed.',
  },
  {
    question: 'What does the overtime multiplier do?',
    answer:
      'Overtime hourly rate = regular hourly rate × multiplier. Florida commonly uses time-and-a-half (1.5). Total overtime pay multiplies that rate by your overtime hours after normalizing those hours to a monthly amount.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Changing regular-pay currency converts that wage with stored MongoDB FX rates. Result currencies only re-express calculated pay. Hours, time units, and the multiplier never convert. Missing rates block cross-currency switches; stale rates show a warning.',
  },
];
