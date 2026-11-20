import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-gst', label: 'What Is a GST Calculator?' },
  { id: 'gst-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'gst-faq', label: 'Frequently Asked Questions' },
];

export const GST_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I use this calculator?',
    answer:
      'Enter the GST percent and either the gross (GST-inclusive) or net (GST-exclusive) price. The other price and the tax amount update from the last-edited price field. No country default rate is applied.',
  },
  {
    question: 'What formulas are used?',
    answer:
      'From net: Gross = Net × (1 + GST/100) and Tax = Gross − Net. From gross: Net = Gross / (1 + GST/100) and Tax = Gross − Net. Zero GST is allowed (gross = net).',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Gross, net, and tax amount each have independent currencies. Money is normalized into the driver price currency before calculation using stored FX rates. The GST percent is never converted.',
  },
  {
    question: 'Does this apply a country-specific GST rate?',
    answer:
      'No. This is a generic rate tool — enter the percent yourself. It does not invent jurisdiction rates, exemptions, or brackets, and it is not the Canada GST/QST calculator (that is a separate catalog entry). Sales Tax and VAT siblings are also separate.',
  },
];
