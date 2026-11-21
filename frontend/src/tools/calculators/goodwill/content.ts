import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GOODWILL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-goodwill', label: 'What Is Goodwill Value?' },
  { id: 'formula', label: 'Goodwill Calculation Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Goodwill' },
  { id: 'worked-example', label: 'Complete Goodwill Calculation Example' },
  { id: 'negative-goodwill', label: 'What Is Negative Goodwill?' },
  { id: 'vs-intangibles', label: 'Goodwill vs Intangible Assets' },
  { id: 'vs-book-value', label: 'Goodwill vs Book Value' },
  { id: 'bargain-purchase', label: 'What Is a Bargain Purchase?' },
  { id: 'why-pay-more', label: 'Why Pay More Than Net Assets?' },
  { id: 'financial-statements', label: 'Goodwill in Financial Statements' },
  { id: 'impairment', label: 'Goodwill Impairment' },
  { id: 'amortized', label: 'Is Goodwill Amortized?' },
  { id: 'sold-separately', label: 'Can Goodwill Be Sold Separately?' },
  { id: 'mistakes', label: 'Common Goodwill Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'gw-faq', label: 'Frequently Asked Questions' },
];

export const GOODWILL_FAQS: readonly FAQItem[] = [
  {
    question: 'What is goodwill in accounting?',
    answer:
      'Goodwill is an intangible asset that may arise in a business combination when acquisition consideration exceeds the fair value of identifiable net assets acquired.',
  },
  {
    question: 'What is goodwill value?',
    answer:
      'In this simplified calculator, goodwill value is the positive residual of purchase price minus (fair value of assets − fair value of liabilities).',
  },
  {
    question: 'How do I calculate goodwill?',
    answer:
      'Compute net identifiable assets (assets − liabilities), then subtract that amount from the purchase price. A positive residual is goodwill.',
  },
  {
    question: 'What is the goodwill formula?',
    answer: 'Goodwill = Purchase Price − (Fair Value of Assets − Fair Value of Liabilities).',
  },
  {
    question: 'Is goodwill a tangible asset?',
    answer: 'No. Goodwill is an intangible asset; it has no physical form.',
  },
  {
    question: 'Is goodwill an intangible asset?',
    answer:
      'Yes. Recognized acquired goodwill is typically presented as a noncurrent intangible asset.',
  },
  {
    question: 'Can goodwill be negative?',
    answer:
      'A negative residual is not recorded as a “negative goodwill asset.” It may indicate a potential bargain purchase after reassessment.',
  },
  {
    question: 'What is a bargain purchase?',
    answer:
      'A situation where consideration appears lower than identifiable net assets. Accounting frameworks generally require reassessment before recognizing a gain.',
  },
  {
    question: 'Can goodwill be zero?',
    answer:
      'Yes, when purchase price equals the fair value of identifiable net assets under the simplified model.',
  },
  {
    question: 'Why do companies recognize goodwill?',
    answer:
      'Because acquisition accounting requires recognizing the residual after measuring consideration and identifiable net assets; often reflecting synergies or unidentifiable benefits.',
  },
  {
    question: 'What is the difference between goodwill and book value?',
    answer:
      'Book value uses historical carrying amounts. Acquisition goodwill uses fair values of identifiable net assets at the acquisition date.',
  },
  {
    question: 'What is the difference between goodwill and brand value?',
    answer:
      'Brand or customer-related assets may be separately identifiable intangibles. Goodwill is only the residual after those items are recognized when required.',
  },
  {
    question: 'Is goodwill amortized?',
    answer:
      'Under IFRS, goodwill is not amortized and is tested for impairment. US GAAP generally follows impairment testing; certain private-company alternatives may allow amortization.',
  },
  {
    question: 'What is goodwill impairment?',
    answer:
      'A write-down of recognized goodwill when its recoverable or fair-value-based carrying amount is no longer supportable under applicable rules.',
  },
  {
    question: 'How does goodwill affect the balance sheet?',
    answer:
      'Recognized acquired goodwill appears as an asset. Subsequent impairments reduce its carrying amount.',
  },
  {
    question: 'Does goodwill affect net income?',
    answer:
      'Initial recognition does not create income. Impairment losses (and, under some alternatives, amortization) can reduce net income.',
  },
  {
    question: 'Can internally generated goodwill be recognized?',
    answer:
      'Generally no under IFRS and standard US GAAP; only acquired goodwill from qualifying business combinations is recognized.',
  },
  {
    question: 'Is goodwill the same as purchase premium?',
    answer:
      'They are related concepts. The purchase premium relative to identifiable net assets is what becomes goodwill after proper identification of assets and liabilities.',
  },
  {
    question: 'What assets are included when calculating goodwill?',
    answer:
      'Identifiable assets at fair value; excluding the goodwill residual itself and typically excluding the acquiree’s previously recorded goodwill in a fresh allocation.',
  },
  {
    question: 'Are liabilities included in goodwill calculations?',
    answer:
      'Yes. Assumed liabilities reduce net identifiable assets and therefore increase goodwill for a given purchase price.',
  },
  {
    question:
      'What happens if the fair value of liabilities exceeds the fair value of assets?',
    answer:
      'Net identifiable assets are negative. Goodwill = Purchase Price − (negative net assets), which increases the residual.',
  },
  {
    question: 'How is goodwill calculated in an acquisition?',
    answer:
      'Under the full acquisition method, consideration + NCI + previously held interest − identifiable net assets. This tool uses the simplified P − (A − L) form.',
  },
  {
    question:
      'What is the difference between goodwill and identifiable intangible assets?',
    answer:
      'Identifiable intangibles (patents, brands, customer relationships) are recognized separately when criteria are met. Goodwill is the leftover residual.',
  },
  {
    question: 'Does goodwill represent cash?',
    answer: 'No. Goodwill is not cash and cannot be spent like a cash balance.',
  },
  {
    question: 'Can goodwill be sold separately?',
    answer:
      'Generally No: goodwill is not separable like an individual asset and is typically transferred only with a business.',
  },
  {
    question: 'Why might goodwill decrease after an acquisition?',
    answer:
      'Impairment testing, measurement-period adjustments, or (under certain alternatives) amortization can reduce the carrying amount.',
  },
  {
    question:
      'What is goodwill if the purchase price is $500,000, fair value of assets is $600,000, and fair value of liabilities is $400,000?',
    answer:
      'Net identifiable assets = 600,000 − 400,000 = 200,000. Goodwill = 500,000 − 200,000 = 300,000.',
  },
];
