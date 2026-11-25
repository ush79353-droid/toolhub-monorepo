import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_NOTE =
  'Ideal body weight (Devine) for 6–8 mL/kg protective tidal-volume range; Ideal ETT depth from right upper canine via Chula formula ETT[cm]=0.1×height[cm]+4 (Techanivate et al., J Med Assoc Thai 2005). Educational only.';

export const DISCLAIMER =
  'Educational worksheet only — not an intubation order, ventilator prescription, or substitute for clinical judgment. Confirm tube placement and tidal-volume targets with local protocols and bedside assessment.';

export const TIDAL_VOLUME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Tidal Volume Calculator' },
  { id: 'ett-use', label: 'ETT — EndoTracheal Tube use' },
  { id: 'ett-characteristics', label: 'Endotracheal tube characteristics' },
  { id: 'tidal-volume-definition', label: 'Tidal volume definition' },
  { id: 'how-calculated', label: 'How this calculator works' },
  { id: 'tidal-volume-faq', label: 'Frequently Asked Questions' },
];

export const TIDAL_VOLUME_FAQS: readonly FAQItem[] = [
  {
    question: 'What tidal volume range does this tool show?',
    answer:
      'A common educational protective range of 6–8 mL per kilogram of Devine ideal body weight (IBW) from height and sex. It does not replace clinician-ordered mL/kg targets.',
  },
  {
    question: 'How is Ideal ETT depth calculated?',
    answer:
      'Chula formula from the right upper canine: ETT (cm) = 0.1 × height (cm) + 4. Depth units can display in inches; the formula always uses centimeters.',
  },
  {
    question: 'Why is height required for both outputs?',
    answer:
      'Devine IBW (and therefore the 6–8 mL/kg tidal-volume band) and the Chula depth estimate both use stature. Sex selects the IBW intercept only.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Entries stay in your browser. Share uses the public page URL only — never height, sex, or calculated results.',
  },
];
