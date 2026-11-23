import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MCA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'MCA Calculator' },
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'formula', label: 'MoM Formula' },
  { id: 'references', label: 'Reference Populations' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'mca-faq', label: 'Frequently Asked Questions' },
];

export const MCA_FAQS: readonly FAQItem[] = [
  {
    question: 'How is MoM calculated?',
    answer:
      'MoM = measured MCA peak systolic velocity ÷ the gestational-age median for the selected reference cohort, using the same velocity units.',
  },
  {
    question: 'Why do Single and Twin use different medians?',
    answer:
      'Singleton medians follow Mari et al. (N Engl J Med 2000). Twin mode uses the published MCDA twin 50th-centile table (Ultrasound Obstet Gynecol 2009) for weeks 15–37. This tool does not apply twin discordance rules or anemia thresholds.',
  },
  {
    question: 'Does this diagnose fetal anemia?',
    answer:
      'No. It reports descriptive MoM arithmetic from cited median tables. Clinical Doppler interpretation belongs with a specialist.',
  },
  {
    question: 'Are my measurements stored?',
    answer:
      'No. Values stay in your browser session. Share uses the public page URL only.',
  },
];