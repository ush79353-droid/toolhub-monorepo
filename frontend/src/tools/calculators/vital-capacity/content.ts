import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_NOTE =
  'Baldwin et al. anthropometric vital-capacity estimate (height in cm × sex-specific linear age term, result in liters). Same teaching form as Omni Calculators; not GLI or Hankinson spirometry reference.';

export const DISCLAIMER =
  'Educational predicted vital capacity only. Anthropometric estimates differ from measured spirometry and from IRV+TV+ERV arithmetic (Lung Capacity Calculator). Not a pulmonary diagnosis.';

export const VITAL_CAPACITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Vital Capacity Calculator' },
  { id: 'vc-equation', label: "What's the vital capacity equation?" },
  { id: 'how-to', label: 'How to use the vital capacity calculator' },
  { id: 'related-capacities', label: "What's the total lung, inspiratory, and vital capacity formula?" },
  { id: 'limits', label: 'Limits' },
  { id: 'vital-capacity-faq', label: 'Frequently Asked Questions' },
];

export const VITAL_CAPACITY_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this measured vital capacity?',
    answer:
      'No. This worksheet estimates predicted VC from sex, age, and height using the Baldwin anthropometric form. Measured VC requires spirometry.',
  },
  {
    question: 'How is this different from the Lung Capacity Calculator?',
    answer:
      'Lung Capacity sums IRV, TV, ERV, and RV into TLC/VC/FRC/IC. This tool predicts VC from demographics only — no volume inputs.',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Share and copy use the public page URL only; entered vitals never leave your session.',
  },
];