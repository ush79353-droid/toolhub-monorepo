export const INVESTMENT_TOC_ITEMS = [
  { id: 'what-investment-calculator', label: 'What This Calculator Does' },
  { id: 'how-we-calculate', label: 'How We Calculate' },
  { id: 'investment-faq', label: 'Frequently Asked Questions' },
] as const;

export const INVESTMENT_FAQS = [
  {
    question: 'Does compound frequency change the annual rate?',
    answer:
      'The rate of return is an annual nominal rate. More frequent compounding applies r/n each period, so the effective annual yield rises slightly when n increases.',
  },
  {
    question: 'What does inflation-adjusted value mean?',
    answer:
      'When you enter a positive inflation rate, we divide the final balance by (1 + inflation)^years to express purchasing power in today’s money.',
  },
  {
    question: 'How are additional contributions modeled?',
    answer:
      'Each contribution is added at the beginning or end of the compounding step, scaled when contribution frequency differs from compounding frequency.',
  },
] as const;
