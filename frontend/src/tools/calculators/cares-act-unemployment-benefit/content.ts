import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { UNEMPLOYMENT_CALCULATOR_HREF } from './types';

export const CARES_ACT_UNEMPLOYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-was-cares', label: 'What Was the CARES Act?' },
  { id: 'why-retired', label: 'Why This Calculator Is Retired' },
  { id: 'where-to-go', label: 'Where to Go Next' },
  { id: 'cares-unemployment-faq', label: 'Frequently Asked Questions' },
];

export const CARES_ACT_UNEMPLOYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I still claim CARES Act unemployment benefits?',
    answer:
      'No. The temporary pandemic unemployment programs created or expanded under the CARES Act (including Federal Pandemic Unemployment Compensation) have ended. This page is a historical notice only and does not estimate current benefits.',
  },
  {
    question: 'Does this page calculate a weekly unemployment payment?',
    answer:
      'No. The screenshot for this tool is informational only. We do not invent payout amounts, durations, or state-specific eligibility rules.',
  },
  {
    question: 'Which calculator should I use instead?',
    answer: `Use the Unemployment Calculator (${UNEMPLOYMENT_CALCULATOR_HREF}) to measure the unemployment rate for a given country. That tool is about the unemployment rate, not pandemic benefit supplements.`,
  },
  {
    question: 'Is the official name “Aid, Response…” or “Aid, Relief…”?',
    answer:
      'The enacted law is the Coronavirus Aid, Relief, and Economic Security Act (Pub. L. 116-136). This page uses the official “Relief” wording.',
  },
];
