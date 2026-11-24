import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OPIOID_CONVERSION_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Opioid Conversion Calculator' },
  { id: 'sources', label: 'Published conversion factors' },
  { id: 'opioid-faq', label: 'Frequently Asked Questions' },
];

export const OPIOID_CONVERSION_FAQS: readonly FAQItem[] = [
  {
    question: 'Where do the conversion factors come from?',
    answer:
      'Oral agents that appear in the CDC 2022 MME table use those factors (morphine 1, oxycodone 1.5, hydromorphone 5, codeine 0.15, tramadol 0.2, fentanyl patch 2.4 per mcg/h). Route-specific SC/IV ratios for morphine, diamorphine, oxycodone SC, alfentanil, and hydromorphone SC follow NHS Scottish Palliative Care Guidelines. Factors are never invented.',
  },
  {
    question: 'What does incomplete cross-tolerance do?',
    answer:
      'It reduces every converted (non-source) equianalgesic dose by the entered percent. CDC guidance and NHS tables warn that calculated equivalents are not automatic switch doses—clinicians commonly reduce ~25–50% (NHS often up to ~30%) and re-titrate. 0% shows full table equivalents for comparison only.',
  },
  {
    question: 'Can I use patch rows for prescribing switches?',
    answer:
      'No. FDA Duragesic labeling states its morphine→patch tables are not for converting from a patch back to another opioid. CDC excludes buprenorphine from the MME table because of partial-agonist ceiling effects; FDA Butrans initiation is categorical, not a linear reverse factor. Patch outputs here are educational approximations only.',
  },
  {
    question: 'Are entered doses stored or shared?',
    answer:
      'No. Doses stay in the browser. Share copies only the public calculator page URL—never clinical inputs.',
  },
];
