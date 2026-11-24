import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GRACE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'GRACE Calculator' },
  { id: 'what-is', label: 'What Is GRACE 1.0?' },
  { id: 'variables', label: 'Score Variables' },
  { id: 'categories', label: 'Risk Categories' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'grace-faq', label: 'Frequently Asked Questions' },
];

export const GRACE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this GRACE calculator compute?',
    answer:
      'It sums the published GRACE 1.0 point variables from Granger 2003 and maps the total to educational in-hospital mortality risk categories (low, intermediate, high). It does not use the GRACE 2.0 continuous mortality equation.',
  },
  {
    question: 'When is the score shown?',
    answer:
      'All numeric fields must be filled, Killip class selected, and each yes/no clinical item answered explicitly. Unset answers are not treated as “no.”',
  },
  {
    question: 'How is creatinine converted?',
    answer:
      'If you enter µmol/L, the tool divides by 88.4 to obtain mg/dL before applying the published creatinine point tiers.',
  },
  {
    question: 'What are the risk categories?',
    answer:
      'Published educational bands: total ≤108 low (<1% in-hospital mortality category); 109–140 intermediate (1–3%); >140 high (>3%).',
  },
  {
    question: 'Are my clinical entries shared?',
    answer:
      'No. Values stay in your browser. Copy and share use the public page URL only — never vitals, labs, or the numeric score.',
  },
];