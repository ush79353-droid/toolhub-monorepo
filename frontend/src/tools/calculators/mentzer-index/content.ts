import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MENTZER_INDEX_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Mentzer Index' },
  { id: 'how-it-works', label: 'How the Mentzer index works' },
  { id: 'limitations', label: 'Screening limitations' },
  { id: 'mentzer-faq', label: 'Frequently Asked Questions' },
];

export const MENTZER_INDEX_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Mentzer index?',
    answer:
      'It is mean corpuscular volume (MCV, fL) divided by the red blood cell count expressed in millions per microliter (or the equivalent million/mm³). Mentzer described the index in 1973 as a simple CBC screen for microcytosis.',
  },
  {
    question: 'What does a Mentzer index below or above 13 mean?',
    answer:
      'Teaching sources commonly use 13 as the cutoff: values below 13 are said to favor β-thalassemia trait, and values above 13 to favor iron-deficiency anemia. An index of exactly 13 is borderline. The index is a screening aid only — confirm with iron studies and hemoglobin electrophoresis when clinically indicated.',
  },
  {
    question: 'Are my lab values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only.',
  },
];
