import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FICA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fica', label: 'What Is FICA Tax?' },
  { id: 'how-this-calculator-works', label: 'How This Calculator Works' },
  { id: 'fica-formulas', label: 'Formulas & Rates' },
  { id: 'official-parameters', label: 'Official Parameters by Year' },
  { id: 'limitations', label: 'Limitations & Disclosures' },
  { id: 'related-calculators', label: 'Related Calculators' },
  { id: 'fica-faq', label: 'Frequently Asked Questions' },
];

export const FICA_FAQS: readonly FAQItem[] = [
  {
    question: 'What wages are subject to Social Security vs Medicare?',
    answer:
      'Social Security (OASDI) tax applies only up to that year’s Social Security wage base ($176,100 for 2025; $184,500 for 2026). Medicare (HI) tax has no wage base; all covered wages are taxed at 1.45% each for employee and employer. Self-employed people pay the combined rates on 92.35% of net SE earnings, still capped for the Social Security portion.',
  },
  {
    question: 'When does the 0.9% Additional Medicare Tax apply?',
    answer:
      'Additional Medicare Tax applies to Medicare wages or self-employment income above Form 8959 thresholds: $250,000 married filing jointly, $125,000 married filing separately, and $200,000 for single, head of household, and qualifying surviving spouse. There is no employer match. Employers withhold once wages exceed $200,000 regardless of filing status, so withholding can differ from final liability.',
  },
  {
    question: 'What should I enter as Income if I am self-employed?',
    answer:
      'Enter net profit from self-employment (Schedule C style), not gross revenue. The calculator multiplies that amount by 92.35% before applying the 12.4% Social Security and 2.9% Medicare self-employment rates, matching Schedule SE.',
  },
  {
    question: 'Is the employer share deducted from my paycheck?',
    answer:
      'No. In Employee/Employer mode, the employer Social Security and Medicare amounts are the employer’s matching taxes. Only the employee Social Security, employee Medicare, and any Additional Medicare Tax reduce take-home pay. The combined total shows the full FICA cost of the wages.',
  },
  {
    question: 'Does this calculator include federal income tax?',
    answer:
      'No. It estimates FICA and self-employment payroll taxes only. Federal income tax, state income tax, unemployment taxes, and multi-job wage-base coordination are out of scope.',
  },
];
