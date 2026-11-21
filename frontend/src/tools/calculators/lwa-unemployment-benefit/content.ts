import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { LOAN_CALCULATOR_HREF } from './types';

export const LWA_UNEMPLOYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-was-lwa', label: 'What Was Lost Wages Assistance?' },
  { id: 'why-retired', label: 'Why This Calculator Is Retired' },
  { id: 'where-to-go', label: 'Where to Go Next' },
  { id: 'lwa-unemployment-faq', label: 'Frequently Asked Questions' },
];

export const LWA_UNEMPLOYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I still claim Lost Wages Assistance (LWA)?',
    answer:
      'No. LWA was a temporary 2020 FEMA-administered program authorized by presidential memorandum under the Stafford Act. Supplemental lost-wages payments ended by December 27, 2020 (and earlier in some states). This page is a historical notice only and does not estimate current benefits.',
  },
  {
    question: 'Was LWA an “LWA Act” passed by Congress?',
    answer:
      'No. LWA was not a separately enacted “LWA Act.” It was authorized by the August 8, 2020 Presidential Memorandum on Other Needs Assistance for COVID-19 major disaster declarations and administered through FEMA grants to states and territories.',
  },
  {
    question: 'How did LWA relate to the CARES Act?',
    answer:
      'LWA followed the expiration of the CARES Act’s Federal Pandemic Unemployment Compensation ($600/week) when Congress had not yet reauthorized a similar supplement. Some states used Coronavirus Relief Fund amounts under the CARES Act to help meet a state match for a $400 weekly LWA option. LWA itself was FEMA Other Needs Assistance, not a CARES Act entitlement.',
  },
  {
    question: 'Does this page calculate a weekly LWA payment?',
    answer:
      'No. The screenshot for this tool is informational only. We do not invent payout amounts, application deadlines, or state-specific eligibility rules.',
  },
  {
    question: 'Which calculator should I use instead?',
    answer: `Use the Loan Calculator (${LOAN_CALCULATOR_HREF}) to estimate monthly loan installments and total interest. The Personal Loan Calculator catalog row is not yet an activated public calculator on this site.`,
  },
];
