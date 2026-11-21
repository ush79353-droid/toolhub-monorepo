import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cd', label: 'What is a Certificate of Deposit?' },
  { id: 'fdic-backed-cds', label: 'FDIC-backed CDs' },
  { id: 'where-to-purchase', label: 'Where and how to purchase CDs' },
  { id: 'history-of-cds', label: 'History of CDs' },
  { id: 'how-to-use-cds', label: 'How to use CDs' },
  { id: 'withdrawing-from-cd', label: 'Withdrawing from a CD' },
  { id: 'cd-ladder', label: 'CD ladder' },
  { id: 'apy-vs-apr', label: 'APY vs. APR' },
  { id: 'compounding-frequency', label: 'Compounding frequency' },
  { id: 'types-of-cds', label: 'Types of CDs' },
  { id: 'alternatives-to-cds', label: 'Alternatives to CDs' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'cd-faq', label: 'Frequently asked questions' },
];

export const CD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a CD calculator?',
    answer:
      'A CD calculator estimates the maturity value and interest earned on a Certificate of Deposit from the initial deposit, interest rate, compounding frequency, term, and an optional marginal tax rate.',
  },
  {
    question: 'How is CD interest calculated?',
    answer:
      'This tool uses A = P × (1 + r/n)^(n × t), where P is the initial deposit, r is the nominal annual rate as a decimal, n is compounding periods per year, and t is the term in years (including months ÷ 12). Interest is A − P.',
  },
  {
    question: 'What is the difference between APR and APY?',
    answer:
      'APR (nominal annual rate) is divided across compounding periods. APY is the effective annual yield after compounding: APY = (1 + APR/n)^n − 1. Entering APY converts to the matching nominal rate so compounding is not applied twice.',
  },
  {
    question: 'How often does a CD compound interest?',
    answer:
      'It depends on the product. Common frequencies include daily, weekly, monthly, quarterly, semiannually, and annually. Check the CD agreement.',
  },
  {
    question: 'Are CD earnings taxable?',
    answer:
      'Often yes, depending on country, jurisdiction, and account type. In the U.S., CD interest is generally ordinary income and may face federal and state taxes. This calculator’s tax estimate is simplified — not tax advice.',
  },
  {
    question: 'What happens when a CD matures?',
    answer:
      'At maturity you can typically withdraw principal and interest, renew, or roll into a new term. Many institutions offer a short grace period; automatic renewal policies vary.',
  },
  {
    question: 'Can I withdraw money from a CD early?',
    answer:
      'Many traditional CDs charge an early withdrawal penalty. Liquid or no-penalty CDs may allow limited access subject to product rules.',
  },
  {
    question: 'Are CDs FDIC-insured?',
    answer:
      'CDs at FDIC-insured banks are generally covered up to applicable limits (commonly $250,000 per depositor, per insured bank, per ownership category), including accrued interest, subject to FDIC rules. Credit unions may use NCUA coverage instead. Not every product labeled “CD-like” is deposit-insured.',
  },
  {
    question: 'What is a CD ladder?',
    answer:
      'A ladder splits funds across CDs with staggered maturities (for example 1–5 years) to improve liquidity and reinvestment flexibility as each rung matures.',
  },
  {
    question: 'Does a higher compounding frequency increase CD returns?',
    answer:
      'When the nominal APR is held constant, more frequent compounding usually raises effective APY. If the bank quotes APY, that yield already reflects compounding.',
  },
  {
    question: 'Can I lose money in a CD?',
    answer:
      'Deposit insurance can protect principal and accrued interest within limits at eligible institutions. You can still lose purchasing power to inflation, face early withdrawal penalties, or miss higher market rates (opportunity cost).',
  },
  {
    question: 'Is CD interest calculated monthly or daily?',
    answer:
      'Accrual and compounding follow the CD agreement. This calculator applies the standard compound-interest formula with your selected frequency and fractional terms.',
  },
  {
    question: 'What happens if the interest rate changes?',
    answer:
      'Traditional fixed-rate CDs keep the agreed rate for the term. Variable-rate, bump-up, or callable products follow different contractual rules.',
  },
  {
    question: 'How does the marginal tax rate affect CD returns?',
    answer:
      'Estimated tax = gross interest × marginal rate. Net interest = gross interest − tax. After-tax balance = principal + net interest. Tax is not deducted from principal.',
  },
  {
    question: 'What is the difference between a CD and a savings account?',
    answer:
      'CDs usually lock funds for a fixed term at a stated rate (often with early withdrawal penalties). Savings accounts are typically more liquid with variable rates.',
  },
];
