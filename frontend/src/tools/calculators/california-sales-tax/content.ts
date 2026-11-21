import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CALIFORNIA_SALES_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-california-sales-tax', label: 'What Is California Sales Tax?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'cdtfa-data', label: 'Official CDTFA Data' },
  { id: 'california-sales-tax-faq', label: 'Frequently Asked Questions' },
];

export const CALIFORNIA_SALES_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Why do I need a street address and city?',
    answer:
      'California ZIP codes often contain more than one tax jurisdiction. The official CDTFA Tax Rate API requires street, city, and ZIP together so the combined rate can be resolved without guessing.',
  },
  {
    question: 'What happens if multiple rates are returned?',
    answer:
      'Near tax-area boundaries CDTFA may return more than one jurisdiction. This calculator does not pick one automatically; it shows an unavailable result and lists the candidates.',
  },
  {
    question: 'Are exemptions included?',
    answer:
      'No. Results are estimates for a generally taxable purchase. Product exemptions, special taxes, and filing liability are not calculated.',
  },
];
