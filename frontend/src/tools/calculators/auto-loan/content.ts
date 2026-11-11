import type { FAQItem } from '@/components/shared/FAQAccordion';

export interface AutoLoanGuideSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  formula?: string;
}

export const AUTO_LOAN_HOW_TO_USE: readonly string[] = [
  'Enter the negotiated vehicle price and choose your display currency (for formatting only).',
  'Enter your down payment as either a fixed amount or a percentage of the vehicle price, then select your loan term in months or years and expected annual interest rate (APR).',
  'Add any trade-in vehicle value and remaining payoff balance (if you still owe on your current loan) to calculate net trade-in equity.',
  'Enter your estimated sales tax rate and dealer/registration fees, and choose whether tax applies after trade-in allowance or to the full vehicle price, and whether to finance tax and fees or pay them upfront.',
  'Review your estimated monthly payment, total interest, upfront cash needed, payoff date, principal-vs-interest breakdown, and download the monthly or yearly amortization schedule as CSV.',
];

export const AUTO_LOAN_GUIDE_SECTIONS: readonly AutoLoanGuideSection[] = [
  {
    id: 'what-is-auto-loan',
    title: 'What Is an Auto Loan Calculator?',
    paragraphs: [
      'An auto loan calculator helps vehicle buyers estimate monthly financing payments, total interest charges, upfront cash due at signing, and total vehicle acquisition cost before visiting a dealership or lender.',
      'Unlike basic loan estimators that only divide a principal balance by term length, an auto loan calculation depends on how down payments, trade-in equity, sales taxes, and dealer or title fees interact.',
      'All figures shown here are mathematical estimates generated directly in your browser for planning purposes and do not represent a formal loan offer, credit approval, or dealer contract.',
    ],
  },
  {
    id: 'monthly-payment-formula',
    title: 'How Monthly Payments Are Calculated',
    paragraphs: [
      'Most fixed-rate vehicle loans use a standard monthly amortizing formula. Each monthly payment covers interest accrued on the remaining principal balance for that month, with the remainder reducing principal.',
      'When the annual percentage rate (APR) is greater than 0%, the periodic monthly rate r equals APR / 12, and the scheduled payment M across n months is derived from the financed principal P:',
    ],
    formula: 'M = P × r × (1 + r)^n / ((1 + r)^n − 1)   (or M = P / n when APR = 0%)',
    bullets: [
      'M = Estimated fixed monthly payment',
      'P = Amount financed (vehicle price − down payment − net trade-in equity + financed tax + financed fees)',
      'r = Monthly interest rate (Annual Interest Rate ÷ 12 ÷ 100)',
      'n = Total number of monthly payments',
      'Final payment adjustment: Because payments round to the nearest cent, the final installment adjusts slightly so the ending balance reaches zero cleanly.',
    ],
  },
  {
    id: 'down-payments',
    title: 'Understanding Down Payments',
    paragraphs: [
      'A down payment is the upfront cash you put toward the vehicle purchase at signing. Increasing your down payment reduces the amount financed dollar-for-dollar, which lowers both your monthly payment and cumulative interest.',
      'You can enter a fixed currency amount or switch to percentage mode to model common down payment targets (such as 10% or 20% of the vehicle price).',
    ],
  },
  {
    id: 'rates-and-terms',
    title: 'Interest Rates and Loan Terms',
    paragraphs: [
      'Loan term length and APR work together to shape both monthly affordability and total borrowing cost. Shorter terms (such as 36 or 48 months) have higher monthly payments but build equity faster and accrue less total interest.',
      'Longer terms (such as 72 or 84 months) lower the required monthly payment, but stretch amortization over more billing cycles, increasing total interest paid over the life of the loan.',
    ],
  },
  {
    id: 'trade-in-equity',
    title: 'Trade-in Equity & Sales Tax Treatment',
    paragraphs: [
      'Net trade-in equity equals your trade-in allowance minus any remaining loan balance owed on that vehicle. Positive equity reduces the amount you need to finance. Negative equity (when you owe more than the trade-in value) rolls the remaining balance into the new loan, increasing your principal and interest cost.',
      'Sales tax rules vary across jurisdictions. Some locations reduce the taxable price by the trade-in allowance, while others tax the full vehicle price regardless of trade-in value. Use the Sales Tax Basis selector in the calculator to model the rule that applies to your purchase.',
    ],
  },
];

export const AUTO_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'Does changing the display currency convert amounts using exchange rates?',
    answer:
      'No. Selecting USD, EUR, GBP, CAD, AUD, INR, PKR, or AED changes number and currency formatting only. Enter all price, trade-in, and fee values in the currency of your loan.',
  },
  {
    question: 'How does financing sales tax and dealer fees affect my loan?',
    answer:
      'Choosing "Finance in loan" adds sales tax or fees to your principal balance, reducing cash due at signing while increasing your monthly payment and total interest paid. Choosing "Pay upfront" includes those costs in Upfront Costs instead.',
  },
  {
    question: 'What happens if I owe more on my trade-in than it is worth?',
    answer:
      'That creates negative trade-in equity. For example, if a trade-in is valued at 5,000 and you owe 7,000, the −2,000 net equity increases your financed amount by 2,000 unless covered by additional down payment.',
  },
  {
    question: 'Why might the final monthly payment differ by a few cents?',
    answer:
      'Because monthly payments and interest charges round to two decimal places (nearest cent) each billing period, a small rounding remainder can accumulate over dozens of months. Adjusting the final payment reconciles total principal to the exact financed amount and brings the ending balance to zero.',
  },
  {
    question: 'Are my loan numbers sent to a server?',
    answer:
      'No. All auto loan calculations, schedule generation, and CSV exports execute completely inside your browser memory.',
  },
];

