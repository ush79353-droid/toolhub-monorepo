import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_NOTE =
  'TTKG = (urine potassium ÷ serum potassium) ÷ (urine osmolality ÷ serum osmolality), with potassium in mmol/L (mEq/L) and osmolality in mOsm/kg H₂O. Classic teaching (Choi et al.; West et al.) assumes adequately concentrated urine and urine sodium often at least ~25 mmol/L — verify applicability; ratio alone does not establish diagnosis.';

export const URINE_SODIUM_APPLICABILITY_NOTE =
  'Urine sodium concentration should be at least 25 mmol/L (25 mEq/L) for this calculation to be accurate.';

export const DISCLAIMER =
  'Educational transtubular potassium gradient worksheet only — not a diagnosis, treatment plan, or substitute for clinical judgment and full electrolyte context.';

export const TTKG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'TTKG Calculator' },
  { id: 'formula', label: 'TTKG formula' },
  { id: 'usage', label: 'How to use' },
  { id: 'limits', label: 'Limits and caveats' },
  { id: 'ttkg-faq', label: 'Frequently Asked Questions' },
];

export const TTKG_FAQS: readonly FAQItem[] = [
  {
    question: 'What is TTKG?',
    answer:
      'The transtubular potassium gradient estimates renal tubular handling of potassium relative to water reabsorption. It compares urine-to-serum potassium against urine-to-serum osmolality.',
  },
  {
    question: 'What units should I use?',
    answer:
      'Serum and urine potassium in mmol/L (numerically the same as mEq/L). Serum and urine osmolality in mOsm/kg H₂O.',
  },
  {
    question: 'Why is urine sodium mentioned?',
    answer:
      'Classical sources caution that TTKG is most meaningful when urine is sufficiently concentrated and urine sodium is often at least about 25 mmol/L. This tool does not collect urine sodium — verify applicability externally.',
  },
  {
    question: 'Are my lab values stored or shared?',
    answer: 'No. Share uses the public page URL only — never entered labs.',
  },
];