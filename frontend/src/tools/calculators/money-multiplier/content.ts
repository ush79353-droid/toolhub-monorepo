import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MONEY_MULTIPLIER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Money Multiplier Calculator' },
  { id: 'what-is', label: 'What Is a Money Multiplier?' },
  { id: 'how-works', label: 'How Does the Money Multiplier Work?' },
  { id: 'fractional-reserve', label: 'What Is Fractional Reserve Banking?' },
  { id: 'formula', label: 'Money Multiplier Formula' },
  { id: 'ratios', label: 'Currency-to-Deposit and Reserve-to-Deposit Ratios' },
  { id: 'simple-multiplier', label: 'Simple Money Multiplier Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate the Money Multiplier' },
  { id: 'example', label: 'Money Multiplier Calculation Example' },
  { id: 'how-to-use', label: 'How to Use the Money Multiplier Calculator' },
  { id: 'what-affects', label: 'What Affects the Money Multiplier?' },
  { id: 'monetary-policy', label: 'Money Multiplier and Monetary Policy' },
  { id: 'inflation', label: 'Money Multiplier and Inflation' },
  { id: 'vs-deposit', label: 'Money Multiplier vs. Deposit Multiplier' },
  { id: 'limitations', label: 'Limitations of the Money Multiplier Model' },
  { id: 'relevance', label: 'Relevance in Macroeconomics' },
  { id: 'applications', label: 'Examples and Practical Applications' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'money-multiplier-faq', label: 'Frequently Asked Questions' },
];

export const MONEY_MULTIPLIER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the money multiplier?',
    answer:
      'In this calculator’s simplified model, the money multiplier is the ratio of money supply to monetary base (m = M/B). It describes how large measured money supply is relative to currency plus bank reserves.',
  },
  {
    question: 'How do you calculate the money multiplier?',
    answer:
      'Compute bank reserves from deposits and the reserve ratio (or enter reserves directly), then monetary base B = currency + reserves, money supply M = currency + checkable deposits, and m = M/B when B > 0.',
  },
  {
    question: 'What is the money multiplier formula?',
    answer:
      'm = M/B. Equivalently, when deposits are positive, m = (1 + c)/(r + c) where c is the currency-to-deposit ratio and r is the reserve-to-deposit ratio.',
  },
  {
    question: 'What is the simple money multiplier?',
    answer:
      'The textbook simple deposit multiplier m_d = 1/r, where r is the reserve ratio as a decimal. It assumes no excess reserves and no public currency holdings in the expansion story.',
  },
  {
    question: 'What is the deposit multiplier?',
    answer:
      'Another name for the simple deposit multiplier 1/r under idealized fractional-reserve assumptions. It is not the same as the money-supply multiplier M/B when the public holds currency.',
  },
  {
    question: 'What does a money multiplier of 4 mean?',
    answer:
      'Under these definitions, measured money supply is four times the monetary base. It is an accounting ratio in the model — not automatically proof of stronger growth or higher inflation.',
  },
  {
    question: 'What is the difference between the monetary base and money supply?',
    answer:
      'Here, monetary base B is currency in circulation plus bank reserves. Money supply M is currency plus checkable deposits. Official M1/M2 aggregates can differ in coverage and definitions.',
  },
  {
    question: 'What are checkable deposits?',
    answer:
      'Deposits that holders can generally withdraw or transfer on demand (for example, many transaction accounts). This tool uses a simplified checkable-deposit aggregate.',
  },
  {
    question: 'What is the reserve ratio?',
    answer:
      'Bank reserves divided by checkable deposits, shown as a percentage. The default 10% is a teaching example, not a claim about every country’s legal reserve requirement.',
  },
  {
    question: 'How do bank reserves affect the money multiplier?',
    answer:
      'Higher reserves raise the monetary base for a given currency stock, which tends to lower m = M/B when money supply is unchanged. They also raise r in the (1+c)/(r+c) form.',
  },
  {
    question: 'Does a lower reserve ratio increase the money multiplier?',
    answer:
      'Often yes in this model: lower r reduces B relative to M (or raises 1/r in the simple deposit formula). Real banking systems face capital, liquidity, and demand constraints beyond r alone.',
  },
  {
    question: 'Can the money multiplier be less than one?',
    answer:
      'Yes. If currency plus deposits is smaller than currency plus reserves in this framework, m can fall below 1 (for example when reserves are large relative to deposits).',
  },
  {
    question: 'Can the money multiplier be zero?',
    answer:
      'Only if money supply is zero while the base is positive. If the monetary base is zero, this calculator reports the multiplier as unavailable rather than zero or infinity.',
  },
  {
    question: 'What happens if the reserve ratio is zero?',
    answer:
      'Bank reserves become zero when deposits are finite. Monetary base equals currency alone. The simple deposit multiplier 1/r is undefined; M/B may still be defined if currency > 0.',
  },
  {
    question: 'Can the money multiplier be negative?',
    answer:
      'Not under this tool’s nonnegative inputs. Negative deposits, reserves, currency, or ratios are rejected.',
  },
  {
    question: 'Why does the money multiplier change?',
    answer:
      'Changes in reserves, currency preferences, deposits, policy frameworks, and bank behavior alter M and B (or c and r), so the ratio moves.',
  },
  {
    question: 'What is the currency-to-deposit ratio?',
    answer:
      'c = currency in circulation ÷ checkable deposits. A higher c typically lowers the multiplier in the (1+c)/(r+c) identity for fixed r.',
  },
  {
    question: 'What is the reserve-to-deposit ratio?',
    answer:
      'r = bank reserves ÷ checkable deposits (often equal to the stated reserve ratio when reserves are derived from that ratio).',
  },
  {
    question: 'What is fractional reserve banking?',
    answer:
      'A system in which banks hold reserves that are only a fraction of deposit liabilities and can lend or invest the remainder, subject to regulation, risk management, and funding conditions.',
  },
  {
    question: 'Does the money multiplier cause inflation?',
    answer:
      'No automatic link. Inflation depends on spending, output gaps, expectations, supply shocks, and policy reaction. A higher multiplier alone does not guarantee a particular inflation path.',
  },
  {
    question: 'How does the central bank influence the money supply?',
    answer:
      'Through interest-rate policy, reserve remuneration, asset purchases or sales, lending facilities, and regulatory settings that affect banks’ funding and balance sheets — not usually a fixed mechanical multiplier dial.',
  },
  {
    question: 'What is the difference between M1 and M2?',
    answer:
      'Official aggregates differ by country. Broadly, M1 emphasizes transactions money; M2 adds less liquid deposits and similar instruments. This calculator’s M is a simplified currency-plus-checkable-deposits measure, not a national M1/M2 series.',
  },
  {
    question: 'Is the money multiplier still relevant today?',
    answer:
      'It remains useful for teaching accounting relationships among base, deposits, currency, and reserves. Many modern frameworks emphasize interest rates and endogenous credit rather than a stable multiplier.',
  },
  {
    question: 'What are the limitations of the money multiplier?',
    answer:
      'It abstracts from capital rules, liquidity regulation, credit demand, excess reserves, central-bank operating systems, and differences among monetary aggregates.',
  },
  {
    question: 'How does quantitative easing affect the money multiplier?',
    answer:
      'QE expands central-bank assets and often bank reserves (raising B). If deposits and currency do not rise one-for-one, measured m = M/B can fall even while balance sheets grow. Effects are context-dependent.',
  },
];
