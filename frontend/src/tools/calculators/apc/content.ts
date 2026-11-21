import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const APC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-apc', label: 'What is average propensity to consume?' },
  { id: 'how-to-calculate', label: 'How to calculate APC' },
  { id: 'what-is-disposable-income', label: 'What is disposable income?' },
  { id: 'what-is-consumption', label: 'What is total consumption?' },
  { id: 'advanced-formula', label: 'Advanced APC formula' },
  { id: 'apc-example', label: 'Example of APC calculation' },
  { id: 'apc-vs-mpc', label: 'Difference between APC and MPC' },
  { id: 'why-important', label: 'Why is APC important in economics?' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'apc-faq', label: 'Frequently asked questions' },
];

export const APC_FAQS: readonly FAQItem[] = [
  {
    question: 'Will disposable income decrease if average propensity to consume increases?',
    answer:
      'Not necessarily. APC measures the share of disposable income spent on consumption. APC can rise because consumption rises, income falls, or both: the ratio alone does not tell you which changed.',
  },
  {
    question: 'What is the use of APC in economics?',
    answer:
      'APC helps describe how much of disposable income households spend on average. Economists use it alongside other indicators when studying consumer demand, saving, and aggregate spending.',
  },
  {
    question: 'How do I calculate MPC and APC?',
    answer:
      'APC = C / Yd using totals. MPC = ΔC / ΔYd using changes in consumption and disposable income. APC describes average behavior; MPC describes how spending responds to an income change.',
  },
  {
    question: 'What does an APC of 0.8 mean?',
    answer:
      'It means 80% of disposable income is spent on consumption. Under the simplified model, the remaining 20% is implied saving (APS = 0.2), and APC + APS = 1.',
  },
  {
    question: 'Can APC be greater than 1?',
    answer:
      'Yes. Consumption can exceed current disposable income when households borrow, draw down savings, or use other resources. That is a valid economic outcome, not a calculation error.',
  },
  {
    question: 'What is the relationship between APC and APS?',
    answer:
      'In the simplified consumption–saving framework, APC + APS = 1, where APS = (Yd − C) / Yd.',
  },
  {
    question: 'What is autonomous consumption?',
    answer:
      'In a simplified Keynesian consumption function, autonomous consumption (C₀) is spending that does not depend on current disposable income.',
  },
  {
    question: 'What is a normal value of APC?',
    answer:
      'There is no single universal “normal” APC. It varies with income level, economic conditions, household circumstances, and the measurement period.',
  },
  {
    question: 'Does APC change with income?',
    answer:
      'It can. In the linear consumption model C = C₀ + cYd, APC = C₀/Yd + c, so APC typically falls as disposable income rises when autonomous consumption is positive.',
  },
  {
    question: 'Is APC the same as consumption rate?',
    answer:
      'APC is consumption as a proportion of disposable income, often shown as a ratio or percentage. Everyday “consumption rate” language may mean the same idea, but APC is the standard economic term.',
  },
];
