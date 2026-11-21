import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatPrice, pricePerGallonToLiter, pricePerLiterToGallon } from './calculation';
import { LITERS_PER_GALLON } from './types';

export const PRICE_PER_LITER_TO_GALLON_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Price Per Liter to Price Per Gallon Converter' },
  { id: 'liter-to-gallon', label: 'How to Convert Price per Liter to Price per Gallon' },
  { id: 'gallon-to-liter', label: 'How to Convert Price per Gallon to Price per Liter' },
  { id: 'us-vs-imperial', label: 'US Gallon vs Imperial Gallon' },
  { id: 'conversion-chart', label: 'Price per Liter to Price per Gallon Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'when-useful', label: 'When Is This Converter Useful?' },
  { id: 'related-tools', label: 'Other Related Calculators' },
  { id: 'ppl-gal-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_PER_LITER = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5] as const;

function money2(value: number): string {
  return `$${value.toFixed(2)}`;
}

export const PRICE_PER_LITER_TO_GALLON_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Price Per Liter to Price Per Gallon Converter',
    paragraphs: [
      'Compare liquid prices expressed per liter and per gallon instantly. Enter either price and choose US liquid or Imperial gallons: the other price updates in real time.',
      'Currency selection changes the displayed symbol only. Both prices stay in the same denomination; this tool does not apply foreign-exchange rates.',
    ],
  },
  {
    id: 'liter-to-gallon',
    title: 'How to Convert Price per Liter to Price per Gallon',
    paragraphs: [
      'A gallon contains more than one liter, so the price per gallon is proportionally higher for the same liquid and currency.',
      `For a US liquid gallon: multiply the price per liter by ${LITERS_PER_GALLON.us}.`,
      `Example; $1.25 per liter: 1.25 × ${LITERS_PER_GALLON.us} = ${formatPrice(pricePerLiterToGallon(1.25, 'us'))}. Therefore about ${money2(pricePerLiterToGallon(1.25, 'us'))} per US gallon.`,
    ],
    formula: `Price per US gallon = Price per liter × ${LITERS_PER_GALLON.us}`,
  },
  {
    id: 'gallon-to-liter',
    title: 'How to Convert Price per Gallon to Price per Liter',
    paragraphs: [
      `Divide the price per gallon by the liters in that gallon system.`,
      `Example; $5.00 per US gallon: 5 ÷ ${LITERS_PER_GALLON.us} ≈ ${formatPrice(pricePerGallonToLiter(5, 'us'))}. Therefore about ${money2(pricePerGallonToLiter(5, 'us'))} per liter.`,
    ],
    formula: `Price per liter = Price per US gallon ÷ ${LITERS_PER_GALLON.us}`,
  },
  {
    id: 'us-vs-imperial',
    title: 'US Gallon vs Imperial Gallon',
    paragraphs: [
      `A US liquid gallon contains exactly ${LITERS_PER_GALLON.us} liters.`,
      `An Imperial gallon contains exactly ${LITERS_PER_GALLON.imperial} liters.`,
      'Imperial gallons are larger than US gallons, so the price per Imperial gallon is higher at the same price per liter.',
    ],
    tableHeaders: ['System', 'Liters per gallon', '$1.00/L → $/gal'],
    table: [
      [
        'US liquid',
        String(LITERS_PER_GALLON.us),
        money2(pricePerLiterToGallon(1, 'us')),
      ],
      [
        'Imperial',
        String(LITERS_PER_GALLON.imperial),
        money2(pricePerLiterToGallon(1, 'imperial')),
      ],
    ],
  },
  {
    id: 'conversion-chart',
    title: 'Price per Liter to Price per Gallon Conversion Chart',
    paragraphs: [
      'Sample USD chart for US liquid gallons. Values are rounded to two decimal places for readability; the calculator keeps full internal precision.',
    ],
    tableHeaders: ['Price per liter', 'Price per US gallon'],
    table: CHART_PER_LITER.map((p) => [
      money2(p),
      money2(pricePerLiterToGallon(p, 'us')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Price Per Liter to Price Per Gallon Converter',
    paragraphs: [
      '1. Enter the price per liter or the price per gallon.',
      '2. Select the gallon measurement system (US liquid or Imperial).',
      '3. Select your preferred currency display (symbol only).',
      '4. Read the automatically calculated equivalent price.',
      '5. Edit either input to convert in the opposite direction.',
    ],
  },
  {
    id: 'when-useful',
    title: 'When Is This Converter Useful?',
    paragraphs: [
      'Use it when comparing fuel prices between countries that post prices per liter versus per gallon, reviewing bulk liquid purchase quotes, evaluating beverage or cooking-oil costs, or comparing industrial liquid costs in mixed unit systems.',
      'This page does not provide current market fuel prices; only unit conversion of the prices you enter.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Calculators',
    paragraphs: [
      'Related Omega Calculators tools include Gallon Calculator (/tools/gallon-calculator), MPG to L/100 km Converter (/tools/mpg-to-l100-km-converter), Quarts to Gallons Converter (/tools/quarts-to-gallons-converter), Pints to Gallons Converter (/tools/pints-to-gallons-converter), Gallons to Pounds Converter (/tools/gallons-to-pounds-converter), and CCF to Gallons Conversion (/tools/ccf-to-gallons-conversion). Only catalog tools that are active appear as live public routes.',
    ],
  },
];

export const PRICE_PER_LITER_TO_GALLON_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Price per Liter to Price per Gallon?',
    answer: `Multiply the price per liter by ${LITERS_PER_GALLON.us} for a US liquid gallon. For an Imperial gallon, multiply by ${LITERS_PER_GALLON.imperial} instead.`,
  },
  {
    question: 'How Much Is $1.50 per Liter in Gallons?',
    answer: `At $1.50 per liter, the equivalent is about ${money2(pricePerLiterToGallon(1.5, 'us'))} per US gallon (1.50 × ${LITERS_PER_GALLON.us} = ${formatPrice(pricePerLiterToGallon(1.5, 'us'))}).`,
  },
  {
    question: 'How Do I Convert $4 per Gallon to Price per Liter?',
    answer: `Divide $4 by ${LITERS_PER_GALLON.us}. The result is approximately ${money2(pricePerGallonToLiter(4, 'us'))} per liter.`,
  },
  {
    question: 'Is a US Gallon the Same as an Imperial Gallon?',
    answer: `No. A US liquid gallon contains ${LITERS_PER_GALLON.us} liters, while an Imperial gallon contains ${LITERS_PER_GALLON.imperial} liters.`,
  },
  {
    question: 'Why Is the Price per Gallon Higher Than the Price per Liter?',
    answer:
      'Because one gallon contains multiple liters. The total price per gallon covers a larger quantity of liquid at the same unit cost.',
  },
  {
    question: 'Does Changing the Currency Convert Exchange Rates?',
    answer:
      'No. Changing the currency only changes the displayed currency symbol. It does not perform foreign-exchange conversions.',
  },
];
