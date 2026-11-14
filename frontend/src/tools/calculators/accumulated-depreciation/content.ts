import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ACCUMULATED_DEPRECIATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-accumulated-depreciation', label: 'What Accumulated Depreciation Means' },
  { id: 'accumulated-vs-annual', label: 'Accumulated vs Annual Depreciation' },
  { id: 'net-book-value', label: 'Net Book Value' },
  { id: 'straight-line', label: 'Straight-Line Method' },
  { id: 'declining-balance', label: 'Declining-Balance Method' },
  { id: 'sum-of-years', label: "Sum of the Year's Digits" },
  { id: 'units-of-production', label: 'Units of Production' },
  { id: 'worked-examples', label: 'Worked Examples' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'accumulated-depreciation-faq', label: 'Frequently Asked Questions' },
];

export const ACCUMULATED_DEPRECIATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is accumulated depreciation?',
    answer:
      'Accumulated depreciation is the total depreciation recognized on an asset from the day it was placed in service through the reporting date. It is a contra-asset account: it reduces the asset’s carrying amount on the balance sheet without changing the original cost.',
  },
  {
    question: 'How is accumulated depreciation different from annual depreciation?',
    answer:
      'Annual depreciation is the expense for one accounting period. Accumulated depreciation is the running sum of those period amounts (or of units-based charges) through the date you care about. This calculator reports the cumulative figure, not a full period-by-period schedule.',
  },
  {
    question: 'What is net book value?',
    answer:
      'Net book value (carrying amount) equals asset cost minus accumulated depreciation. It is an accounting carrying amount, not an offer price, insurance value, or forced-sale estimate.',
  },
  {
    question: 'Which depreciation method should I use?',
    answer:
      'Straight line spreads cost evenly over useful life. Declining balance front-loads expense. Sum of the year’s digits also front-loads, but from a fixed depreciable base. Units of production ties expense to usage. Pick the method that matches your accounting policy or the question you are modeling; the calculator does not choose for you.',
  },
  {
    question: 'Why does declining balance use a 200% rate?',
    answer:
      'When a rate is not specified on the reference inputs, this tool uses double-declining balance: annual rate = 2 ÷ useful life. Each year is still capped so book value does not fall below salvage. That true-up stays inside declining balance; the tool does not silently switch to straight-line.',
  },
  {
    question: 'Can book value fall below salvage value?',
    answer:
      'No. Under every method here, cumulative depreciation stops at cost minus salvage, so net book value does not go below salvage for these standard scenarios.',
  },
  {
    question: 'Does changing the currency convert the amounts?',
    answer:
      'No. The currency selector only changes the symbol and grouping. Enter cost and salvage in one currency. The calculator does not call an exchange-rate service or rewrite the numbers when you switch codes.',
  },
  {
    question: 'Is this tax depreciation?',
    answer:
      'No. The page models common book methods for learning and planning. Tax rules (for example MACRS in the United States) can use different lives, conventions, and tables. Confirm any filing with a qualified advisor and the rules that apply to you.',
  },
];
