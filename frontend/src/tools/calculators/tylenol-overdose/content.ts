import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TYLENOL_OVERDOSE_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Tylenol overdose worksheet' },
  { id: 'rumack-matthew', label: 'Rumack–Matthew nomogram' },
  { id: 'tylenol-overdose-faq', label: 'Frequently Asked Questions' },
];

export const TYLENOL_OVERDOSE_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this tool say it is safe to stay home?',
    answer:
      'No. It never issues a safe-at-home determination. Suspected acetaminophen overdose always warrants immediate poison-center or emergency evaluation, even when the educational plot is incomplete or the level is below a published reference line.',
  },
  {
    question: 'When is the Rumack–Matthew plot shown?',
    answer:
      'Only for a single acute oral ingestion with a known serum acetaminophen level drawn in the classic 4–24 hour teaching window. Intravenous, unknown-time, repeated/chronic, and out-of-window exposures follow a separate educational pathway and are not plotted on this nomogram.',
  },
  {
    question: 'Which published lines are used?',
    answer:
      'The classic Rumack–Matthew probable hepatotoxicity line is 200 µg/mL at 4 hours, declining with a 4-hour half-life. The commonly used US treatment (“possible toxicity”) line is 150 µg/mL at 4 hours with the same slope. Concentrations in µg/mL are numerically identical to mg/L.',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only — weight, timing, and serum level are never put in the link.',
  },
];
