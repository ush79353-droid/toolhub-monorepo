import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BLOOD_DONOR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Blood Donor Calculator' },
  { id: 'compatibility', label: 'Compatibility Rules' },
  { id: 'blood-donor-faq', label: 'Frequently Asked Questions' },
];

export const BLOOD_DONOR_FAQS: readonly FAQItem[] = [
  {
    question: 'Does “blood” mean red cells?',
    answer:
      'Yes. This mode uses packed red blood cell (RBC) ABO/Rh rules. Plasma uses reversed ABO compatibility (AB is the universal plasma donor; group O is the usual universal plasma recipient).',
  },
  {
    question: 'Can I rely on this for transfusion?',
    answer:
      'No. Real transfusion requires antibody screens, crossmatch, and local protocols. This page is an educational lookup only.',
  },
];