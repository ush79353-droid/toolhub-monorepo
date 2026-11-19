import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FLORIDA_SALES_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-florida-sales-tax', label: 'What Is Florida Sales Tax?' },
  { id: 'how-rates-are-sourced', label: 'How Rates Are Sourced' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'florida-sales-tax-faq', label: 'Frequently Asked Questions' },
];

export const FLORIDA_SALES_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'What is Florida’s state sales tax rate?',
    answer:
      'Florida’s general state sales tax rate is 6%. Counties may also levy a discretionary sales surtax. This calculator uses the Calendar Year 2026 total surtax rates from Florida DOR Form DR-15DSS.',
  },
  {
    question: 'How does ZIP code map to a county?',
    answer:
      'ZIP→county uses the U.S. Census Bureau 2020 ZCTA-to-county relationship file filtered to Florida. ZCTA codes approximate USPS ZIPs. If a ZIP intersects multiple counties, you must choose the purchase county — the tool never guesses.',
  },
  {
    question: 'Why is discretionary surtax sometimes capped at $5,000?',
    answer:
      'Florida’s discretionary sales surtax generally applies only to the first $5,000 of any single sale of tangible personal property. With only a purchase amount and ZIP, this estimate assumes one taxable item and applies that base cap. Multi-item baskets are not modeled.',
  },
  {
    question: 'Is this the same as Florida DOR PointMatch?',
    answer:
      'No. PointMatch resolves street-address jurisdictions. This tool uses Census ZCTA intersections plus DR-15DSS county totals — suitable for estimates, not address-level filing.',
  },
];
