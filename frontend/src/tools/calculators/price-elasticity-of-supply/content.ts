import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Price Elasticity of Supply Calculator' },
  { id: 'what-is', label: 'What Is Price Elasticity of Supply?' },
  { id: 'formula', label: 'Price Elasticity of Supply Formula' },
  { id: 'how-to', label: 'How to Calculate PES' },
  { id: 'midpoint', label: 'Midpoint Formula for PES' },
  { id: 'types', label: 'Types of Price Elasticity of Supply' },
  { id: 'factors', label: 'Factors Affecting Supply Elasticity' },
  { id: 'short-long', label: 'Short-Run vs. Long-Run' },
  { id: 'examples', label: 'PES Examples' },
  { id: 'business', label: 'Why PES Matters to Businesses' },
  { id: 'vs-demand', label: 'PES vs. Price Elasticity of Demand' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'pes-faq', label: 'Frequently Asked Questions' },
];

export const PES_FAQS: readonly FAQItem[] = [
  {
    question: 'What does price elasticity of supply measure?',
    answer:
      'How responsive quantity supplied is to a price change, as %ΔQs divided by %ΔP over an observed interval.',
  },
  {
    question: 'How do you calculate price elasticity of supply?',
    answer:
      'Compute percentage changes in quantity supplied and price (standard or midpoint), then divide quantity change by price change.',
  },
  {
    question: 'What is the price elasticity of supply formula?',
    answer:
      'PES = %ΔQs / %ΔP. Standard uses Period 1 bases; midpoint uses averages of both periods.',
  },
  {
    question: 'Can price elasticity of supply be zero?',
    answer:
      'Yes: if quantity supplied does not change while price changes, PES = 0 (perfectly inelastic over that interval).',
  },
  {
    question: 'Can price elasticity of supply be negative?',
    answer:
      'Observed data can produce a negative PES when price and quantity supplied move opposite directions. Display the signed value; do not force it positive.',
  },
  {
    question: 'What does PES greater than 1 mean?',
    answer:
      'Relatively elastic supply: quantity supplied changes by a larger percentage than price.',
  },
  {
    question: 'What does PES less than 1 mean?',
    answer:
      'When 0 < PES < 1, supply is relatively inelastic over the interval.',
  },
  {
    question: 'What does unit-elastic supply mean?',
    answer:
      'PES ≈ 1: quantity supplied and price change by (approximately) the same percentage.',
  },
  {
    question: 'What is perfectly inelastic supply?',
    answer:
      'PES = 0: quantity supplied does not respond to the observed price change.',
  },
  {
    question: 'What is perfectly elastic supply?',
    answer:
      'A theoretical limiting case of infinite responsiveness. Two identical prices do not establish perfect elasticity; that case is undefined, not Infinity.',
  },
  {
    question: 'What factors determine price elasticity of supply?',
    answer:
      'Capacity, inputs, time horizon, inventories, labor flexibility, technology, entry barriers, production cycles, financing, and supply-chain constraints.',
  },
  {
    question: 'Is supply more elastic in the short run or long run?',
    answer:
      'Often more elastic in the long run as capital and entry adjust; not a universal rule for every market.',
  },
  {
    question: 'How does production capacity affect supply elasticity?',
    answer:
      'Spare capacity and flexible plants usually raise short-run responsiveness; binding capacity constraints lower it.',
  },
  {
    question: 'What is the midpoint method for supply elasticity?',
    answer:
      'Arc elasticity using average price and average quantity as bases, so reversing Period 1 and 2 yields the same PES.',
  },
  {
    question: 'What is the difference between arc elasticity and point elasticity?',
    answer:
      'Arc (midpoint) summarizes a finite interval; point elasticity is a local derivative along a continuous curve.',
  },
  {
    question: 'How is supply elasticity different from demand elasticity?',
    answer:
      'PES tracks producers’ quantity supplied; PED tracks buyers’ quantity demanded. Usual signs differ, but observed signs can vary.',
  },
  {
    question: 'Why is the price elasticity of supply usually positive?',
    answer:
      'The conventional law of supply: higher prices tend to raise quantity supplied, holding other factors fixed.',
  },
  {
    question: 'What happens when price does not change?',
    answer:
      'The PES denominator is zero; show an undefined result, never Infinity or NaN.',
  },
  {
    question: 'How does technology affect supply elasticity?',
    answer:
      'Flexible or scalable technology can raise responsiveness; rigid processes can keep supply inelastic.',
  },
  {
    question: 'Why is price elasticity of supply important for businesses?',
    answer:
      'It informs capacity planning, inventory, pricing, tax incidence analysis, and how quickly output can adjust to price signals.',
  },
];
