import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { squareMetersToAcres } from './calculation';
import { SQ_FEET_PER_ACRE, SQ_METERS_PER_ACRE, SQ_YARDS_PER_ACRE } from './types';

export const LOT_SIZE_TO_ACRES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'calculating-lot-size-in-acres', label: 'Calculating Lot Size in Acres' },
  { id: 'lot-size-conversion-table', label: 'Lot Size Conversion Table' },
  { id: 'example-lot-size-to-acres', label: 'Example Lot Size to Acres Calculation' },
  { id: 'how-to-use-lot-size-to-acres', label: 'How to Use the Lot Size to Acres Calculator' },
  { id: 'similar-tools', label: 'Similar Tools' },
  { id: 'lot-size-to-acres-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const LOT_SIZE_TO_ACRES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'calculating-lot-size-in-acres',
    title: 'Calculating Lot Size in Acres',
    paragraphs: [
      'A rectangular lot’s area is the product of its width and length. Once you know the area in square feet, square yards, or square meters, convert it into acres using the exact land-unit definitions.',
      `For measurements in feet: Acres = (Length × Width) ÷ ${SQ_FEET_PER_ACRE.toLocaleString('en-US')}. For square meters: Acres = Square Meters ÷ ${SQ_METERS_PER_ACRE}. For square yards: Acres = Square Yards ÷ ${SQ_YARDS_PER_ACRE.toLocaleString('en-US')}.`,
      'Acres remain a practical unit for residential plots, commercial parcels, agricultural fields, real estate listings, land development, and property planning. Multiplying width by length assumes a rectangle. Irregular lots need surveying, geometric subdivision, or GIS area tools instead of a single rectangle formula.',
    ],
    formula: `Area = Length × Width  |  Acres = ft² ÷ ${SQ_FEET_PER_ACRE.toLocaleString('en-US')}  |  Acres = m² ÷ ${SQ_METERS_PER_ACRE}`,
  },
  {
    id: 'lot-size-conversion-table',
    title: 'Lot Size Conversion Table',
    paragraphs: [
      'Use these equivalents when converting common area units into acres. Displayed table values may be rounded; the calculator uses exact SI definitions internally.',
    ],
    tableHeaders: ['Area Unit', 'Equivalent Acres'],
    table: [
      ['1 square meter', `${squareMetersToAcres(1).toPrecision(10)} ac`],
      ['1 square kilometer', `${squareMetersToAcres(1_000_000).toPrecision(10)} ac`],
      ['1 square foot', `${(1 / SQ_FEET_PER_ACRE).toPrecision(10)} ac`],
      ['1 square yard', `${(1 / SQ_YARDS_PER_ACRE).toPrecision(10)} ac`],
      ['1 acre', '1 ac'],
      ['1 hectare', `${squareMetersToAcres(10_000).toPrecision(10)} ac`],
      ['1 square mile', '640 ac'],
    ],
  },
  {
    id: 'example-lot-size-to-acres',
    title: 'Example Lot Size to Acres Calculation',
    paragraphs: [
      'A rectangular property measures Length = 175 yards and Width = 150 yards.',
      'Step 1: Area = 175 × 150 = 26,250 yd².',
      `Step 2: Acres = 26,250 ÷ ${SQ_YARDS_PER_ACRE.toLocaleString('en-US')} ≈ 5.42355.`,
      'Result: the lot measures approximately 5.42 acres.',
    ],
    formula: `Acres = (175 yd × 150 yd) ÷ ${SQ_YARDS_PER_ACRE} ≈ 5.42355 ac`,
  },
  {
    id: 'how-to-use-lot-size-to-acres',
    title: 'How to Use the Lot Size to Acres Calculator',
    paragraphs: [
      '1. Enter the lot’s width. 2. Select the width measurement unit. 3. Enter the lot’s length. 4. Select the length measurement unit. 5. View the calculated area in acres (or change the area unit). 6. Open Unit and total price to estimate property cost from a unit price.',
      'You can also enter an area and one dimension to solve for the missing side. Currency selection changes the money symbol only; it does not apply live foreign-exchange rates.',
    ],
  },
  {
    id: 'similar-tools',
    title: 'Similar Tools',
    paragraphs: [
      'Related Omega Calculators pages include the Acreage Calculator, Area Converter, Acres to Square Feet Converter, and Acres to Hectares Converter.',
    ],
  },
];

export const LOT_SIZE_TO_ACRES_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Calculate Lot Size in Acres?',
    answer: `Measure width and length, multiply them for area, convert into square feet or square meters if needed, then divide by the acre factor. In feet: Acres = (Length × Width) ÷ ${SQ_FEET_PER_ACRE.toLocaleString('en-US')}.`,
  },
  {
    question: 'What Is the Area of a 45.7 m × 128.2 m Lot in Acres?',
    answer: `Area = 45.7 × 128.2 = 5,858.74 m². Acres = 5,858.74 ÷ ${SQ_METERS_PER_ACRE} ≈ ${squareMetersToAcres(5858.74).toFixed(4)}. Approximately 1.45 acres.`,
  },
  {
    question: 'What Is the Largest Area Unit Used in Real Estate?',
    answer:
      'Large properties are commonly measured in acres, hectares, square miles, or square kilometers depending on region. There is no single universally largest real-estate area unit.',
  },
  {
    question: 'How Many Square Feet Are in One Acre?',
    answer: `One acre contains exactly ${SQ_FEET_PER_ACRE.toLocaleString('en-US')} square feet.`,
  },
  {
    question: 'How Many Acres Are in One Hectare?',
    answer: `One hectare equals approximately ${squareMetersToAcres(10_000).toFixed(5)} acres.`,
  },
  {
    question: 'How Many Acres Are in a 100 ft × 100 ft Lot?',
    answer: `Area = 100 × 100 = 10,000 ft². Acres = 10,000 ÷ ${SQ_FEET_PER_ACRE.toLocaleString('en-US')} ≈ 0.22957. Approximately 0.23 acres.`,
  },
  {
    question: 'Can I Calculate the Size of an Irregular Lot?',
    answer:
      'The basic width × length formula is for rectangular lots. Irregular properties may need surveying data, geometric subdivision, or GIS-based area measurements. Do not treat a single rectangle product as accurate for arbitrary shapes.',
  },
];
