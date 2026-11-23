import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EJECTION_FRACTION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Ejection Fraction Calculator' },
  { id: 'what-is', label: 'What Is Ejection Fraction?' },
  { id: 'formula', label: 'Formulas Used' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ejection-fraction-faq', label: 'Frequently Asked Questions' },
];

export const EJECTION_FRACTION_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this ejection fraction calculator do?',
    answer:
      'It computes EF% = 100 × stroke volume / end-diastolic volume. Stroke volume can be entered directly, derived as EDV − ESV, or derived from cardiac output and heart rate. It does not grade heart failure.',
  },
  {
    question: 'How is stroke volume found from cardiac output?',
    answer:
      'SV (mL) = 1000 × CO (L/min) ÷ HR (bpm). The factor 1000 converts litres to millilitres so SV matches an EDV entered in mL.',
  },
  {
    question: 'What happens when I switch “I know…” modes?',
    answer:
      'EDV is preserved. Fields that belong to the hidden modes are cleared so leftover ESV or CO/HR values cannot silently affect the new mode.',
  },
  {
    question: 'Can ESV or SV exceed EDV?',
    answer:
      'No. The calculator rejects ESV > EDV and SV > EDV because those states are not usable for this EF identity.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Entries stay in your browser session. Share and copy use the public tool page URL only—never volumes, rates, or the computed EF.',
  },
];
