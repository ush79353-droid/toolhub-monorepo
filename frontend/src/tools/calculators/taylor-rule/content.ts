import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TAYLOR_RULE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Taylor Rule Calculator' },
  { id: 'what-is', label: 'What Is the Taylor Rule?' },
  { id: 'formula', label: 'Taylor Rule Formula' },
  { id: 'how-it-works', label: 'How Does the Taylor Rule Work?' },
  { id: 'how-to-calculate', label: 'How to Calculate the Rate' },
  { id: 'inflation-gap', label: 'What Is the Inflation Gap?' },
  { id: 'output-gap', label: 'What Is the Output Gap?' },
  { id: 'neutral-rate', label: 'What Is the Neutral Real Rate?' },
  { id: 'taylor-principle', label: 'Understanding the Taylor Principle' },
  { id: 'vs-actual', label: 'Taylor Rule vs. Actual Fed Funds Rate' },
  { id: 'advantages', label: 'Advantages of the Taylor Rule' },
  { id: 'limitations', label: 'Limitations of the Taylor Rule' },
  { id: 'when-useful', label: 'When Is the Taylor Rule Useful?' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'taylor-rule-faq', label: 'Frequently Asked Questions' },
];

export const TAYLOR_RULE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Taylor rule?',
    answer:
      'The Taylor rule is a monetary-policy guideline that maps inflation relative to target and the output gap into a recommended nominal policy interest rate, using a neutral real rate and response coefficients.',
  },
  {
    question: 'What is the Taylor rule formula?',
    answer:
      'i = r* + π + a(π − π*) + b·y, with standard a = b = 0.5. Here i is the implied nominal policy rate, r* the neutral real rate, π current inflation, π* the target, and y the output gap in percent.',
  },
  {
    question: 'How do you calculate the federal funds rate using the Taylor rule?',
    answer:
      'Compute the inflation gap and output gap, then apply the formula. Example: r*=2%, π=4%, π*=2%, y=5% → i = 2+4+0.5(2)+0.5(5) = 9.5%. This is a benchmark, not necessarily the actual federal funds rate.',
  },
  {
    question: 'What is the inflation gap?',
    answer:
      'Inflation gap = π − π*, expressed in percentage points. Example: 4% − 2% = 2 percentage points.',
  },
  {
    question: 'What is the output gap?',
    answer:
      'Output gap = ((Y − Y*) / Y*) × 100, where Y is actual GDP and Y* is potential GDP. Prefer real GDP for economically meaningful comparisons.',
  },
  {
    question: 'What is potential GDP?',
    answer:
      'Potential GDP is an estimate of the output level an economy can sustain with normal utilization of labor and capital, without generating unsustainable inflation pressures.',
  },
  {
    question: 'What is the neutral real interest rate?',
    answer:
      'r* is the estimated real policy rate consistent with inflation near target and output near potential. It is not directly observed and must be assumed or estimated.',
  },
  {
    question: 'What does a positive output gap mean?',
    answer:
      'Actual output exceeds potential output. In the Taylor rule, that typically raises the recommended nominal policy rate, other things equal.',
  },
  {
    question: 'What does a negative output gap mean?',
    answer:
      'Actual output is below potential. That typically lowers the recommended policy rate in the rule, other things equal.',
  },
  {
    question: 'What happens when inflation rises above target?',
    answer:
      'The inflation gap becomes positive. With a = 0.5, each percentage point of excess inflation adds 0.5 points to i beyond the direct π term, and under the Taylor principle the overall response of i to π exceeds one-for-one.',
  },
  {
    question: 'What happens when inflation falls below target?',
    answer:
      'The inflation gap turns negative, reducing the recommended nominal rate relative to an on-target case, holding other inputs fixed.',
  },
  {
    question: 'Can the Taylor rule recommend negative interest rates?',
    answer:
      'Yes. The formula can produce a negative theoretical rate. This calculator does not silently floor the result at zero; an optional floor is comparison-only.',
  },
  {
    question: 'What are Taylor rule coefficients?',
    answer:
      'a and b scale responses to the inflation gap and output gap. The classic paper uses 0.5 and 0.5; users may explore alternatives in advanced settings.',
  },
  {
    question: 'What is the Taylor principle?',
    answer:
      'It is the idea that the nominal policy rate should respond more than one-for-one to sustained inflation increases (holding other relevant factors fixed) so that the real rate rises when inflation rises.',
  },
  {
    question: 'Does the Federal Reserve follow the Taylor rule exactly?',
    answer:
      'No. The Fed considers a broader information set, including financial conditions, employment mandates, and forward-looking risks. The rule is a benchmark for comparison.',
  },
  {
    question: 'Why can the actual federal funds rate differ from the Taylor rule rate?',
    answer:
      'Data revisions, uncertain potential GDP and r*, supply shocks, financial stability concerns, effective lower bounds, and judgmental discretion all create gaps between rule prescriptions and actual settings.',
  },
  {
    question: 'Who developed the Taylor rule?',
    answer:
      'Economist John B. Taylor proposed the well-known interest-rate rule in the early 1990s as a simple description of good monetary-policy practice.',
  },
  {
    question: 'What is the difference between nominal and real interest rates?',
    answer:
      'Nominal rates are stated in money terms. Real rates adjust for inflation. An approximate ex-ante real rate is i − πᵉ when expected inflation is specified.',
  },
  {
    question: 'Can the Taylor rule predict future interest rates?',
    answer:
      'It can frame scenarios under assumed inputs, but it is not a reliable standalone forecast of future policy decisions.',
  },
  {
    question: 'What are the main limitations of the Taylor rule?',
    answer:
      'Uncertain potential GDP and r*, real-time data noise, supply shocks, transmission lags, financial stability, lower-bound episodes, and the omission of many forward-looking considerations.',
  },
];
