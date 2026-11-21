import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  calculateLandArea,
  formatMeasure,
  squareMetersToArea,
} from './calculation';
import { AREA_TO_SQUARE_METERS } from './types';

export const LAND_AREA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-calculate', label: 'How to Calculate Land Area' },
  { id: 'how-to-use', label: 'How to Use the Land Area Calculator' },
  { id: 'conversion-units', label: 'Land Area Conversion Units' },
  { id: 'land-price', label: 'How to Calculate Land Price' },
  { id: 'examples', label: 'Land Area Calculation Examples' },
  { id: 'rectangular-vs-irregular', label: 'Rectangular vs. Irregular Land Area' },
  { id: 'related-converters', label: 'Other Related Land Measurement Calculators' },
  { id: 'land-area-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_M2 = [1, 10, 50, 100, 200, 500, 1000, 5000, 10_000] as const;

export const LAND_AREA_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Land Area',
    paragraphs: [
      'For rectangular land, multiply length by width after converting both dimensions to the same base unit (meters).',
      `Example; length 30 m, width 15 m: 30 × 15 = ${formatMeasure(calculateLandArea(15, 'm', 30, 'm', 'm2'))} m².`,
      `Mixed units are converted first. Example; width 10 ft and length 20 m: 10 × 0.3048 = 3.048 m, then 3.048 × 20 = ${formatMeasure(calculateLandArea(10, 'ft', 20, 'm', 'm2'))} m².`,
    ],
    formula: 'Area = Length × Width (compatible physical units)',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Land Area Calculator',
    paragraphs: [
      '1. Enter the width of the land and select its unit.',
      '2. Enter the length of the land and select its unit.',
      '3. View the calculated area.',
      '4. Select the preferred area unit (m², ft², acres, hectares, and more).',
      '5. Optionally expand Unit and total price, enter a price per unit area, and choose currency and pricing unit.',
      '6. Use Reload Calculator or Clear All Changes to reset.',
    ],
  },
  {
    id: 'conversion-units',
    title: 'Land Area Conversion Units',
    paragraphs: [
      'Supported area units include square millimeters, centimeters, meters, and kilometers; square inches, feet, yards, and miles; plus acres and hectares.',
      `One international acre equals exactly ${AREA_TO_SQUARE_METERS.acre} m² (${formatMeasure(43_560)} ft²). One hectare equals exactly ${AREA_TO_SQUARE_METERS.hectare} m².`,
      'Acres and hectares are especially convenient for larger parcels. Regional land units (marla, kanal, bigha, and similar) are omitted here because definitions vary by locality.',
    ],
    tableHeaders: ['m²', 'ft²', 'ac', 'ha'],
    table: TABLE_M2.map((m2) => [
      formatMeasure(m2),
      formatMeasure(squareMetersToArea(m2, 'ft2')),
      formatMeasure(squareMetersToArea(m2, 'acre')),
      formatMeasure(squareMetersToArea(m2, 'hectare')),
    ]),
  },
  {
    id: 'land-price',
    title: 'How to Calculate Land Price',
    paragraphs: [
      'Total Price = Land Area × Price per Unit Area, after converting the calculated area into the pricing unit.',
      'Example (200 m² at $150 per m² → total $30,000. Example) 2 acres at $25,000 per acre → total $50,000.',
      'Currency selection changes the denomination and formatting only. It does not convert prices between currencies.',
    ],
    formula: 'Total Price = Area × Price per Unit Area',
  },
  {
    id: 'examples',
    title: 'Land Area Calculation Examples',
    paragraphs: [
      `Example A; residential plot 40 ft × 60 ft: ${formatMeasure(calculateLandArea(40, 'ft', 60, 'ft', 'ft2'))} ft².`,
      `Example B; agricultural land 100 m × 200 m: ${formatMeasure(calculateLandArea(100, 'm', 200, 'm', 'm2'))} m² = ${formatMeasure(calculateLandArea(100, 'm', 200, 'm', 'hectare'))} ha.`,
      `Example C; square plot 25 m × 25 m: ${formatMeasure(calculateLandArea(25, 'm', 25, 'm', 'm2'))} m².`,
    ],
  },
  {
    id: 'rectangular-vs-irregular',
    title: 'Rectangular vs. Irregular Land Area',
    paragraphs: [
      'This calculator uses the rectangular area formula. Multiplying two arbitrary side lengths does not reliably measure an irregular plot.',
      'For irregular land, divide the parcel into simpler shapes, calculate each section, and add the areas, or use survey measurements for complex boundaries.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Related Land Measurement Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Area Calculator, Square Feet Calculator, Acre Calculator, Hectares to Acres Converter, Square Feet to Acres Converter, Length Converter, Lot Size Calculator, and Lot Size to Square Feet Calculator. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const LAND_AREA_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Calculate the Area of a Plot of Land?',
    answer: `For rectangular land, multiply length by width. Example: 20 m × 10 m = ${formatMeasure(calculateLandArea(10, 'm', 20, 'm', 'm2'))} m².`,
  },
  {
    question: 'How Do I Calculate Land Area in Square Feet?',
    answer: `Measure width and length in feet and multiply. Example: 40 ft × 60 ft = ${formatMeasure(calculateLandArea(40, 'ft', 60, 'ft', 'ft2'))} ft².`,
  },
  {
    question: 'How Many Square Feet Are in an Acre?',
    answer: 'One international acre equals exactly 43,560 square feet.',
  },
  {
    question: 'How Many Square Meters Are in a Hectare?',
    answer: 'One hectare equals exactly 10,000 square meters.',
  },
  {
    question: 'How Do I Convert Square Meters to Acres?',
    answer: `Divide square meters by ${AREA_TO_SQUARE_METERS.acre}. Example: 10,000 m² ≈ ${formatMeasure(squareMetersToArea(10_000, 'acre'))} acres.`,
  },
  {
    question: 'How Do I Calculate the Price of Land?',
    answer:
      'Multiply the land area by the price per unit area after converting both to the same area unit. Example: 500 m² × $100/m² = $50,000.',
  },
  {
    question: 'Can I Calculate Irregular Land Area Using This Calculator?',
    answer:
      'The basic calculator is for rectangular plots. For irregular plots, divide into simpler shapes and add areas, or use survey measurements.',
  },
  {
    question: 'Can I Calculate Land Area Using Feet and Meters Together?',
    answer:
      'Yes. Select the appropriate unit for each dimension. The calculator converts both sides to meters before multiplying.',
  },
];
