import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DAPT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'DAPT Score Calculator' },
  { id: 'what-is', label: 'What Is the DAPT Score?' },
  { id: 'eligibility', label: 'Who the Score Applies To' },
  { id: 'points', label: 'Point Weights' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'dapt-faq', label: 'Frequently Asked Questions' },
];

export const DAPT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this DAPT calculator do?',
    answer:
      'It totals the Yeh 2016 dual antiplatelet therapy (DAPT) score from age and eight clinical/procedural factors. It does not recommend starting, stopping, or prolonging antiplatelet drugs.',
  },
  {
    question: 'Which patients was the score derived for?',
    answer:
      'Patients who completed about 12 months of DAPT after coronary stent PCI without a major ischemic or bleeding event, and who were not on chronic oral anticoagulation (DAPT Study / Yeh JAMA 2016 framing).',
  },
  {
    question: 'How are points assigned?',
    answer:
      'Age <65 = 0; 65–74 = −1; ≥75 = −2. Add 1 each for diabetes, smoking (current or within past year), MI at presentation, prior MI/PCI, stent diameter <3 mm, and paclitaxel-eluting stent. Add 2 each for CHF or LVEF <30% and vein-graft stent. Total ranges from −2 to 10.',
  },
  {
    question: 'Does a stent diameter of exactly 3 mm add a point?',
    answer:
      'No. The published item is diameter less than 3 mm. Exactly 3.0 mm does not receive the +1.',
  },
  {
    question: 'Why does the age control say ≥75 instead of >75?',
    answer:
      'The reference screenshot labeled the top band “> 75 years,” but Yeh/ACC scoring uses age 75 or older (−2). This tool uses ≥75 so age 75 is scored correctly and discloses the screenshot wording difference.',
  },
  {
    question: 'Are my answers stored?',
    answer:
      'No. Values stay in your browser session. Share and copy use the public page URL only—never clinical checkboxes or the numeric score.',
  },
];
