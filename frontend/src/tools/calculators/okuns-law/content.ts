import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OKUNS_LAW_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: "Okun's Law Calculator" },
  { id: 'what-is', label: "What Is Okun's Law?" },
  { id: 'formula', label: "Okun's Law Formula in Macroeconomics" },
  { id: 'growth-gap', label: 'How to Calculate the GDP Growth Gap' },
  { id: 'output-gap', label: 'How to Calculate the Output Gap' },
  { id: 'unemployment-change', label: 'How to Calculate Changes in Unemployment' },
  { id: 'coefficient', label: 'Understanding the Okun Coefficient' },
  { id: 'why-important', label: "Why Is Okun's Law Important?" },
  { id: 'recessions', label: "Okun's Law and Economic Recessions" },
  { id: 'limitations', label: "Limitations of Okun's Law" },
  { id: 'related', label: 'Related Calculators' },
  { id: 'okuns-law-faq', label: 'Frequently Asked Questions' },
];

export const OKUNS_LAW_FAQS: readonly FAQItem[] = [
  {
    question: "What is Okun's Law?",
    answer:
      "Okun's Law is an empirical relationship linking unemployment and real economic activity; typically that stronger growth relative to trend is associated with falling unemployment.",
  },
  {
    question: "What does Okun's Law measure?",
    answer:
      'It summarizes how unemployment gaps relate to output gaps, or how unemployment changes relate to GDP growth gaps, under an estimated coefficient.',
  },
  {
    question: "Who developed Okun's Law?",
    answer:
      'Economist Arthur Okun popularized the empirical unemployment–output relationship in the 1960s; later research refined multiple formulations.',
  },
  {
    question: "What is the formula for Okun's Law?",
    answer:
      'Output-gap form: OutputGap = −β(u − u*). Growth form: Δu = −α(g − g*). Coefficients and definitions are not interchangeable without a specified model.',
  },
  {
    question: "How do you calculate Okun's Law?",
    answer:
      'Choose a formulation, enter the relevant rates and a positive coefficient, then compute the gap or change. This calculator supports four modes.',
  },
  {
    question: 'What is the Okun coefficient?',
    answer:
      'An empirically estimated number describing how strongly unemployment and activity move together in a chosen Okun equation.',
  },
  {
    question: 'What does a negative Okun coefficient mean?',
    answer:
      'Some presentations write the slope as a signed number (e.g. −0.45). Here β and α are entered as positive values and the formulas supply the minus signs.',
  },
  {
    question: 'Can the Okun coefficient be zero?',
    answer:
      'A zero coefficient would imply no link in that model. Inverse calculations that divide by the coefficient are blocked when α ≤ 0.',
  },
  {
    question: "Is Okun's Law always accurate?",
    answer:
      'No. It is empirical and unstable across countries, time, and cycles. Treat results as illustrative estimates.',
  },
  {
    question: 'How are unemployment and GDP growth related?',
    answer:
      'Faster growth often raises labor demand and reduces cyclical unemployment, but lags, productivity, and participation can loosen the link.',
  },
  {
    question: 'What is the output gap?',
    answer:
      'The percent difference between actual and potential real GDP. Here it is estimated from the unemployment gap via Okun’s output-gap equation.',
  },
  {
    question: 'How do you calculate the unemployment gap?',
    answer: 'Unemployment gap = actual unemployment rate − natural rate (percentage points).',
  },
  {
    question: 'What is the natural unemployment rate?',
    answer:
      'A model concept for unemployment consistent with sustainable activity (often related to NAIRU-style ideas). Estimates vary.',
  },
  {
    question: 'What is potential GDP?',
    answer:
      'An estimate of sustainable real output given resources and technology; not directly observed.',
  },
  {
    question: 'What happens when GDP grows faster than trend?',
    answer:
      'In the growth Okun model with positive α, unemployment is estimated to fall (Δu negative).',
  },
  {
    question: 'What happens when GDP growth is negative?',
    answer:
      'Negative growth is allowed. Relative to trend, a large negative growth gap typically maps to rising unemployment under positive α.',
  },
  {
    question: 'Can unemployment rise while GDP is growing?',
    answer:
      'Yes: if growth is below the unemployment-stabilizing trend, or if productivity/participation shifts dominate.',
  },
  {
    question: "How can Okun's Law predict unemployment?",
    answer:
      'Given growth and α, Δu ≈ −α(g − g*). Predictions are rough and coefficient-dependent.',
  },
  {
    question: 'How do you calculate the GDP growth needed to reduce unemployment?',
    answer:
      'Rearrange: g = g* − Δu / α. For a desired fall in unemployment (negative Δu), required g exceeds trend.',
  },
  {
    question: 'What is the difference between actual and trend GDP growth?',
    answer:
      'Actual growth is observed (or assumed); trend growth is the benchmark that stabilizes unemployment in the growth Okun model.',
  },
  {
    question: 'Why does the Okun coefficient vary between countries?',
    answer:
      'Labor institutions, productivity, hours, demographics, and measurement practices differ, so estimated slopes differ.',
  },
  {
    question: "What are the limitations of Okun's Law?",
    answer:
      'Instability over time, structural change, measurement error, hours adjustments, and non-causal associations.',
  },
  {
    question: "Is Okun's Law useful during a recession?",
    answer:
      'It can organize thinking about jobless recoveries and deep downturns, but recession coefficients often deviate from expansions.',
  },
  {
    question: 'How do economists estimate the Okun coefficient?',
    answer:
      'Typically with regression on historical unemployment and GDP (or gaps), with careful treatment of trends and endogeneity.',
  },
  {
    question: "Can Okun's Law be used for economic forecasting?",
    answer:
      'As a rough cross-check yes; as a standalone forecast model it is usually too simple and unstable.',
  },
];
