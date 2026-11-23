import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BISHOP_SCORE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Bishop Score Calculator' },
  { id: 'what-is', label: 'What Is the Bishop Score?' },
  { id: 'components', label: 'Five Scored Findings' },
  { id: 'formula', label: 'How the Score Is Calculated' },
  { id: 'position-note', label: 'Cervical Position vs Head Position' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bishop-faq', label: 'Frequently Asked Questions' },
];

export const BISHOP_SCORE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this Bishop score calculator do?',
    answer:
      'It totals the five classic Bishop pelvic-exam items—dilation, effacement, consistency, fetal station, and cervical position—into an educational 0–13 score. It does not recommend induction or predict labor success.',
  },
  {
    question: 'Which Bishop table is used?',
    answer:
      'The classic Bishop EH 1964 table as commonly summarized in clinical references (for example AAFP AFP 2022 Table 2 and StatPearls): dilation and effacement and station 0–3 points; consistency and cervical position 0–2 points.',
  },
  {
    question: 'Why is the “baby’s head position” field about the cervix?',
    answer:
      'The original Bishop item scores whether the cervix is posterior, mid-position, or anterior. Some consumer UIs label that control “baby’s head position,” which is misleading. This tool keeps the familiar label for parity and clarifies that cervical position is what is scored.',
  },
  {
    question: 'When does the score appear?',
    answer:
      'The Bishop score stays blank until you enter a valid dilation. The other four radio groups start on the screenshot defaults so the form matches the reference layout, but a complete scored exam still needs an explicit dilation finding.',
  },
  {
    question: 'Can I enter dilation in millimeters?',
    answer:
      'Yes. Choose mm in the unit selector; the engine converts to centimeters (10 mm = 1 cm) before applying the classic bands, and switching units preserves the physical value.',
  },
  {
    question: 'Does a high score mean induction will work?',
    answer:
      'No. Favorability thresholds are clinical judgments made by clinicians. This calculator only reports the numeric educational total and does not interpret induction odds.',
  },
  {
    question: 'Are my exam findings stored?',
    answer:
      'No. Values stay in your browser session. Share and copy actions use the public tool page URL only—never dilation, radios, or the score.',
  },
];
