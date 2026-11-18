import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { squareMetersToSquareFeet } from './calculation';
import { SQ_FEET_PER_ACRE, SQ_FEET_PER_YD2 } from './types';

export const LOT_SIZE_TO_SQFT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'calculating-lot-size-in-square-feet', label: 'Calculating Lot Size in Square Feet' },
  { id: 'lot-size-area-conversion-table', label: 'Lot Size Area Conversion Table' },
  { id: 'example-lot-size-calculation', label: 'Example Lot Size Calculation' },
  { id: 'how-to-use-lot-size-calculator', label: 'How to Use the Lot Size Calculator' },
  { id: 'similar-tools', label: 'Similar Tools' },
  { id: 'lot-size-to-sqft-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const LOT_SIZE_TO_SQFT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'calculating-lot-size-in-square-feet',
    title: 'Calculating Lot Size in Square Feet',
    paragraphs: [
      'Lot size is the area of a piece of land. For a rectangular lot, multiply length by width after both sides use compatible units.',
      'Example in feet: Length = 100 ft, Width = 50 ft → Area = 100 × 50 = 5,000 ft². If sides use different units, convert them first (this calculator converts both sides to meters internally).',
      'Irregular plots need additional measurement methods — surveying, geometric subdivision, or GIS — because a single length × width product assumes a rectangle.',
    ],
    formula: 'Area = Length × Width',
  },
  {
    id: 'lot-size-area-conversion-table',
    title: 'Lot Size Area Conversion Table',
    paragraphs: [
      'Use these equivalents when converting common area units into square feet. Displayed values may be rounded; the calculator uses exact SI definitions internally.',
    ],
    tableHeaders: ['Area Unit', 'Equivalent in Square Feet'],
    table: [
      ['1 square meter', `${squareMetersToSquareFeet(1).toPrecision(11)} ft²`],
      ['1 square inch', `${(1 / 144).toPrecision(10)} ft²`],
      ['1 square yard', `${SQ_FEET_PER_YD2} ft²`],
      ['1 acre', `${SQ_FEET_PER_ACRE.toLocaleString('en-US')} ft²`],
      ['1 hectare', `${squareMetersToSquareFeet(10_000).toPrecision(12)} ft²`],
      ['1 square kilometer', `${squareMetersToSquareFeet(1_000_000).toPrecision(12)} ft²`],
      ['1 square mile', '27,878,400 ft²'],
    ],
  },
  {
    id: 'example-lot-size-calculation',
    title: 'Example Lot Size Calculation',
    paragraphs: [
      'Length = 24 ft, Width = 18 ft → Area = 24 × 18 = 432 ft².',
      'Another example: Length = 15 yd, Width = 12 yd → Area = 180 yd². Because 1 yd² = 9 ft², 180 × 9 = 1,620 ft².',
      'Switching the area unit on the calculator shows the same physical lot in acres, hectares, square meters, or other supported units.',
    ],
    formula: '24 ft × 18 ft = 432 ft²  |  180 yd² × 9 = 1,620 ft²',
  },
  {
    id: 'how-to-use-lot-size-calculator',
    title: 'How to Use the Lot Size to Square Feet Calculator',
    paragraphs: [
      '1. Enter the lot’s width. 2. Select the width unit. 3. Enter the lot’s length. 4. Select the length unit. 5. View the automatically calculated area. 6. Change the area unit to square feet, acres, hectares, or another supported measurement. 7. Expand Unit and total price to estimate land cost. 8. Enter the price per unit area for a total estimate.',
      'You can also enter area and one dimension to calculate the missing side. Currency selection changes the money symbol only.',
    ],
  },
  {
    id: 'similar-tools',
    title: 'Similar Tools',
    paragraphs: [
      'Related Omega Calculators pages include Lot Size to Acres Calculator, Acres to Square Feet Converter, Area Converter, Acreage Calculator, and Acres to Hectares Converter.',
    ],
  },
];

export const LOT_SIZE_TO_SQFT_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Calculate Lot Size in Square Feet?',
    answer:
      'For a rectangular lot, multiply length and width in feet. Example: Length = 80 ft, Width = 40 ft → Area = 80 × 40 = 3,200 ft².',
  },
  {
    question: 'What Is the Lot Size of a 22 m × 17 m Lot in Square Feet?',
    answer: `Area = 22 × 17 = 374 m². In square feet: 374 × ${squareMetersToSquareFeet(1).toPrecision(11)} ≈ ${squareMetersToSquareFeet(374).toFixed(2)} ft².`,
  },
  {
    question: 'What Are the Most Common Units Used to Measure Lot Size?',
    answer:
      'Square feet for many residential listings, square meters for metric markets, acres for larger parcels, hectares for agricultural and large metric land, and square yards in some real-estate markets.',
  },
  {
    question: 'How Many Square Feet Are in One Acre?',
    answer: `1 acre = ${SQ_FEET_PER_ACRE.toLocaleString('en-US')} ft².`,
  },
  {
    question: 'How Do You Convert Square Feet to Acres?',
    answer: `Acres = Square Feet ÷ ${SQ_FEET_PER_ACRE.toLocaleString('en-US')}. Example: 87,120 ft² = 2 acres.`,
  },
  {
    question: 'Can This Calculator Measure Irregular Lots?',
    answer:
      'The length × width formula assumes a rectangle. For irregular lots, divide the land into simpler shapes and add their areas, or use verified survey measurements. Do not treat length and width alone as accurate for every irregular lot.',
  },
];
