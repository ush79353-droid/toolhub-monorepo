import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LIGHTS_CRITERIA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'How to use Light’s criteria calculator?' },
  {
    id: 'transudate-vs-exudate',
    label: 'Pleural effusion — transudate vs exudate',
  },
  { id: 'differentiation', label: 'Pleural effusion differentiation' },
  { id: 'causes', label: 'Pleural effusion causes' },
  { id: 'treatment', label: 'Pleural effusion treatment' },
  {
    id: 'patient-note',
    label: 'A note for the patient — why is there water in my lung?',
  },
  { id: 'lights-faq', label: 'Frequently Asked Questions' },
];

export const LIGHTS_CRITERIA_FAQS: readonly FAQItem[] = [
  {
    question: 'What are Light’s criteria?',
    answer:
      'Light’s criteria (1972) classify a pleural effusion as an exudate if any one of three laboratory comparisons is met with strict inequalities: pleural/serum protein >0.5, pleural/serum LDH >0.6, or pleural LDH >(2/3) of the serum LDH upper reference limit.',
  },
  {
    question: 'Why can one positive criterion classify as an exudate?',
    answer:
      'The original rule is intentionally sensitive: meeting any single criterion labels the fluid as exudative. This worksheet mirrors that “any-one” logic for education — it is not a bedside order.',
  },
  {
    question: 'When is a transudate reported?',
    answer:
      'Only when protein ratio, LDH ratio, and absolute LDH versus ⅔×ULN can all be assessed and none meet the exudate cut-offs. Incomplete inputs never force a transudate label.',
  },
  {
    question: 'Are lab values stored or shared?',
    answer:
      'No. Values stay in your browser. Share uses the public page URL only — never the numbers you typed.',
  },
];
