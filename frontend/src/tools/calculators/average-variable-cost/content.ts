import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AVC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'avc-formula', label: "What's the Average Variable Cost Formula?" },
  { id: 'what-is-avc', label: 'What Is Average Variable Cost?' },
  { id: 'variable-vs-fixed', label: 'Variable Costs vs Fixed Costs' },
  { id: 'how-to-calculate', label: 'How to Calculate Average Variable Cost' },
  { id: 'worked-example', label: 'Average Variable Cost Calculation Example' },
  { id: 'avc-vs-atc', label: 'AVC vs Average Total Cost' },
  { id: 'avc-vs-mc', label: 'AVC vs Marginal Cost' },
  { id: 'output-effect', label: 'How Does Output Affect AVC?' },
  { id: 'pricing', label: 'How Businesses Use AVC in Pricing' },
  { id: 'common-mistakes', label: 'Common Mistakes When Calculating AVC' },
  { id: 'limitations', label: 'AVC Calculator Limitations' },
  { id: 'avc-faq', label: 'Frequently Asked Questions' },
];

export const AVC_FAQS: readonly FAQItem[] = [
  {
    question: 'What is average variable cost?',
    answer:
      'Average variable cost (AVC) is total variable production cost divided by total output for a period: the variable cost per unit of output.',
  },
  {
    question: 'How do I calculate average variable cost?',
    answer: 'AVC = VC / Q, where VC is total variable costs and Q is positive output.',
  },
  {
    question: 'What costs are included in variable costs?',
    answer:
      'Typically volume-dependent production expenses such as direct materials, piece-rate labor, variable packaging, and similar output-linked costs. Classification depends on the business and activity level.',
  },
  {
    question: 'What is the difference between average variable cost and marginal cost?',
    answer:
      'AVC averages variable cost across all units produced. Marginal cost measures the incremental cost of producing one more unit (or an incremental quantity). They are related but not generally equal.',
  },
  {
    question: 'Can average variable cost be zero?',
    answer:
      'Yes, when total variable costs are zero and output is positive, AVC is $0 per unit.',
  },
  {
    question: 'Can average variable cost be negative?',
    answer:
      'Not under the standard nonnegative production-cost model used here. Negative VC is rejected.',
  },
  {
    question: 'What happens if total output is zero?',
    answer:
      'AVC is undefined. This calculator does not divide by zero and does not invent a zero AVC.',
  },
  {
    question: 'How do I calculate total variable costs from AVC?',
    answer: 'VC = AVC × Q when output is positive.',
  },
  {
    question: 'How do I calculate output from variable costs and AVC?',
    answer:
      'Q = VC / AVC when AVC is positive. If both VC and AVC are zero, output is not uniquely determined.',
  },
  {
    question: 'Is average variable cost the same as average total cost?',
    answer:
      'No. ATC includes average fixed cost as well: ATC = AFC + AVC. AVC excludes fixed costs.',
  },
  {
    question: 'Does average variable cost always decrease when output increases?',
    answer:
      'No. Efficiency, diminishing returns, and capacity constraints can raise or lower AVC as output changes.',
  },
  {
    question: 'What is AVC if variable costs are $12,000 and 400 units are produced?',
    answer: 'AVC = 12,000 / 400 = $30 per unit.',
  },
];
