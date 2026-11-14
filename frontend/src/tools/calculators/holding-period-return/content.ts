export const HOLDING_PERIOD_RETURN_TOC_ITEMS = [
  { id: 'what-holding-period-return', label: 'What Holding Period Return Means' },
  { id: 'how-we-calculate', label: 'How We Calculate' },
  { id: 'holding-period-return-faq', label: 'Frequently Asked Questions' },
] as const;

export const HOLDING_PERIOD_RETURN_FAQS = [
  {
    question: 'Is holding period return annualized?',
    answer:
      'No. This calculator reports the total return over the holding period you describe with the three inputs. It does not convert the result into an annual rate.',
  },
  {
    question: 'Can the return be negative?',
    answer:
      'Yes. If the current price is below the bought price by more than the dividend income covers, capital gains yield and holding period return are negative.',
  },
  {
    question: 'What if there were no dividends?',
    answer:
      'Enter 0 for dividend income per share. Dividend yield is then 0% and holding period return equals capital gains yield.',
  },
] as const;
