import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TPA_STROKE_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'tPA Stroke Dosing Calculator' },
  { id: 'labeling', label: 'FDA alteplase stroke dosing' },
  { id: 'tpa-stroke-faq', label: 'Frequently Asked Questions' },
];

export const TPA_STROKE_FAQS: readonly FAQItem[] = [
  {
    question: 'Which product and indication does this worksheet use?',
    answer:
      'Activase (alteplase) for acute ischemic stroke only, per FDA/DailyMed labeling: 0.9 mg/kg total dose (not to exceed 90 mg), with 10% as an IV bolus over 1 minute and the remainder infused over 60 minutes. AMI and PE regimens are out of scope.',
  },
  {
    question: 'Does a calculated dose mean the patient is eligible for thrombolysis?',
    answer:
      'No. Weight alone cannot determine eligibility, timing windows, imaging exclusions, or contraindications. This tool only multiplies labeled mg/kg math for a clinician-reviewed order that has already been independently confirmed.',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Weight stays in the browser. Share copies only the public calculator page URL—never clinical inputs.',
  },
];
