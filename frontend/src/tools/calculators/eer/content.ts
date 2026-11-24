import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EER_CALCULATOR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'EER Calculator' },
  { id: 'formula', label: 'IOM DRI equations' },
  { id: 'activity', label: 'Physical activity' },
  { id: 'pregnancy', label: 'Pregnancy & lactation' },
  { id: 'faq', label: 'FAQ' },
];

export const EER_CALCULATOR_FAQS: readonly FAQItem[] = [
  {
    question: 'Which EER equations does this calculator use?',
    answer:
      'Adult (≥19 years) Estimated Energy Requirement equations from the Institute of Medicine Dietary Reference Intakes for Energy (2002/2005). Height enters the equation in meters; weight in kilograms; physical activity uses the published sex-specific PA coefficients for sedentary, low active, active, and very active categories.',
  },
  {
    question: 'Are pregnancy and breastfeeding calories included in the EER result?',
    answer:
      'No. The displayed EER is the non-pregnant adult baseline. The listed trimester and postpartum additions (0 / 340 / 452 and 330 / 400 kcal/day) are educational IOM offsets you may add separately when relevant.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. This is an educational estimate for healthy adults. Individual needs vary; consult a clinician or registered dietitian for personalized nutrition planning.',
  },
];
