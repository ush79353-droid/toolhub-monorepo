import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, mcgToMl, mlToMcg } from './calculation';

export const MCG_TO_ML_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use-mcg-to-ml', label: 'How to use this mcg to mL conversion' },
  { id: 'converting-mcg-to-ml-by-hand', label: 'Converting from mcg to mL by hand' },
  { id: 'other-similar-tools', label: 'Other similar tools' },
  { id: 'mcg-to-ml-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    formula?: string;
  }[];
  links?: readonly { href: string; label: string }[];
}

export const MCG_TO_ML_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use-mcg-to-ml',
    title: 'How to Use This mcg to mL Conversion Calculator',
    paragraphs: [
      'This calculator supports two modes. Medication concentration conversion uses a labeled strength such as mcg/mL. Other substance density conversion uses mass per volume for the whole material.',
      'For medication: 1) Select Medication. 2) Confirm an example preset or enter a custom concentration from the product label. 3) Enter the medication amount in mcg (or mg/g). 4) Read the calculated liquid volume in mL. 5) Or enter volume to calculate the corresponding mass. Conversion always depends on the concentration you supply; never on a fixed mcg-to-mL factor.',
    ],
  },
  {
    id: 'converting-mcg-to-ml-by-hand',
    title: 'Converting from mcg to mL by Hand',
    paragraphs: [
      'For solutions, divide the amount in micrograms by the concentration in mcg/mL.',
      `Example: amount ${formatMeasure(750)} mcg at ${formatMeasure(1500)} mcg/mL → volume = 750 ÷ 1500 = ${formatMeasure(mcgToMl(750, 1500))} mL.`,
      `Reverse: mass (mcg) = volume (mL) × concentration (mcg/mL). Example: ${formatMeasure(2)} mL × ${formatMeasure(1000)} mcg/mL = ${formatMeasure(mlToMcg(2, 1000))} mcg.`,
    ],
    formula: 'Volume (mL) = Amount (mcg) / Concentration (mcg/mL)',
    subsections: [
      {
        id: 'medications',
        title: 'Medications',
        paragraphs: [
          'Micrograms measure an amount of medication by mass. Milliliters measure liquid volume. Medication concentration connects the two. Concentrations vary across products and formulations, so a drug name alone is not enough to calculate mL. Always read the label in front of you. This calculator does not recommend a dose.',
        ],
        formula: 'Mass (mcg) = Volume (mL) × Concentration (mcg/mL)',
      },
      {
        id: 'other-substances',
        title: 'Other Substances',
        paragraphs: [
          'Density relates mass and volume: Density = Mass / Volume, and Volume = Mass / Density. Different substances with the same mass can occupy different volumes. When converting micrograms with density, first express mass in grams (1 g = 1,000,000 mcg), then divide by density in g/mL.',
        ],
        formula: 'Volume (mL) = Mass (mcg) / (Density (g/mL) × 1,000,000)',
      },
    ],
  },
  {
    id: 'other-similar-tools',
    title: 'Other Similar Tools',
    paragraphs: ['Related Omega Calculators tools that already exist:'],
    links: [
      { href: '/tools/mg-to-ml-calculator', label: 'mg to mL Calculator' },
      { href: '/tools/mcg-to-mg-converter', label: 'mcg to mg Converter' },
      { href: '/tools/volume-conversion', label: 'Volume Conversion' },
      { href: '/tools/weight-converter', label: 'Weight Converter' },
      { href: '/tools/density-conversion', label: 'Density Conversion' },
      { href: '/tools/drops-to-ml-conversion', label: 'Drops to mL Conversion' },
    ],
  },
];

export const MCG_TO_ML_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Know How Many mcg Are in an mL?',
    answer: `It depends on the solution concentration. At 1,000 mcg/mL, 1 mL contains 1,000 mcg. A different concentration produces a different result.`,
  },
  {
    question: 'How Many mcg Does 1 mL of Vitamin B12 Contain?',
    answer:
      'Vitamin B12 concentrations depend on the specific product. For a hypothetical solution labeled 1,000 mcg/mL, 1 mL contains 1,000 mcg. Check the label; not all Vitamin B12 products use that strength.',
  },
  {
    question: 'Can I Convert mcg to mL Without Concentration?',
    answer:
      'No. Micrograms measure mass and milliliters measure volume. A concentration (for medications) or density (for other substances) is required.',
  },
  {
    question: 'What Is 500 mcg in mL?',
    answer: `It cannot be determined without concentration. For an illustrative 1,000 mcg/mL strength: 500 ÷ 1,000 = ${formatMeasure(mcgToMl(500, 1000))} mL.`,
  },
  {
    question: 'How Do I Convert mg/mL to mcg/mL?',
    answer: '1 mg/mL = 1,000 mcg/mL. Example: 2.5 mg/mL = 2,500 mcg/mL.',
  },
];
