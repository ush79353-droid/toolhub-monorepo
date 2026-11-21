import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GDP_GAP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'GDP Gap Calculator' },
  { id: 'what-is', label: 'What Is the GDP Gap?' },
  { id: 'formula', label: 'GDP Gap Formula' },
  { id: 'positive', label: 'What Is a Positive GDP Gap?' },
  { id: 'negative', label: 'What Is a Negative GDP Gap?' },
  { id: 'potential', label: 'What Is Potential GDP?' },
  { id: 'estimating', label: 'How Is Potential GDP Estimated?' },
  { id: 'actual-vs-potential', label: 'Actual GDP vs. Potential GDP' },
  { id: 'examples', label: 'Worked Examples' },
  { id: 'potential-from-gap', label: 'Potential GDP from the Gap' },
  { id: 'actual-from-gap', label: 'Actual GDP from Potential GDP' },
  { id: 'importance', label: 'Why the GDP Gap Matters' },
  { id: 'inflation', label: 'GDP Gap and Inflation' },
  { id: 'unemployment', label: 'GDP Gap and Unemployment' },
  { id: 'vs-growth', label: 'GDP Gap vs. GDP Growth' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gdp-gap-faq', label: 'Frequently Asked Questions' },
];

export const GDP_GAP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the GDP gap?',
    answer:
      'The GDP gap (output gap) is the percentage difference between actual real GDP and estimated potential real GDP, expressed relative to potential GDP.',
  },
  {
    question: 'What is the GDP gap formula?',
    answer:
      'Gap (%) = ((Actual GDP − Potential GDP) / Potential GDP) × 100. The denominator is potential GDP, not actual GDP.',
  },
  {
    question: 'How do you calculate GDP gap?',
    answer:
      'Convert both GDP figures to the same base units, subtract potential from actual, divide by potential, and multiply by 100.',
  },
  {
    question: 'What is a positive GDP gap?',
    answer:
      'Actual GDP exceeds estimated potential GDP. Activity may be above a sustainable level and can coincide with upward price pressures, but it does not guarantee inflation.',
  },
  {
    question: 'What is a negative GDP gap?',
    answer:
      'Actual GDP is below estimated potential GDP, suggesting underutilized capacity. It is not by itself a formal recession definition.',
  },
  {
    question: 'What does a GDP gap of zero mean?',
    answer:
      'Actual GDP equals estimated potential GDP under the chosen estimate. Potential GDP can still be revised later.',
  },
  {
    question: 'What is potential GDP?',
    answer:
      'An estimate of the output an economy can sustainably produce with normal utilization of labor, capital, and other resources — not an exact physical maximum.',
  },
  {
    question: 'How do economists estimate potential GDP?',
    answer:
      'Common approaches include production-function methods, statistical trends, output-gap models, and labor/productivity analysis. Different methods can disagree.',
  },
  {
    question: 'How do I calculate potential GDP from actual GDP and the output gap?',
    answer:
      'Potential = Actual / (1 + Gap/100), requiring Gap > −100% so potential stays positive.',
  },
  {
    question: 'How do I calculate actual GDP using potential GDP?',
    answer:
      'Actual = Potential × (1 + Gap/100), again with Gap > −100%.',
  },
  {
    question: 'Can the GDP gap be negative?',
    answer:
      'Yes. Negative gaps are common when measured output is below estimated potential.',
  },
  {
    question: 'Can the GDP gap exceed 100%?',
    answer:
      'In principle yes if actual output is more than twice potential, though such readings should be checked carefully against data and potential estimates.',
  },
  {
    question: 'What does a GDP gap of -5% mean?',
    answer:
      'Actual GDP is about 5% below estimated potential GDP — spare capacity relative to that estimate.',
  },
  {
    question: 'What are the consequences of a negative output gap?',
    answer:
      'It may be associated with weaker demand, underused capacity, and cyclical unemployment pressures. Outcomes vary; the gap alone does not prove a recession.',
  },
  {
    question: 'Does a positive GDP gap cause inflation?',
    answer:
      'Not automatically. Positive gaps can add inflationary pressure alongside demand, expectations, supply shocks, and monetary conditions.',
  },
  {
    question: 'What is the relationship between the GDP gap and unemployment?',
    answer:
      'Okun-style relationships link output gaps and unemployment empirically; coefficients vary by country and period. There is no universal fixed multiplier.',
  },
  {
    question: 'Is the GDP gap the same as GDP growth?',
    answer:
      'No. The gap compares actual and potential levels at a point in time; growth measures change between periods.',
  },
  {
    question: 'Why is the GDP gap important for monetary policy?',
    answer:
      'It helps frame spare capacity and inflation risks, but it is an estimate with revisions and should not be the sole policy signal.',
  },
  {
    question: 'What is the difference between GDP gap and recession?',
    answer:
      'A recession is typically defined by a sequence of output declines or broader downturn criteria. A negative gap can exist without meeting those criteria.',
  },
  {
    question: 'How reliable are estimates of potential GDP?',
    answer:
      'They are uncertain, revised over time, and model-dependent. Treat output-gap readings as informative estimates, not exact facts.',
  },
];
