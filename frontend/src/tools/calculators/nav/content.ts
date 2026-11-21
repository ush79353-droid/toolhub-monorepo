import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NAV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Net Asset Value (NAV)?' },
  { id: 'fund-assets', label: 'What Are Fund Assets?' },
  { id: 'fund-liabilities', label: 'What Are Fund Liabilities?' },
  { id: 'nav-formula', label: 'NAV Formula' },
  { id: 'nav-per-share', label: 'NAV per Share Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate NAV' },
  { id: 'mutual-funds', label: 'How NAV Is Used in Mutual Funds' },
  { id: 'nav-vs-price', label: 'NAV vs Market Price' },
  { id: 'performance', label: 'Measuring Fund Performance Using NAV' },
  { id: 'limitations', label: 'Limitations of NAV' },
  { id: 'nav-faq', label: 'Frequently Asked Questions' },
];

export const NAV_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a mutual fund?',
    answer:
      'A mutual fund pools money from many investors and invests in a portfolio managed under stated objectives. Investors typically own shares representing a proportional claim on the fund’s net assets.',
  },
  {
    question: 'What is an ETF?',
    answer:
      'An exchange-traded fund holds a portfolio of assets and trades on an exchange like a stock. Its market price can differ from NAV because of supply and demand, creating premiums or discounts.',
  },
  {
    question: 'What is a closed-end fund?',
    answer:
      'A closed-end fund issues a fixed number of shares that trade on an exchange. Its market price may trade at a premium or discount to NAV.',
  },
  {
    question: 'What is an open-end fund?',
    answer:
      'An open-end fund typically issues and redeems shares at NAV (subject to fund rules and timing). Share count can rise or fall as investors buy or redeem.',
  },
  {
    question: 'How can I calculate NAV per share?',
    answer:
      'Compute fund assets, subtract fund liabilities to get NAV, then divide by outstanding shares greater than zero: NAV per share = (Assets − Liabilities) ÷ Shares.',
  },
  {
    question: 'Is NAV a good metric to measure fund performance?',
    answer:
      'NAV helps track fund net worth, but total return should also consider distributions. A NAV drop after a distribution is not automatically an economic loss to investors who received that cash or reinvested shares.',
  },
  {
    question: 'Can NAV be negative?',
    answer:
      'Mathematically yes if liabilities exceed assets. That is unusual for conventional regulated investment funds under normal operations, but possible in this simplified model.',
  },
  {
    question: 'What happens if outstanding shares are zero?',
    answer:
      'NAV can still be computed from assets and liabilities, but NAV per share is undefined because division by zero is not allowed.',
  },
  {
    question: 'What is the difference between NAV and market capitalization?',
    answer:
      'Fund NAV is assets minus liabilities of the fund. Market capitalization is share price times shares outstanding for equity securities and reflects market pricing of those shares.',
  },
  {
    question: 'How often is NAV calculated?',
    answer:
      'Frequency depends on fund type and policy; many mutual funds strike NAV once per business day; other products may use different schedules.',
  },
];
