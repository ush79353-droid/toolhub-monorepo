import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BREASTFEEDING_CALORIE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Breastfeeding Calorie Calculator' },
  { id: 'what-it-estimates', label: 'What This Calculator Estimates' },
  { id: 'dri-eer', label: 'IOM DRI Estimated Energy Requirement' },
  { id: 'additions', label: 'Pregnancy and Lactation Additions' },
  { id: 'activity', label: 'Physical Activity Coefficients' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'breastfeeding-calorie-faq', label: 'Frequently Asked Questions' },
];

export const BREASTFEEDING_CALORIE_FAQS: readonly FAQItem[] = [
  {
    question: 'How are daily energy needs calculated?',
    answer:
      'The tool uses the IOM/NAS Dietary Reference Intakes Estimated Energy Requirement (EER) for adolescent or adult women, then adds the DRI pregnancy energy-deposition or lactation milk-output adjustment for your selected state.',
  },
  {
    question: 'Why +330 kcal for the first six months of lactation?',
    answer:
      'IOM tables model about 500 kcal/day of milk energy output minus about 170 kcal/day mobilized from postpartum fat stores, for a net addition of 330 kcal/day in months 0–6. After six months the net addition is 400 kcal/day (assuming stable weight).',
  },
  {
    question: 'What do the pregnancy trimester additions mean?',
    answer:
      'First trimester adds 0 kcal/day to non-pregnant EER. Second trimester adds 340 kcal/day. Third trimester adds 452 kcal/day. These are the DRI energy-deposition allowances used with the same EER model.',
  },
  {
    question: 'What does “Little/no exercise” mean?',
    answer:
      'It is the sedentary DRI physical-activity coefficient (PA = 1.00): typical daily living without planned exercise. Light, moderate, and heavy options map to low-active, active, and very-active PA values (adult 1.12 / 1.27 / 1.45; adolescent 1.16 / 1.31 / 1.56).',
  },
  {
    question: 'Worked example?',
    answer:
      'Age 30, height 165 cm, weight 65 kg, little/no exercise, lactation 0–6 months: non-pregnant EER ≈ 1,953 kcal; plus 330 ≈ 2,283 kcal/day (rounded).',
  },
  {
    question: 'Is personal health data stored or shared?',
    answer:
      'No. Age, height, weight, and results stay in your browser for this session. Share uses only the public calculator page URL—not your measurements or energy estimate.',
  },
  {
    question: 'Is currency conversion involved?',
    answer: 'No. This calculator uses age, height, weight, and kilocalories only.',
  },
];
