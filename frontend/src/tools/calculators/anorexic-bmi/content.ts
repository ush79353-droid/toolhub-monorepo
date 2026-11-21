import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANOREXIC_BMI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is This BMI Calculator?' },
  { id: 'formula', label: 'BMI Formula' },
  { id: 'adult-range', label: 'Adult Reference Interval' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'anorexic-bmi-faq', label: 'Frequently Asked Questions' },
];

export const ANOREXIC_BMI_FAQS: readonly FAQItem[] = [
  {
    question: 'How is BMI calculated?',
    answer:
      'Body mass index is mass in kilograms divided by the square of height in meters: BMI = kg / m². US customary and other units are converted to kilograms and meters before the formula is applied.',
  },
  {
    question: 'What healthy BMI range does this tool show?',
    answer:
      'For ages 20–120, it shows the WHO adult “normal weight” interval of 18.5–24.9 kg/m². That interval is a population screening convention, not a personal diagnosis.',
  },
  {
    question: 'Can BMI diagnose anorexia nervosa?',
    answer:
      'No. Low BMI can appear in several conditions and many people with eating disorders do not have a low BMI. Specialist clinical assessment is required. This calculator deliberately omits diagnostic severity labels.',
  },
  {
    question: 'Why ask for sex if BMI does not use it?',
    answer:
      'Sex is collected to match the reference form layout and for on-page context only. The Quetelet BMI formula itself does not depend on sex.',
  },
  {
    question: 'What about children or teens?',
    answer:
      'Adult WHO cutoffs are not appropriate for most people under 20. Use age- and sex-specific BMI-for-age percentiles (for example CDC growth charts) instead of adult ranges.',
  },
  {
    question: 'Is currency conversion involved?',
    answer:
      'No. This calculator uses physical height and weight units only.',
  },
];
