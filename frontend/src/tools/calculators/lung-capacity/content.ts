import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_NOTE =
  'Standard spirometric volume combinations: TLC = IRV+TV+ERV+RV; VC = IRV+TV+ERV; FRC = ERV+RV; IC = IRV+TV (as in Omni Lung Capacity educational worksheet).';

export const DISCLAIMER =
  'Educational lung-volume arithmetic only — not a spirometry report, diagnosis, or substitute for pulmonary function testing.';

export const LUNG_CAPACITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Lung Capacity Calculator' },
  { id: 'tlc', label: 'Total lung capacity' },
  { id: 'vc', label: 'Vital capacity' },
  { id: 'ic', label: 'Inspiratory capacity' },
  { id: 'frc', label: 'Functional residual capacity' },
  { id: 'lung-capacity-faq', label: 'Frequently Asked Questions' },
];

export const LUNG_CAPACITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How are the capacities calculated?',
    answer:
      'TLC sums all four volumes. VC = IRV+TV+ERV. FRC = ERV+RV. IC = IRV+TV. Each capacity appears only when its required volumes are entered.',
  },
  {
    question: 'Can I switch liters and milliliters?',
    answer:
      'Yes. Changing L ↔ mL converts entered values by ×1000 or ÷1000 so the physical volumes stay the same.',
  },
  {
    question: 'Are values stored?',
    answer:
      'No. Share uses the public page URL only — never the volume numbers.',
  },
];
