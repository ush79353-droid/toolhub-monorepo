import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SODIUM_IN_SALT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Sodium in Salt Calculator' },
  { id: 'formula', label: 'Formula' },
  { id: 'salt-types', label: 'Salt types & density' },
  { id: 'sodium-in-salt-faq', label: 'Frequently Asked Questions' },
];

export const SODIUM_IN_SALT_FAQS: readonly FAQItem[] = [
  {
    question: 'How much sodium is in 1 gram of pure salt?',
    answer:
      'Pure sodium chloride is 22.99/58.44 sodium by mass, so 1 g NaCl contains about 393 mg sodium. This calculator uses that published ratio only for the pure-NaCl field.',
  },
  {
    question: 'Why do fine and coarse salts differ per teaspoon?',
    answer:
      'A level teaspoon is a fixed volume. Fine crystals pack more mass (and therefore more sodium) than fluffy or coarse crystals. Coarse kosher or coarse sea salt therefore show less sodium per teaspoon than iodized table salt.',
  },
  {
    question: 'Can I convert sodium back to salt?',
    answer:
      'Yes. Enter a sodium amount and the tool estimates how much of the selected culinary salt (and pure NaCl) matches that sodium, using the salt type’s teaspoon sodium density and 22.99/58.44 stoichiometry.',
  },
  {
    question: 'Are my entries stored?',
    answer:
      'No. Values stay in your browser. Share uses the public page URL only — never your salt or sodium figures.',
  },
];
