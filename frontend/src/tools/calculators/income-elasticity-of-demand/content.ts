import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INCOME_ELASTICITY_OF_DEMAND_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'what-is-yed', label: 'What Is Income Elasticity of Demand?' },
    { id: 'formula', label: 'Income Elasticity of Demand Formula' },
    { id: 'standard', label: 'Standard Income Elasticity Formula' },
    { id: 'midpoint', label: 'Midpoint Income Elasticity Formula' },
    { id: 'standard-vs-midpoint', label: 'Standard vs Midpoint Method' },
    { id: 'how-to-calculate', label: 'How to Calculate Income Elasticity' },
    { id: 'worked-example', label: 'Complete Income Elasticity Example' },
    { id: 'normal-goods', label: 'Normal Goods and Income Elasticity' },
    { id: 'inferior-goods', label: 'Inferior Goods and Income Elasticity' },
    { id: 'necessity', label: 'Necessity Goods and Income Elasticity' },
    { id: 'luxury', label: 'Luxury Goods and Income Elasticity' },
    { id: 'zero-yed', label: 'What Does Zero Income Elasticity Mean?' },
    { id: 'interpret', label: 'How to Interpret Income Elasticity' },
    { id: 'applications', label: 'Applications of Income Elasticity' },
    { id: 'vs-price', label: 'Income Elasticity vs Price Elasticity' },
    { id: 'vs-cross', label: 'Income Elasticity vs Cross-Price Elasticity' },
    { id: 'factors', label: 'Factors Affecting Income Elasticity' },
    { id: 'mistakes', label: 'Common Calculation Mistakes' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'yed-faq', label: 'Frequently Asked Questions' },
  ];

export const INCOME_ELASTICITY_OF_DEMAND_FAQS: readonly FAQItem[] = [
  {
    question: 'What is income elasticity of demand?',
    answer:
      'Income elasticity of demand (YED) measures how quantity demanded responds to a change in consumer income, holding other relevant factors constant in the measurement.',
  },
  {
    question: 'What does YED stand for?',
    answer: 'YED stands for Income Elasticity of Demand (Y often denotes income).',
  },
  {
    question: 'What is the income elasticity of demand formula?',
    answer: 'YED = %Δ quantity demanded ÷ %Δ income.',
  },
  {
    question: 'How do I calculate income elasticity?',
    answer:
      'Compute percentage changes in income and quantity under Standard or Midpoint rules, then divide quantity change by income change. Preserve signs.',
  },
  {
    question: 'What is the difference between Standard and Midpoint methods?',
    answer:
      'Standard uses period-1 values as the baseline. Midpoint uses the average of both observations, which is symmetric if you reverse the two points.',
  },
  {
    question: 'Why is income elasticity important?',
    answer:
      'It helps classify normal vs inferior goods, forecast demand as incomes change, and inform product and inventory planning.',
  },
  {
    question: 'Can income elasticity be negative?',
    answer:
      'Yes. Negative YED is consistent with an inferior good over the measured income range.',
  },
  {
    question: 'What does negative income elasticity mean?',
    answer:
      'Quantity demanded moved opposite to income; demand fell when income rose, or rose when income fell.',
  },
  {
    question: 'What is a normal good?',
    answer:
      'A good with positive income elasticity: demand tends to rise as income rises under the measured conditions.',
  },
  {
    question: 'What is an inferior good?',
    answer:
      'A good with negative income elasticity under the measured conditions. Inferior does not mean defective or low quality.',
  },
  {
    question: 'What is a necessity good?',
    answer:
      'Often described as a normal good with 0 < YED < 1; demand rises less than proportionally with income.',
  },
  {
    question: 'What is a luxury good?',
    answer:
      'Often described as a normal good with YED > 1; demand rises more than proportionally with income. Prestige alone does not define luxury in this sense.',
  },
  {
    question: 'What does income elasticity greater than 1 mean?',
    answer:
      'Income-elastic normal demand; quantity responds more than proportionally to the income change.',
  },
  {
    question: 'What does income elasticity between 0 and 1 mean?',
    answer:
      'Positive but income-inelastic demand; necessity-type normal good under these observations.',
  },
  {
    question: 'What does income elasticity equal to 1 mean?',
    answer:
      'Unit income elasticity; quantity changes proportionally with income.',
  },
  {
    question: 'What does zero income elasticity mean?',
    answer:
      'Quantity demanded did not change when income changed over the measured interval.',
  },
  {
    question: 'Can income elasticity be undefined?',
    answer:
      'Yes, when income percentage change is zero. Do not display Infinity.',
  },
  {
    question: 'What happens when consumer income does not change?',
    answer:
      'The YED denominator is zero, so elasticity is undefined (or indeterminate if quantity also did not change).',
  },
  {
    question: 'Can quantity demanded decrease as income increases?',
    answer:
      'Yes: that produces negative YED and is consistent with an inferior good in that context.',
  },
  {
    question: 'Is income elasticity the same as price elasticity?',
    answer:
      'No. Price elasticity relates demand to own-price changes. YED relates demand to income changes.',
  },
  {
    question: 'How is income elasticity used in business?',
    answer:
      'Demand forecasting, assortment planning, market segmentation, and scenario analysis when household incomes shift.',
  },
  {
    question: 'Does income elasticity change over time?',
    answer:
      'Yes. It can vary by income level, market, preferences, time horizon, and economic conditions.',
  },
  {
    question:
      'Can one product be a normal good for some consumers and an inferior good for others?',
    answer:
      'Yes. Classification depends on the measured income response for a given group and context.',
  },
  {
    question: 'What factors affect income elasticity?',
    answer:
      'Product type, income level, preferences, substitutes, household characteristics, and observation period.',
  },
  {
    question: 'Why is the Midpoint method used?',
    answer:
      'It reduces dependence on which observation is treated as the baseline and is symmetric when periods are reversed.',
  },
  {
    question: 'Does income elasticity have units?',
    answer:
      'No. YED is a dimensionless coefficient; do not display it as a percent or currency amount.',
  },
  {
    question:
      'What is income elasticity if income increases by 20% and quantity demanded increases by 10%?',
    answer: 'YED = 10 / 20 = 0.50; positive, income-inelastic demand.',
  },
];
