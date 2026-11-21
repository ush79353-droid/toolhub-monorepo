import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RESERVE_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Reserve Ratio Calculator' },
  { id: 'what-is-reserve-ratio', label: 'What Is the Reserve Ratio?' },
  { id: 'fractional-reserve-banking', label: 'Fractional Reserve Banking' },
  { id: 'reserve-ratio-formula', label: 'Reserve Ratio Formula' },
  { id: 'calculate-reserve-ratio', label: 'How to Calculate the Reserve Ratio' },
  { id: 'required-reserves', label: 'What Are Required Reserves?' },
  { id: 'calculate-required', label: 'How to Calculate Required Reserves' },
  { id: 'excess-reserves', label: 'What Are Excess Reserves?' },
  { id: 'calculate-excess', label: 'How to Calculate Excess Reserves' },
  { id: 'loanable-funds', label: 'What Are Loanable Funds?' },
  { id: 'money-supply', label: 'How Reserve Ratios Affect Money Supply' },
  { id: 'money-multiplier', label: 'Reserve Ratio and Money Multiplier' },
  { id: 'vs-lcr', label: 'Reserve Ratio vs. LCR' },
  { id: 'vs-nsfr', label: 'Reserve Ratio vs. NSFR' },
  { id: 'advantages-limits', label: 'Advantages and Limitations' },
  { id: 'countries', label: 'Reserve Requirements Across Countries' },
  { id: 'why-hold', label: 'Why Banks Hold Reserves' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'reserve-ratio-faq', label: 'Frequently Asked Questions' },
];

export const RESERVE_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the reserve ratio?',
    answer:
      'The reserve ratio is reserves divided by deposits, usually expressed as a percentage: RR = (R / D) × 100. It summarizes how much of the deposit base is matched by reserve assets under the definitions you choose.',
  },
  {
    question: 'How do you calculate the reserve ratio?',
    answer:
      'Divide total reserves by total deposits and multiply by 100. Example: reserves $100 million and deposits $1,000 million → (100 / 1,000) × 100 = 10%.',
  },
  {
    question: 'What is a required reserve ratio?',
    answer:
      'A required reserve ratio is a minimum ratio (or related requirement) set by a relevant authority for eligible deposits, when such rules apply. It can differ by jurisdiction, institution type, and deposit category, and may be zero.',
  },
  {
    question: 'What is the difference between actual and required reserves?',
    answer:
      'Actual reserves are the reserve assets currently held. Required reserves are the amount implied by deposits and the required ratio (or other regulatory rules). Comparing them yields a surplus (excess) or a shortfall.',
  },
  {
    question: 'How do you calculate required reserves?',
    answer:
      'Required Reserves = Deposits × (required ratio / 100). Example: $1,000 million deposits at 10% → $100 million required reserves.',
  },
  {
    question: 'What are excess reserves?',
    answer:
      'Excess reserves are actual reserves minus required reserves when the difference is positive. If actual reserves are lower, the calculator reports a reserve shortfall rather than calling the negative gap “available excess.”',
  },
  {
    question: 'Can the reserve ratio be zero?',
    answer:
      'Yes. A zero actual ratio means no reserves relative to deposits under your inputs. A zero required ratio can also be a policy setting (for example, the U.S. Federal Reserve set reserve requirement ratios to zero in March 2020). The simple money multiplier is undefined at a zero ratio.',
  },
  {
    question: 'Can the reserve ratio exceed 100%?',
    answer:
      'Yes for the actual reserves-to-deposits ratio if a bank holds more reserves than deposits. The simplified “funds not held as reserves” illustration is then not applicable. Required ratios in the simplified model are capped at 0–100%.',
  },
  {
    question: 'What is fractional reserve banking?',
    answer:
      'In the textbook model, banks hold reserves equal to only a fraction of deposits and expand lending and deposits under simplifying assumptions. Modern banking also depends on capital, liquidity, funding markets, credit demand, and central-bank operations; not a fixed reserve ratio alone.',
  },
  {
    question: 'What is the simple money multiplier?',
    answer:
      'm = 1/r (or 100/RR%). At a 10% reserve ratio, m = 10. It is a theoretical identity under strong assumptions (fixed ratio, no cash leakage, no excess reserves, sufficient loan demand, no binding capital constraints); not a forecast of actual monetary expansion.',
  },
  {
    question: 'How does the reserve ratio affect the money supply?',
    answer:
      'In simplified deposit-expansion models, a lower binding reserve ratio raises the textbook multiplier. In practice, money and credit also respond to interest rates, capital rules, liquidity buffers, borrower demand, and central-bank balance-sheet policy.',
  },
  {
    question: 'What is the difference between reserves and deposits?',
    answer:
      'Deposits are liabilities owed to customers. Reserves are assets (such as eligible central-bank balances and vault cash under applicable definitions) held to settle payments, meet withdrawals, and satisfy rules where they exist.',
  },
  {
    question: 'Are loanable funds equal to deposits minus reserves?',
    answer:
      'Only in a simplified illustration. Real lending capacity also depends on capital, liquidity, funding stability, credit risk, and demand. This calculator labels D − R as “funds not held as reserves,” not unrestricted lending capacity.',
  },
  {
    question: 'Why do banks hold reserves?',
    answer:
      'For payment settlement, customer withdrawals, liquidity management, operational needs, and regulatory or supervisory requirements where applicable; even when formal reserve requirement ratios are zero.',
  },
  {
    question: 'What happens if a bank has insufficient reserves?',
    answer:
      'It may need to borrow reserves, sell assets, attract funding, or face supervisory consequences depending on the regime. This educational tool does not simulate those market or regulatory processes.',
  },
  {
    question: 'What is the difference between LCR and reserve ratio?',
    answer:
      'The liquidity coverage ratio compares high-quality liquid assets with projected 30-day net cash outflows under stress assumptions. A reserve ratio compares reserves with deposits. They are not interchangeable.',
  },
  {
    question: 'What is the difference between NSFR and reserve ratio?',
    answer:
      'The net stable funding ratio assesses available versus required stable funding over a longer horizon. A reserve ratio is a deposits-to-reserves relationship and does not replace NSFR analysis.',
  },
  {
    question: 'How does a central bank influence bank liquidity?',
    answer:
      'Through interest on reserves, open-market operations, standing facilities, reserve requirements (where used), and other balance-sheet tools that affect the cost and availability of settlement balances.',
  },
  {
    question: 'Does a lower reserve requirement always increase lending?',
    answer:
      'No. If other constraints bind (capital, liquidity, funding costs, risk appetite, or weak loan demand) cutting a reserve requirement may have little effect on credit. Treat multiplier stories as teaching devices, not automatic predictions.',
  },
  {
    question: 'How do I calculate reserves from deposits and a reserve ratio?',
    answer:
      'R = D × (r / 100). Example: deposits $2,000 million and ratio 12% → reserves $240 million. Use the calculator’s Reserves mode for this solve.',
  },
];
