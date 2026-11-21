import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REALTOR_COMMISSION_VAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-realtor-commission-vat', label: 'What Is Realtor Commission with VAT?' },
  { id: 'realtor-commission-vat-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'realtor-commission-vat-faq', label: 'Frequently Asked Questions' },
];

export const REALTOR_COMMISSION_VAT_FAQS: readonly FAQItem[] = [
  {
    question: 'Is the commission rate VAT-exclusive or VAT-inclusive?',
    answer:
      'VAT-exclusive. Net commission is house price × commission % / 100. VAT is then charged on that net commission only, not on the full house price. Commission gross = net + VAT.',
  },
  {
    question: 'How is owner proceeds calculated?',
    answer:
      'Owner receives = house price − commission gross. Zero commission or VAT is allowed. If fees exceed the price, owner proceeds can be zero or negative.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. House price, commission gross, and owner receives each have independent currencies. Outputs convert from the house-price currency using MongoDB-backed rates. Commission % and VAT % are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Does this include closing costs or agent splits?',
    answer:
      'No. This tool only models VAT-exclusive realtor commission on the house price. It does not invent transfer taxes, closing costs, or buyer/seller agent splits.',
  },
];
