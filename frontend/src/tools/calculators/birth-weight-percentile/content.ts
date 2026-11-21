import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BIRTH_WEIGHT_PERCENTILE_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Birth Weight Percentile Calculator' },
    { id: 'how-it-works', label: 'How the Calculator Works' },
    { id: 'fmf-chart', label: 'FMF Birth-Weight Chart' },
    { id: 'how-to-read', label: 'How to Read the Result' },
    { id: 'limits', label: 'Limits and Caveats' },
    { id: 'birth-weight-percentile-faq', label: 'Frequently Asked Questions' },
  ];

export const BIRTH_WEIGHT_PERCENTILE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does a birth weight percentile mean?',
    answer:
      'It compares a newborn’s weight with a published reference of babies at the same gestational age. Being near the 50th percentile means the weight is close to the reference median for that age — not a health grade by itself.',
  },
  {
    question: 'Which chart does this calculator use?',
    answer:
      'Fetal Medicine Foundation (FMF) birth-weight columns from Nicolaides et al., Ultrasound Obstet Gynecol 2018 (Table 1). It is a unisex population reference for 20+0 to 41+6 weeks. Values between published mid-week knots are linearly interpolated.',
  },
  {
    question: 'Why is this not the same as a fetal ultrasound EFW chart?',
    answer:
      'This tool uses the published birth-weight (BW) centiles from the FMF paper, not the estimated fetal weight (EFW) columns. The paper designs BW references for all babies at a gestational age, including those still in utero, which differs from traditional preterm-only birth registries and from pure ultrasound EFW standards.',
  },
  {
    question: 'Does sex matter?',
    answer:
      'The screenshot-approved calculator has no sex selector. The FMF Table 1 BW reference used here is not sex-specific. Sex-specific tools (for example INTERGROWTH-21st) can give a different band for the same weight.',
  },
  {
    question: 'What if my hospital uses a different chart?',
    answer:
      'Fenton, INTERGROWTH-21st, WHO, and national charts can label the same baby differently. Treat this estimate as educational and follow the chart your care team uses.',
  },
];
