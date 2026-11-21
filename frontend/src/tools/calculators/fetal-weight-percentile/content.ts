import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FETAL_WEIGHT_PERCENTILE_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Fetal Weight Percentile Calculator' },
    { id: 'hadlock', label: 'Hadlock Estimated Fetal Weight' },
    { id: 'fmf', label: 'FMF Percentile Chart' },
    { id: 'limits', label: 'Limits and Caveats' },
    { id: 'fetal-weight-percentile-faq', label: 'Frequently Asked Questions' },
  ];

export const FETAL_WEIGHT_PERCENTILE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is estimated fetal weight calculated?',
    answer:
      'This tool uses the Hadlock 1985 four-parameter ultrasound model with head circumference, abdominal circumference, femur length, and biparietal diameter in centimeters: log10(EFW) = 1.3596 + 0.0064·HC + 0.0424·AC + 0.174·FL + 0.00061·BPD·AC − 0.00386·AC·FL.',
  },
  {
    question: 'Which percentile chart is used?',
    answer:
      'Fetal Medicine Foundation (FMF) estimated fetal weight centiles from Nicolaides et al., Ultrasound Obstet Gynecol 2018, Table 1 (EFW columns). The published table uses 3rd and 97th centiles where some UIs label 2.5th and 97.5th. Curves are unisex.',
  },
  {
    question: 'Why might another site say the 50th percentile for the same biometry?',
    answer:
      'Different products use different growth standards. For the screenshot fixture (20 weeks, AC 154 mm, HC 180 mm, BPD 56.2 mm, FL 30 mm), Hadlock EFW is 334.37 g. On FMF EFW knots at 20 weeks that weight sits between the 25th and 50th centiles (median ≈ 346 g), not exactly on the 50th.',
  },
  {
    question: 'What does normal range mean here?',
    answer:
      'Within the FMF 10th–90th EFW band for the entered gestational age. It is a statistical band, not a diagnosis of fetal health.',
  },
];
