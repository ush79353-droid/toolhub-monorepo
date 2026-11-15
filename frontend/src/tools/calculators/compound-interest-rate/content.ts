export const COMPOUND_INTEREST_RATE_TOC_ITEMS = [
  { id: 'what-compound-interest-rate', label: 'What This Rate Means' },
  { id: 'how-we-calculate', label: 'How We Calculate' },
  { id: 'compound-interest-rate-faq', label: 'Frequently Asked Questions' },
] as const;

export const COMPOUND_INTEREST_RATE_FAQS = [
  {
    question: 'Is this the same as APR or APY?',
    answer:
      'This tool solves the annual nominal rate that compounds n times per year to grow the initial balance into the final balance over the term. APY (effective annual yield) is a related but different figure: (1 + r/n)^n − 1.',
  },
  {
    question: 'Why can the rate be negative?',
    answer:
      'When the final balance is below the initial balance, the solved nominal rate is negative. Both balances must still be positive.',
  },
  {
    question: 'What is surplus?',
    answer: 'Surplus is simply final balance minus initial balance. It is not adjusted for inflation or deposits.',
  },
] as const;
