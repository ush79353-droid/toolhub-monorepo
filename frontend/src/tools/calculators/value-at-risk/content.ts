export const VALUE_AT_RISK_TOC_ITEMS = [
  { id: 'what-is-var', label: 'What Is Value at Risk?' },
  { id: 'how-we-calculate', label: 'How We Calculate' },
  { id: 'value-at-risk-faq', label: 'Frequently Asked Questions' },
] as const;

export const VALUE_AT_RISK_FAQS = [
  {
    question: 'Does 5% VaR mean the maximum possible loss?',
    answer:
      'No. Under the parametric model, a 5% VaR is a loss threshold associated with a 5% tail probability. Larger losses remain possible.',
  },
  {
    question: 'Are standard deviation and expected return daily or annual?',
    answer:
      'This calculator treats both as daily rates. The timeframe converts to days (weeks × 7, months × 30, years × 365) so the horizon matches those daily inputs.',
  },
  {
    question: 'What happens if expected return is high?',
    answer:
      'VaR is shown as a non-negative loss amount. If the model factor turns negative, VaR is reported as zero.',
  },
] as const;
