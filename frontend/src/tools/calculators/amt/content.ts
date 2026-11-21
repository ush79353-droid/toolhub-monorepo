import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AMT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-amt', label: 'What Is the Alternative Minimum Tax?' },
  { id: 'how-this-calculator-works', label: 'How This Calculator Works' },
  { id: 'amt-formulas', label: 'Formulas (2022 & 2023)' },
  { id: 'irs-parameters', label: 'IRS Parameters by Year' },
  { id: 'limitations', label: 'Limitations & Disclosures' },
  { id: 'related-calculators', label: 'Related Calculators' },
  { id: 'amt-faq', label: 'Frequently Asked Questions' },
];

export const AMT_FAQS: readonly FAQItem[] = [
  {
    question: 'Is AMTI the same as AGI plus non-deductible taxes?',
    answer:
      'Not always. AGI plus certain non-deductible taxes can be a starting point, but Form 6251 AMTI also reflects AMT adjustments and preference items (for example, depreciation differences, incentive stock options, and other add-backs). This calculator treats AMTI as the authoritative base and only suggests AGI + non-deductible taxes when you have not typed AMTI manually.',
  },
  {
    question: 'Does this calculator show the additional AMT I owe on Form 6251?',
    answer:
      'No. Additional AMT is generally max(0, tentative minimum tax − regular tax liability). Regular tax is not an input on this screenshot-scoped form, so results are labeled as a tentative AMT estimate after permitted credits — not a final additional tax due.',
  },
  {
    question: 'Which tax years are supported?',
    answer:
      'Only historical tax years 2022 and 2023, using that year’s Form 6251 instructions and IRS inflation-adjusted exemption, phaseout, and 26%/28% bracket figures. Current-year brackets are never applied to a historical year.',
  },
  {
    question: 'What filing statuses are included?',
    answer:
      'Single; married filing jointly; and married filing separately. Head of household and qualifying surviving spouse follow the same exemption table as single / joint respectively on Form 6251, but those labels are outside this calculator’s screenshot scope.',
  },
  {
    question: 'How are tax credits handled?',
    answer:
      'Credits reduce tentative minimum tax and are floored so the tentative AMT after credits cannot go below zero. Enter only credits that are permitted against AMT for the year (for example, the AMT foreign tax credit). Ordinary nonrefundable credits that do not offset AMT should not be entered here.',
  },
];
