import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_NOTE =
  'Brock / PanCan full model with spiculation (McWilliams et al., N Engl J Med 2013;369:910-9, Table 2 model 2b). Estimates screening-CT nodule malignancy probability — not volume doubling time or measured growth.';

export const DISCLAIMER =
  'Educational Brock probability worksheet only. Not a cancer diagnosis, growth measurement, or care pathway. Confirm with radiology/pulmonology pathways and original publication.';

export const LUNG_NODULE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Lung Nodule Growth Rate Calculator' },
  { id: 'brock', label: 'How to calculate lung nodule cancer risk' },
  { id: 'limits', label: 'What this is not' },
  { id: 'lung-nodule-faq', label: 'Frequently Asked Questions' },
];

export const LUNG_NODULE_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a growth-rate (doubling-time) calculator?',
    answer:
      'No. Despite the catalog title, the reference UI implements the Brock University malignancy probability model from first-screening CT characteristics. Serial sizes/dates for volume doubling time are not on the screenshot.',
  },
  {
    question: 'Which Brock model is used?',
    answer:
      'Full model 2b with spiculation from McWilliams et al. NEJM 2013. Probability = 100 / (1 + exp(−log odds)).',
  },
  {
    question: 'Are answers stored?',
    answer:
      'No. Share uses the public page URL only — never clinical inputs.',
  },
];
