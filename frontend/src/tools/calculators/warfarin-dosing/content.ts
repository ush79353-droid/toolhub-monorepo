import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WARFARIN_DOSING_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Warfarin Dosing Worksheet' },
  { id: 'maintenance-nomogram', label: 'Maintenance adjustment bands' },
  { id: 'bleeding-pathways', label: 'Bleeding pathways' },
  { id: 'warfarin-dosing-faq', label: 'Frequently Asked Questions' },
];

export const WARFARIN_DOSING_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this tool invent a warfarin prescription?',
    answer:
      'No. When INR and weekly dose are entered without significant bleeding, it applies published clinic percentage bands to your current weekly total and shows a range. It never invents milligrams outside those bands. Serious or life-threatening bleeding suppresses numeric dose output and points to ACCP escalation framing only.',
  },
  {
    question: 'What do the target INR options mean?',
    answer:
      '2–3 is the usual intensity column (often AF or VTE). 2.5–3.5 is the higher-intensity column used for some mechanical valves. Use the range ordered for the patient; this worksheet does not choose an indication.',
  },
  {
    question: 'How do day and week dose units work?',
    answer:
      'Enter the total milligrams for one week, or an average daily dose. Switching wk ↔ day preserves the same weekly total (×7 or ÷7). Results report weekly and average daily ranges from the published percent band.',
  },
  {
    question: 'Are my INR or dose values stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only — INR, dose, and bleeding status are not put in the link.',
  },
];
