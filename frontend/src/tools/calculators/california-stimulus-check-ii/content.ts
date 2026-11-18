import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CALIFORNIA_STIMULUS_CHECK_II_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'overview-and-history', label: 'Overview & Historical Context' },
  { id: 'eligibility-rules', label: 'Eligibility Rules' },
  { id: 'payment-amounts', label: 'Payment Amounts' },
  { id: 'payment-timing', label: 'Historical Payment Timing' },
  { id: 'program-status', label: 'Program Status Today' },
  { id: 'gss2-faq', label: 'Frequently Asked Questions' },
];

export const CALIFORNIA_STIMULUS_CHECK_II_FAQS: readonly FAQItem[] = [
  {
    question: 'Is Golden State Stimulus II still being paid?',
    answer:
      'No. The Franchise Tax Board states that Golden State Stimulus I & II are complete and that no new GSS payments have been issued since July 15, 2022. This calculator is a historical estimator only.',
  },
  {
    question: 'What California AGI range qualified for GSS II?',
    answer:
      'Published rules required California adjusted gross income of $1 to $75,000 for the 2020 tax year ($37,500 for married filing separately). This calculator models the $1–$75,000 band because the reference form does not include filing status.',
  },
  {
    question: 'How were GSS II payment amounts determined?',
    answer:
      'Amounts came from Cal. Welfare & Institutions Code §8150.2(c) and FTB Public Service Bulletin 2021-18: $500 (SSN + GSS I + dependents), $600 (no GSS I + no dependents), $1,000 (ITIN + GSS I + dependents), or $1,100 (no GSS I + dependents). Filers who got GSS I without claiming a dependent credit did not get GSS II.',
  },
  {
    question: 'When were payments issued historically?',
    answer:
      'Issuance began around August 27, 2021. Direct deposits typically posted within a few business days after issuance; paper checks could take up to about three weeks and were mailed in ZIP-based batches. Required payments were to be issued by July 15, 2022. This tool does not invent a personal payment date.',
  },
  {
    question: 'What filing deadline applied?',
    answer:
      'Generally, the 2020 California return had to be filed by October 15, 2021. Certain ITIN applicants who had applied for but not received an ITIN by that date had an extended filing window through February 15, 2022 under §8150.2(b)(2).',
  },
];
