import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LUMPSUM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Lumpsum Calculator' },
  { id: 'what-is-lumpsum', label: 'What Is a Lumpsum Investment?' },
  { id: 'what-is-calculator', label: 'What Is a Lumpsum Calculator?' },
  { id: 'how-it-works', label: 'How Does It Work?' },
  { id: 'formula', label: 'Lumpsum Investment Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Returns' },
  { id: 'example', label: 'Calculation Example' },
  { id: 'required-capital', label: 'How Much Should I Invest?' },
  { id: 'compounding', label: 'Compounding Frequency' },
  { id: 'inflation', label: 'How Inflation Affects Lumpsum' },
  { id: 'vs-sip', label: 'Lumpsum vs. SIP' },
  { id: 'risks', label: 'Advantages and Risks' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'lumpsum-faq', label: 'Frequently Asked Questions' },
];

export const LUMPSUM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a lumpsum investment?',
    answer:
      'A lumpsum investment is a one-time deposit of capital that then grows (or shrinks) under a compound-return assumption for a chosen term, unlike SIP, which adds money periodically.',
  },
  {
    question: 'What is a lumpsum calculator?',
    answer:
      'A tool that estimates future value, required starting capital, required return, or required term for a single investment using compound interest and optional inflation adjustment.',
  },
  {
    question: 'How do I calculate lumpsum returns?',
    answer:
      'Use FV = PV × (1 + r/n)^(n t) for periodic compounding, or FV = PV × e^(r t) for continuous compounding. Returns = FV − PV.',
  },
  {
    question: 'What is the lumpsum investment formula?',
    answer:
      'FV = PV (1 + r/n)^(n t), where r is the nominal annual rate as a decimal, n is compounds per year, and t is years. Continuous: FV = PV e^(r t).',
  },
  {
    question: 'How does compound interest work?',
    answer:
      'Interest is earned on both principal and previously credited interest. More frequent compounding generally raises effective annual yield for the same nominal rate.',
  },
  {
    question: 'How much will ₹100,000 grow in 10 years?',
    answer:
      'At 10% compounded annually: about ₹259,374. With monthly compounding the maturity is higher. Change rate, term, and frequency in this calculator for your scenario.',
  },
  {
    question: 'How much should I invest to reach ₹1,000,000?',
    answer:
      'Use Initial Lumpsum mode: enter the goal, expected return, term, and compounding. The calculator solves PV = FV / (1 + r/n)^(n t).',
  },
  {
    question: 'What is the difference between SIP and lumpsum?',
    answer:
      'Lumpsum invests once; SIP invests fixed amounts on a schedule. SIP averages purchase timing; lumpsum puts all capital to work immediately under the growth assumption.',
  },
  {
    question: 'Is lumpsum investment better than SIP?',
    answer:
      'Neither is universally better. Market path, cash-flow needs, and risk tolerance matter. This tool models a single deposit only, compare with the SIP calculator for recurring plans.',
  },
  {
    question: 'Does compounding frequency matter?',
    answer:
      'Yes. For the same nominal rate, monthly or daily compounding usually produces a higher EAR than annual compounding. Continuous compounding is the mathematical upper bound for that rate.',
  },
  {
    question: 'What is the expected rate of return?',
    answer:
      'An assumed nominal annual growth rate. Markets can deliver more or less; results are not guarantees.',
  },
  {
    question: 'How do I calculate required investment capital?',
    answer:
      'Select Initial lumpsum, enter goal, return, term, and compounding. The present value is the capital needed today under those assumptions.',
  },
  {
    question: 'How do I calculate the investment period?',
    answer:
      'Select Investment term, enter PV, FV, and return. t = ln(FV/PV) / (n ln(1+r/n)), or ln(FV/PV)/r for continuous compounding.',
  },
  {
    question: 'What is an inflation-adjusted return?',
    answer:
      'Purchasing-power measures: RealFV = FV / (1+i)^t. Real gain = RealFV − PV. Inflation impact = FV − RealFV.',
  },
  {
    question: 'Does inflation reduce investment returns?',
    answer:
      'Inflation reduces purchasing power of future rupees (or other currency). Nominal FV can look strong while real FV is much lower.',
  },
  {
    question: 'Can a lumpsum investment lose money?',
    answer:
      'Yes. Negative assumed returns or inflation above nominal growth can produce losses in nominal or real terms.',
  },
  {
    question: 'Can I calculate negative investment returns?',
    answer:
      'Yes when mathematically valid for the compounding model (for example annual −5%). Some rate/term combinations are undefined and show an error.',
  },
  {
    question: 'What is the difference between nominal and real returns?',
    answer:
      'Nominal ignores inflation. Real adjusts for purchasing power. EAR converts a nominal rate with a given compounding frequency into an effective yearly rate.',
  },
  {
    question: 'How does monthly compounding differ from annual compounding?',
    answer:
      'Monthly applies r/12 twelve times per year. At 10% nominal for 10 years on ₹100,000, annual FV ≈ ₹259,374 while monthly FV is higher.',
  },
  {
    question: 'How can I estimate a future investment goal?',
    answer:
      'Use Final balance mode with your PV, assumed return, term, and compounding, or reverse-solve capital/rate/term if the goal is known.',
  },
  {
    question: 'Is the lumpsum calculator suitable for mutual funds?',
    answer:
      'It can illustrate compound growth assumptions similar to fund return projections, but it does not model fees, taxes, NAV volatility, or exit loads.',
  },
  {
    question: 'Are the results guaranteed?',
    answer:
      'No. Outputs are deterministic math under your inputs. Actual investments can deviate substantially.',
  },
  {
    question: 'How does investment duration affect future value?',
    answer:
      'Longer terms increase the exponent n t, so growth (or decline) compounds over more periods.',
  },
  {
    question: 'Can I calculate my investment maturity date?',
    answer:
      'Yes. Enter a start date and term; the calculator estimates an end date by adding the term (including fractional years via months).',
  },
  {
    question: 'Can I use the calculator for different currencies?',
    answer:
      'Yes for formatting (INR default). Changing currency does not convert amounts via FX rates in this tool.',
  },
];
