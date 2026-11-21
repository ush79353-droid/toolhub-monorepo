import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MONEY_SUPPLY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Money Supply Calculator' },
  { id: 'what-is', label: 'What Is Money Supply?' },
  { id: 'components', label: 'Components of the Money Supply Calculator' },
  { id: 'm0', label: 'What Is M0 Money Supply?' },
  { id: 'monetary-base', label: 'What Is the Monetary Base?' },
  { id: 'm1', label: 'What Is M1 Money Supply?' },
  { id: 'm2', label: 'What Is M2 Money Supply?' },
  { id: 'm3', label: 'What Is M3 Money Supply?' },
  { id: 'm4', label: 'What Is M4 Money Supply?' },
  { id: 'mzm', label: 'What Is Money Zero Maturity?' },
  { id: 'formulas', label: 'Money Supply Formulas' },
  { id: 'how-to', label: 'How to Calculate Money Supply' },
  { id: 'banking', label: 'How Does Banking Affect the Money Supply?' },
  { id: 'multiplier', label: 'Money Supply and the Money Multiplier' },
  { id: 'inflation', label: 'Money Supply and Inflation' },
  { id: 'aggregate-demand', label: 'Money Supply and Aggregate Demand' },
  { id: 'central-banks', label: 'How Do Central Banks Influence Money Supply?' },
  { id: 'reserve-ratios', label: 'Reserve Ratios and Deposit Multipliers' },
  { id: 'compare', label: 'Differences Between M0, MB, M1, M2, M3, and M4' },
  { id: 'why-important', label: 'Why Is Money Supply Important?' },
  { id: 'limitations', label: 'Limitations of Money Supply Measures' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'money-supply-faq', label: 'Frequently Asked Questions' },
];

export const MONEY_SUPPLY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is money supply?',
    answer:
      'Money supply is a stock measure of monetary assets available in an economy under a chosen definition — typically currency and various deposit and money-market instruments grouped into aggregates such as M1 or M2.',
  },
  {
    question: 'How do you calculate money supply?',
    answer:
      'Select a monetary aggregate definition, enter nonoverlapping component balances in a common unit, then sum the components that belong to each aggregate (for example M1, then M2 = M1 plus eligible add-ons).',
  },
  {
    question: 'What is M0 money supply?',
    answer:
      'In this calculator’s currency-only M0, M0 equals notes plus coins. It is not automatically the same as the monetary base.',
  },
  {
    question: 'What is the monetary base?',
    answer:
      'Here, monetary base (MB) equals currency in circulation plus reserve balances at the central bank — sometimes called high-powered money under simplified accounting.',
  },
  {
    question: 'Is M0 the same as monetary base?',
    answer:
      'Not necessarily. Currency-only M0 excludes reserve balances. MB adds reserves (and uses circulation, which may differ from notes+coins issued).',
  },
  {
    question: 'What is M1 money supply?',
    answer:
      'M1 focuses on highly liquid transaction balances. This tool’s selected models sum currency, demand deposits, traveler’s checks, other checkable deposits, and savings (post–May 2020 U.S.-style illustration).',
  },
  {
    question: 'What is M2 money supply?',
    answer:
      'M2 equals M1 plus eligible money market fund balances and eligible time deposits under the selected definition, without re-adding savings already in M1.',
  },
  {
    question: 'What is M3 money supply?',
    answer:
      'M3 is a broader aggregate in some jurisdictions. The U.S. Fed discontinued M3 in 2006. Textbook/custom modes here add large time deposits and institutional MMFs to M2.',
  },
  {
    question: 'What is M4 money supply?',
    answer:
      'M4 is jurisdiction-specific (for example historically used in some countries). This tool offers a labeled custom/textbook M4 = M3 + other liquid instruments — unavailable under U.S. Fed-style mode.',
  },
  {
    question: 'What is money zero maturity?',
    answer:
      'MZM is a liquidity-oriented educational aggregate of balances redeemable at par with essentially zero maturity, excluding time deposits in this calculator’s illustration.',
  },
  {
    question: 'What is the difference between M1 and M2?',
    answer:
      'M2 includes M1 plus less liquid but still monetary instruments such as eligible time deposits and retail money market funds under the selected rules.',
  },
  {
    question: 'What is the difference between M2 and M3?',
    answer:
      'Where defined, M3 typically adds larger or wholesale instruments beyond M2. Availability and composition depend on the statistical authority.',
  },
  {
    question: 'What is included in M1?',
    answer:
      'In this model: currency in circulation, demand deposits, traveler’s checks, other checkable deposits, and savings deposits — each entered once to avoid double counting.',
  },
  {
    question: 'Are savings deposits included in M1?',
    answer:
      'In the U.S.-style and textbook illustrations used here, yes (reflecting the May 2020 U.S. definitional change). Other countries may classify savings differently.',
  },
  {
    question: 'What are checkable deposits?',
    answer:
      'Deposits that can generally be withdrawn or transferred on demand by check, card, or electronic payment — including demand deposits and other checkable deposits in this tool.',
  },
  {
    question: 'Are credit cards part of money supply?',
    answer:
      'No. Credit cards are borrowing facilities, not monetary assets. Using a card creates a loan, not a money-stock balance.',
  },
  {
    question: 'Do bank reserves count toward money supply?',
    answer:
      'Reserve balances are part of the monetary base in this calculator. They are not added again into M1/M2 as a separate public money-stock item.',
  },
  {
    question: 'How do banks create deposits?',
    answer:
      'When banks extend loans or buy assets, they typically credit deposit accounts, expanding deposit liabilities subject to capital, liquidity, funding, and demand constraints.',
  },
  {
    question: 'What increases the money supply?',
    answer:
      'Growth in currency held by the public, expansion of included deposits and money-market balances, and definitional or statistical changes can raise measured aggregates.',
  },
  {
    question: 'What decreases the money supply?',
    answer:
      'Withdrawals into non-included instruments, loan repayment that extinguishes deposits, shifts out of measured categories, and some policy or market conditions can reduce aggregates.',
  },
  {
    question: 'How does the Federal Reserve influence money supply?',
    answer:
      'Through interest-rate policy, reserve remuneration, asset purchases/sales, and lending facilities that affect bank funding and balance sheets — not usually a fixed multiplier dial.',
  },
  {
    question: 'Does the Federal Reserve directly control M2?',
    answer:
      'No. The Fed influences conditions that affect M2, but M2 is determined by many public and bank decisions. The Fed does not set M2 as a direct target in the modern framework.',
  },
  {
    question: 'How does the money multiplier work?',
    answer:
      'In simplified teaching models, money supply ÷ monetary base yields a multiplier. Real systems face excess reserves, capital rules, and endogenous credit, so the multiplier is not a mechanical constant.',
  },
  {
    question: 'Can money supply increase without printing physical currency?',
    answer:
      'Yes. Deposit creation and money-market growth can expand M1/M2 without a matching rise in notes and coins.',
  },
  {
    question: 'How does an increase in money supply affect aggregate demand?',
    answer:
      'Easier monetary conditions can support spending and investment through lower financing costs and balance-sheet channels, but the link depends on confidence, credit supply, and policy rates.',
  },
  {
    question: 'Does increasing money supply always cause inflation?',
    answer:
      'No. Inflation also depends on demand relative to capacity, expectations, supply shocks, and velocity. Money growth alone does not guarantee a one-for-one price rise.',
  },
  {
    question: 'How do I calculate the monetary base?',
    answer:
      'Add currency in circulation and reserve balances at the central bank under the selected definition.',
  },
  {
    question: 'Why do money supply definitions differ between countries?',
    answer:
      'Statistical practices, financial structures, and policy needs differ. Labels like M1 or M3 are not globally standardized.',
  },
  {
    question: 'Is M3 still published in the United States?',
    answer:
      'No. The Federal Reserve discontinued M3 publication in 2006. This calculator shows M3 only in textbook/custom modes.',
  },
  {
    question: 'What is the difference between money supply and monetary base?',
    answer:
      'The monetary base is currency plus central-bank reserves. Money supply aggregates (M1, M2, …) measure broader public monetary assets under a chosen definition.',
  },
];
