import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

/** Guide attribution (engine keeps the same wording in SOURCE_LABEL). */
export const CPP_SOURCE_NOTE =
  'CPP = MAP − ICP; MAP ≈ (SBP + 2×DBP)/3. Age bands educational summary of Allen et al. Pediatr Crit Care Med. 2014;15(1):62–70 (not treatment targets). ICP context: Hawryluk et al. Intensive Care Med. 2022;48:1471–1481.';

export const CPP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Cerebral Perfusion Pressure Calculator' },
  { id: 'what-is', label: 'What Is CPP?' },
  { id: 'formula', label: 'CPP and MAP Formulas' },
  { id: 'age-bands', label: 'Age-Group Reference Bands' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cpp-faq', label: 'Frequently Asked Questions' },
];

export const CPP_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this cerebral perfusion pressure calculator do?',
    answer:
      'It computes CPP = MAP − ICP in mmHg. You can enter MAP directly or estimate MAP from systolic and diastolic pressures. Age group only changes the educational literature reference band shown beside the result — it does not set a treatment target.',
  },
  {
    question: 'How is MAP calculated from blood pressure?',
    answer:
      'When “I want to calculate the mean arterial pressure (MAP)” is checked, MAP ≈ (SBP + 2 × DBP) ÷ 3, which equals DBP + (SBP − DBP) ÷ 3. The MAP field then shows the calculated value and is labeled as calculated, not measured.',
  },
  {
    question: 'Why does age group matter if the formula is the same?',
    answer:
      'CPP arithmetic does not change with age. Age selects an educational reference band summarized from age-specific cerebral perfusion pressure literature (Allen et al., Pediatr Crit Care Med 2014, and related teaching tables). Those bands are not individualized treatment goals.',
  },
  {
    question: 'Does a CPP outside the reference band mean I need treatment?',
    answer:
      'No. This tool never derives treatment targets or dosing. Only a qualified clinician interpreting monitored MAP and ICP can set care goals.',
  },
  {
    question: 'What if ICP is missing?',
    answer:
      'CPP stays blank until both a valid MAP (measured or calculated) and a valid ICP are present. MAP alone is not enough to report CPP.',
  },
  {
    question: 'Are my pressures stored?',
    answer:
      'No. Values stay in your browser session. Share and copy use the public tool page URL only — never MAP, ICP, CPP, or blood-pressure readings.',
  },
];
