import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NOI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-noi', label: 'What Is Net Operating Income?' },
  { id: 'how-to-calculate-noi', label: 'How to Calculate NOI' },
  { id: 'potential-gross-income', label: 'Potential Gross Income' },
  { id: 'effective-gross-income', label: 'Effective Gross Income' },
  { id: 'operating-expenses', label: 'Operating Expenses' },
  { id: 'interpret-noi', label: 'How to Interpret NOI' },
  { id: 'noi-vs-net-income', label: 'NOI vs. Net Income' },
  { id: 'noi-vs-cash-flow', label: 'NOI vs. Cash Flow' },
  { id: 'noi-and-cap-rate', label: 'NOI and Capitalization Rate' },
  { id: 'improve-noi', label: 'How to Improve NOI' },
  { id: 'common-mistakes', label: 'Common NOI Mistakes' },
  { id: 'limitations', label: 'Limitations of NOI' },
  { id: 'noi-faq', label: 'Frequently Asked Questions' },
];

export const NOI_FAQS: readonly FAQItem[] = [
  {
    question: 'Can net operating income be negative?',
    answer:
      'Yes. If annual operating expenses exceed effective gross income, NOI is negative. That signals the property’s operations do not cover operating costs before financing. This calculator preserves negative results instead of forcing them to zero.',
  },
  {
    question: 'Does net operating income take vacancy into account?',
    answer:
      'Yes. Occupancy determines vacancy loss on potential rental income. Effective gross income equals potential gross income minus that vacancy loss. In this model, other income is not automatically reduced by vacancy unless you adjust it yourself.',
  },
  {
    question: 'What are the operating expenses of a real estate property?',
    answer:
      'Typical operating expenses include property taxes, insurance, management fees, repairs and maintenance, owner-paid utilities, cleaning and landscaping, and administrative costs. Mortgage principal and interest, depreciation, income taxes, and one-time capital improvements are not standard NOI operating expenses.',
  },
  {
    question: 'What is the difference between net operating income and net income?',
    answer:
      'NOI is a property-level operating measure before debt service, depreciation, and income taxes. Accounting net income usually reflects financing costs, depreciation, taxes, and other non-operating items. Positive NOI does not guarantee positive accounting profit.',
  },
  {
    question: 'How do you calculate NOI?',
    answer:
      'NOI = Effective Gross Income − Operating Expenses. Build potential gross income from rent and other income, subtract vacancy loss on rent to get EGI, then subtract annual operating expenses.',
  },
  {
    question: 'Does NOI include mortgage payments?',
    answer:
      'No. Standard property NOI excludes mortgage principal and interest (debt service). Financing belongs in cash-flow analysis after NOI, not inside the NOI total itself.',
  },
  {
    question: 'What is potential gross income?',
    answer:
      'Potential gross income is the income a property could generate before vacancy and collection adjustments — typically full-occupancy rental income plus other recurring property income.',
  },
  {
    question: 'What is effective gross income?',
    answer:
      'Effective gross income is potential gross income after vacancy (and, in fuller models, collection) losses. It represents income more closely tied to what operations are expected to collect.',
  },
  {
    question: 'Why is NOI important for real estate investors?',
    answer:
      'NOI summarizes how much income the property produces from operations after operating costs. It supports comparisons across assets, feeds cap-rate analysis, and separates property performance from a specific loan structure.',
  },
  {
    question: 'How does NOI affect cap rate?',
    answer:
      'Cap Rate = (NOI / Property Value) × 100. Higher NOI relative to price raises the cap rate; lower NOI lowers it. Cap rate is only as reliable as the NOI and value assumptions behind it.',
  },
];
