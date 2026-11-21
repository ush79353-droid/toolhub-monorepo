import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NAVY_BODY_FAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Navy Body Fat Calculator' },
  { id: 'equations', label: 'Circumference Equations' },
  { id: 'female-hip', label: 'Female Hip Measurement' },
  { id: 'vs-official', label: 'Vs Official Navy BCA' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'navy-body-fat-faq', label: 'Frequently Asked Questions' },
];

export const NAVY_BODY_FAT_FAQS: readonly FAQItem[] = [
  {
    question: 'Which formula does this use?',
    answer:
      'Hodgdon & Beckett / Naval Health Research Center U.S. Navy circumference equations in metric form (same Navy method used inside our Body Fat Calculator). Age is optional and not part of the equation.',
  },
  {
    question: 'Why does Female add a hip field?',
    answer:
      'The Navy female equation needs waist + hip − neck. The male equation uses waist − neck only, so hip stays hidden for Male.',
  },
  {
    question: 'Is this the current official Navy BCA?',
    answer:
      'No. This is an educational circumference estimate. Current Navy Body Composition Assessment policy and scoring can differ. Do not treat the result as an official BCA score.',
  },
  {
    question: 'Worked example?',
    answer:
      'Male · height 180 cm · waist 85 cm · neck 38 cm → body fat from the shared Navy male equation (about mid-teens percent depending on rounding).',
  },
  {
    question: 'Is personal data stored or shared?',
    answer:
      'No. Measurements stay in your browser for this session. Share uses only the public page URL.',
  },
  {
    question: 'Is currency conversion involved?',
    answer: 'No. This calculator uses length units and percent body fat only.',
  },
];
