import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const VITAMIN_D_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Vitamin D Calculator' },
  { id: 'dri-vs-serum', label: 'DRI vs serum 25(OH)D' },
  { id: 'sources', label: 'Primary sources' },
  { id: 'vitamin-d-faq', label: 'Frequently Asked Questions' },
];

export const VITAMIN_D_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator return for age alone?',
    answer:
      'It looks up the NIH ODS / IOM vitamin D Adequate Intake (infants) or Recommended Dietary Allowance (age 1 year and older) for the matching life-stage row, with IU shown using 1 mcg = 40 IU. It does not invent a clinical supplement prescription.',
  },
  {
    question: 'How is serum vitamin D interpreted?',
    answer:
      'When you choose Yes, enter 25(OH)D in ng/mL or nmol/L. Bands follow NIH ODS Table 1 only (<12, 12–<20, ≥20, and >50 ng/mL). Serum interpretation stays separate from the DRI lookup and never becomes a treatment dose.',
  },
  {
    question: 'Why is the analyte fixed to 25(OH)D?',
    answer:
      'NIH ODS states that serum 25(OH)D is the main indicator of vitamin D status. Circulating 1,25(OH)₂D is not used as a routine status marker here.',
  },
  {
    question: 'Are age or lab values stored or shared?',
    answer:
      'No. Inputs stay in the browser. Share copies only the public calculator page URL—never age or serum values.',
  },
];
