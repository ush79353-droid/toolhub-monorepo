import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COBB_DOUGLAS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is the Cobb-Douglas Production Function?' },
  { id: 'formula', label: 'Cobb-Douglas Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Production' },
  { id: 'characteristics', label: 'Characteristics' },
  { id: 'tfp', label: 'What Is Total Factor Productivity?' },
  { id: 'elasticities', label: 'Labor and Capital Elasticity' },
  { id: 'returns-to-scale', label: 'Returns to Scale' },
  { id: 'mpl', label: 'Marginal Product of Labor' },
  { id: 'mpk', label: 'Marginal Product of Capital' },
  { id: 'example', label: 'Manufacturing Example' },
  { id: 'applications', label: 'Applications' },
  { id: 'assumptions', label: 'Assumptions' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'vs-others', label: 'Vs. Other Production Functions' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cobb-douglas-faq', label: 'Frequently Asked Questions' },
];

export const COBB_DOUGLAS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Cobb-Douglas production function?',
    answer:
      'It is a mathematical model relating output Y to total factor productivity A, labor L, and capital K via Y = A L^α K^β, where α and β are output elasticities.',
  },
  {
    question: 'What is the Cobb-Douglas formula?',
    answer:
      'Y = A × L^α × K^β. A scales overall efficiency; α and β measure how sensitive output is to labor and capital.',
  },
  {
    question: 'How do you calculate total production?',
    answer:
      'Raise labor to α, raise capital to β, multiply those terms by A. Example: 2 × 100^0.6 × 50^0.4 ≈ 151.57 output units.',
  },
  {
    question: 'What does total factor productivity mean?',
    answer:
      'A captures technology, organization, and other efficiency factors that raise output for given labor and capital. Higher A means more output from the same inputs.',
  },
  {
    question: 'What does labor elasticity measure?',
    answer:
      'α is the approximate percent change in output from a 1% increase in labor, holding capital and A fixed.',
  },
  {
    question: 'What does capital elasticity measure?',
    answer:
      'β is the approximate percent change in output from a 1% increase in capital, holding labor and A fixed.',
  },
  {
    question: 'What are constant returns to scale?',
    answer:
      'When α + β = 1 (within numerical tolerance), scaling all inputs by the same factor scales output by that same factor.',
  },
  {
    question: 'What are increasing returns to scale?',
    answer:
      'When α + β > 1, proportional input expansion raises output by a larger proportion.',
  },
  {
    question: 'What are decreasing returns to scale?',
    answer:
      'When α + β < 1, proportional input expansion raises output by a smaller proportion.',
  },
  {
    question: 'What happens when labor increases?',
    answer:
      'Output rises if α > 0 and other factors stay fixed, but the marginal gain depends on α and current L (diminishing MPL when 0 < α < 1).',
  },
  {
    question: 'What happens when capital increases?',
    answer:
      'Output rises if β > 0 with labor and A fixed; MPK falls as K rises when 0 < β < 1.',
  },
  {
    question: 'Can labor elasticity be greater than one?',
    answer:
      'Yes mathematically; this calculator allows α > 1 with a warning. Values above 1 are nonstandard for many textbook calibrations.',
  },
  {
    question: 'What is the marginal product of labor?',
    answer:
      'MPL = α A L^(α−1) K^β = α Y/L when L > 0. It approximates extra output from a tiny labor increase.',
  },
  {
    question: 'What is the marginal product of capital?',
    answer:
      'MPK = β A L^α K^(β−1) = β Y/K when K > 0. It approximates extra output from a tiny capital increase.',
  },
  {
    question: 'What is the difference between marginal productivity and average productivity?',
    answer:
      'Average product is Y per unit of an input (Y/L or Y/K). Marginal product is the derivative with respect to that input — the incremental output of a small change.',
  },
  {
    question: 'How is Cobb-Douglas used in economics?',
    answer:
      'It appears in growth theory, firm production analysis, and empirical work estimating elasticities and productivity — as a tractable, CES=1 special case.',
  },
  {
    question: 'Is the Cobb-Douglas production function realistic?',
    answer:
      'It is a useful simplification, not a complete map of every technology. Fit depends on industry, measurement, and identification.',
  },
  {
    question: 'What are the limitations of the Cobb-Douglas model?',
    answer:
      'Constant elasticities, omitted inputs, measurement error, technological change, and endogeneity in estimation can limit causal interpretation.',
  },
  {
    question: 'Can the Cobb-Douglas function have negative inputs?',
    answer:
      'Not in the standard economic model used here. Negative labor or capital is rejected; zero inputs yield zero output when exponents are positive.',
  },
  {
    question: 'How does technological progress affect production?',
    answer:
      'Improvements in technology or organization are often modeled as a higher A, raising Y for the same L and K.',
  },
  {
    question: 'What is the elasticity of substitution in a Cobb-Douglas function?',
    answer:
      'In the standard two-input Cobb-Douglas model, the elasticity of substitution between labor and capital equals 1.',
  },
  {
    question: 'Does constant returns to scale imply constant marginal productivity?',
    answer:
      'No. Constant RTS means α+β=1. Marginal products can still diminish in each input when 0 < α,β < 1.',
  },
  {
    question: 'How can a company estimate its production function?',
    answer:
      'With consistent data on output, labor, and capital (and preferably exogenous variation), firms or researchers estimate A, α, and β statistically. This calculator evaluates a user-supplied parameterization.',
  },
  {
    question: 'What is the difference between Cobb-Douglas and Leontief production functions?',
    answer:
      'Cobb-Douglas allows smooth substitution between labor and capital. Leontief uses fixed proportions (min of input requirements) with zero substitution along rays.',
  },
  {
    question: 'Why do economists use Cobb-Douglas production functions?',
    answer:
      'They are analytically tractable, nest constant returns as α+β=1, have unit elasticity of substitution, and provide a transparent mapping from inputs to output.',
  },
];
