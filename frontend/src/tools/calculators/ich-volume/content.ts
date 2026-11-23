import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ICH_VOLUME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'ICH Volume Calculator' },
  { id: 'formula', label: 'ABC/2 and ABC/3' },
  { id: 'weighted', label: 'Weighted Slices' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ich-faq', label: 'Frequently Asked Questions' },
];

export const ICH_VOLUME_FAQS: readonly FAQItem[] = [
  {
    question: 'What does ABC/2 mean?',
    answer:
      'A and B are orthogonal diameters on the largest axial CT slice (cm). C is the craniocaudal extent in cm (slices × thickness, or Kothari-weighted slices × thickness). Volume ≈ A×B×C/2 for ellipsoid hematomas.',
  },
  {
    question: 'When is ABC/3 used?',
    answer:
      'For irregular, separated, or multinodular shapes, this tool uses divisor 3 (Huttner 2006 suggestion) instead of 2. Planimetry remains more accurate for complex shapes.',
  },
  {
    question: 'What do the ≥75% / 25–75% / <25% fields do?',
    answer:
      'They apply Kothari weights (1 / 0.5 / 0) relative to the largest-slice area. If any band is filled, C uses the weighted sum × thickness and Number of slices must match the raw band sum or be blank.',
  },
];
