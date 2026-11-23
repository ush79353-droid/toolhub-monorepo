import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ALLOWABLE_BLOOD_LOSS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Allowable Blood Loss Calculator' },
  { id: 'formula', label: 'Gross Formula' },
  { id: 'ebv', label: 'Estimated Blood Volume' },
  { id: 'clinical', label: 'Clinical Context' },
  { id: 'abl-faq', label: 'Frequently Asked Questions' },
];

export const ALLOWABLE_BLOOD_LOSS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is maximum allowable blood loss?',
    answer:
      'It estimates how much blood can be lost before hemoglobin would fall to a prespecified lowest acceptable level, using estimated blood volume and the Gross formula.',
  },
  {
    question: 'How is estimated blood volume chosen?',
    answer:
      'The calculator multiplies weight in kilograms by a category blood volume factor (for example 65 mL/kg for adult females and 75 mL/kg for adult males).',
  },
  {
    question: 'Who sets the lowest acceptable hemoglobin?',
    answer:
      'The threshold is clinician-supplied. The default 10 g/dL is a display default from the reference worksheet, not a universal transfusion trigger.',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share and copy use the public page URL only, not your numbers.',
  },
];