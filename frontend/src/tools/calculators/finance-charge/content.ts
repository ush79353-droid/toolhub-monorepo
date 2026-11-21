import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FINANCE_CHARGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fc', label: 'What Is a Finance Charge?' },
  { id: 'six-ways', label: 'Six Ways to Calculate Finance Charges' },
  { id: 'how-to-calculate', label: 'How to Calculate Finance Charge' },
  { id: 'daily-rate', label: 'Understanding Daily Periodic Interest' },
  { id: 'billing-vs-term', label: 'Billing Cycle vs. Given Term' },
  { id: 'minimize', label: 'How to Minimize Finance Charges' },
  { id: 'what-affects', label: 'What Affects Finance Charges?' },
  { id: 'vs-interest', label: 'Finance Charge vs. Interest Rate' },
  { id: 'vs-apr', label: 'Finance Charge vs. APR' },
  { id: 'adb-vs-daily', label: 'Daily Balance vs. Average Daily Balance' },
  { id: 'payments', label: 'How Payments Affect Finance Charges' },
  { id: 'products', label: 'Finance Charges on Different Products' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'disclaimer', label: 'Disclaimer' },
  { id: 'fc-faq', label: 'Frequently Asked Questions' },
];

export const FINANCE_CHARGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How can I pay less for my credit card?',
    answer:
      'Pay interest-bearing balances down when you can, understand any grace period on purchases, avoid carrying promotional balances past their expiration, and compare APRs and fees before borrowing more.',
  },
  {
    question: 'How do you calculate the interest on my credit card?',
    answer:
      'This estimator uses FC = Balance × (APR/100) × (Days/365) with a constant balance. Issuers may instead use average daily balance or daily balance methods with transaction timing.',
  },
  {
    question: 'What are the benefits of having a credit card?',
    answer:
      'Cards can offer payment flexibility and optional rewards, but borrowing costs money when balances carry interest. Benefits never erase the obligation to repay what you spend.',
  },
  {
    question: 'What is the finance charge on a 24% APR?',
    answer:
      'It depends on balance and days. Example: $2,400 at 24% for 30 days → 2,400 × 0.24 × 30/365 ≈ $47.34 under this simple method.',
  },
  {
    question: 'Is a finance charge the same as interest?',
    answer:
      'Interest is a major component of many finance charges. Depending on the product and disclosures, a finance charge may also include certain fees. This calculator’s primary output estimates interest only.',
  },
  {
    question: 'Is APR charged daily or monthly?',
    answer:
      'APR is an annual rate. Issuers often convert it to a daily or monthly periodic rate and apply that rate according to account terms, not necessarily as one lump annual charge.',
  },
  {
    question: 'Can a finance charge be zero?',
    answer:
      'Yes: for example with 0% APR, a zero interest-bearing balance, or when a qualifying grace period applies to certain purchases under the card’s rules.',
  },
  {
    question: 'Does paying the full statement balance eliminate finance charges?',
    answer:
      'Paying the statement balance in full by the due date often preserves a grace period on eligible purchases, but cash advances, special balances, or other terms can still accrue interest.',
  },
  {
    question: 'How is the daily periodic rate calculated?',
    answer:
      'Under this calculator’s 365-day convention: daily rate = APR ÷ (100 × 365). Some products use 360-day bases or other conventions.',
  },
  {
    question: 'What happens if my billing cycle is longer?',
    answer:
      'With a constant balance and simple interest, more days produce a larger finance charge because Days/365 is larger.',
  },
  {
    question: 'How does a lower APR affect finance charges?',
    answer:
      'Holding balance and days fixed, finance charge scales with APR under this simple formula.',
  },
  {
    question: 'How do credit card payments affect interest?',
    answer:
      'Payments reduce the balance used on later days in true daily or average-daily methods. This simplified mode assumes the balance does not change during the period.',
  },
  {
    question: 'What is the difference between finance charge and minimum payment?',
    answer:
      'A finance charge is a borrowing cost for the period. A minimum payment is the smallest amount the issuer requires you to pay, often only a portion of balance plus interest.',
  },
  {
    question: 'Does a balance transfer have a finance charge?',
    answer:
      'Transfers can carry promotional or standard APRs and may include transfer fees. Check the offer terms; fees are separate from this interest estimator.',
  },
  {
    question: 'How can I estimate finance charges for six months?',
    answer:
      'Use Given Term with 6 months. This tool converts months as 6 × (365/12) = 182.5 days, then applies the simple-interest formula.',
  },
  {
    question: 'Why does my credit card statement show a different finance charge?',
    answer:
      'Statements may use average daily balances, multiple APRs, fees, grace periods, compounding, or different day counts. Treat this calculator as an estimate only.',
  },
  {
    question: 'What is the average daily balance method?',
    answer:
      'Sum each day’s balance over the cycle, divide by the number of days, then apply the periodic rate to that average. It differs from assuming one fixed balance for every day.',
  },
  {
    question: 'Does the finance charge include fees?',
    answer:
      'Depending on product rules, disclosed finance charges can include more than periodic interest. This calculator’s main result estimates interest from balance, APR, and days only.',
  },
];
