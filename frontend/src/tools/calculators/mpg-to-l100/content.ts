import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MPG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fuel-economy', label: 'What Is Fuel Economy?' },
  { id: 'fuel-economy-conversion', label: 'Fuel Economy Conversion' },
  { id: 'how-to-use', label: 'How to Use the MPG to L/100 km Converter' },
  { id: 'mpg-to-l100-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const MPG_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-fuel-economy',
    title: 'What Is Fuel Economy?',
    paragraphs: [
      'Fuel economy describes how far a vehicle travels on a given amount of fuel. Miles per gallon (MPG) is common in the United States and the United Kingdom, but a US gallon and a UK imperial gallon are different volumes — so US mpg and UK mpg are not interchangeable numbers.',
      'Kilometers per liter (km/L) measures distance per liter of fuel. Liters per 100 kilometers (L/100 km) measures fuel consumption over a fixed distance. Higher MPG or km/L means better economy; lower L/100 km means better economy.',
      'Road cars, trucks, and fleet comparisons often mix these units across regions. Converting through precise mile and gallon definitions keeps comparisons consistent.',
    ],
    formula: 'Higher MPG = better economy · Lower L/100 km = better economy',
  },
  {
    id: 'fuel-economy-conversion',
    title: 'Fuel Economy Conversion',
    paragraphs: [
      'Fuel economy (distance per fuel) and fuel consumption (fuel per distance) are reciprocal. Converting MPG to L/100 km therefore uses division, not a simple linear scale.',
      'Using exact definitions — 1 mile = 1.609344 km, 1 US gallon = 3.785411784 L, 1 UK gallon = 4.54609 L — the US mpg → L/100 km factor is 100 ÷ (1.609344 / 3.785411784) ≈ 235.214583, and the UK factor is ≈ 282.480936.',
      'Also: L/100 km = 100 ÷ km/L. A UK imperial gallon is larger than a US gallon, so the same vehicle shows a higher numeric UK mpg than US mpg.',
    ],
    formula:
      'L/100 km ≈ 235.214583 / US mpg · L/100 km ≈ 282.480936 / UK mpg · L/100 km = 100 / km/L',
    tableHeaders: ['US MPG', 'L/100 km (approx.)'],
    table: [
      ['10', '23.52'],
      ['15', '15.68'],
      ['20', '11.76'],
      ['25', '9.41'],
      ['30', '7.84'],
      ['35', '6.72'],
      ['40', '5.88'],
      ['45', '5.23'],
      ['50', '4.70'],
      ['60', '3.92'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the MPG to L/100 km Converter',
    paragraphs: [
      '1. Open the MPG to L/100 km Converter.',
      '2. Enter a value in US mpg, UK mpg, L/100 km, or km/L.',
      '3. Read the automatically updated equivalents.',
      '4. Edit another field to reverse the conversion.',
      '5. Use Reload Calculator or Clear All Changes to start over.',
      'Example: US mpg = 25 → L/100 km ≈ 9.40858. No separate Calculate step is required.',
    ],
  },
];

export const MPG_FAQS: readonly FAQItem[] = [
  {
    question: 'How Can I Improve Fuel Economy?',
    answer:
      'Practical steps include keeping tires at recommended pressure, avoiding harsh acceleration and braking, following maintenance schedules, reducing unnecessary vehicle weight, limiting idling, and driving at appropriate speeds. Savings vary by vehicle and conditions — this is not a guaranteed savings claim.',
  },
  {
    question: 'What Is Good Fuel Economy?',
    answer:
      '“Good” depends on vehicle class, load, weather, and whether you compare MPG or L/100 km. Always compare like with like (same unit and similar driving conditions).',
  },
  {
    question: "How Do I Find My Car's Fuel Economy?",
    answer:
      'Record fuel added and distance traveled between fills, then divide distance by fuel volume (or compute L/100 km as fuel liters ÷ distance km × 100). Convert units with this calculator if needed.',
  },
  {
    question: 'How Do I Convert US MPG to L/100 km?',
    answer: 'Divide approximately 235.214583 by the US mpg value.',
  },
  {
    question: 'How Do I Convert UK MPG to L/100 km?',
    answer: 'Divide approximately 282.480936 by the UK mpg value.',
  },
  {
    question: 'How Do I Convert US MPG to UK MPG?',
    answer:
      'Multiply US mpg by the ratio of the imperial gallon volume to the US gallon volume (4.54609 ÷ 3.785411784).',
  },
  {
    question: 'How Much Is 25 US MPG in L/100 km?',
    answer: 'Approximately 9.40858 L/100 km.',
  },
  {
    question: 'Is 5 L/100 km Good Fuel Economy?',
    answer:
      '5 L/100 km is relatively efficient for many conventional passenger cars, but comparisons still depend on vehicle class and driving conditions.',
  },
  {
    question: 'Why Does Higher MPG Mean Lower L/100 km?',
    answer:
      'MPG measures distance per fuel; L/100 km measures fuel per distance. They are reciprocal — more distance per gallon means fewer liters needed for 100 km.',
  },
  {
    question: 'Is US MPG the Same as UK MPG?',
    answer:
      'No. A UK imperial gallon is larger than a US gallon, so the same vehicle’s numeric UK mpg is higher than its US mpg.',
  },
];
