import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OHIO_SALES_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ohio-sales-tax', label: 'What Is Ohio Sales Tax?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'why-unavailable', label: 'Why Rates Are Unavailable' },
  { id: 'ohio-sales-tax-faq', label: 'Frequently Asked Questions' },
];

export const OHIO_SALES_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Why can’t this calculator show an Ohio sales tax amount?',
    answer:
      'Ohio’s combined rate is state plus county and often transit authority taxes. Those rates are jurisdiction-specific and are not published in this project as a verified ZIP→rate table. The tool never invents a single statewide combined rate.',
  },
  {
    question: 'What does the ZIP check do?',
    answer:
      'It validates a five-digit ZIP in the Ohio USPS range 43001–45999 and preserves leading zeros. ZIP alone can still map to multiple tax jurisdictions, so a rate is not guessed from ZIP.',
  },
  {
    question: 'Are product exemptions included?',
    answer:
      'No. Taxable-product exemptions and special rules cannot be determined from purchase amount and ZIP alone.',
  },
];
