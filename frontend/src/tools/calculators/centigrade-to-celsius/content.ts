import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatTemp } from './calculation';

export const CENTIGRADE_TO_CELSIUS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'origin-of-centigrade-and-celsius', label: 'The Origin of Centigrade and Degrees Celsius' },
  { id: 'how-to-use', label: 'How to Use the Centigrade to Celsius Converter' },
  { id: 'formula-and-examples', label: 'Formula to Convert Centigrade to Celsius' },
  { id: 'conversion-chart', label: 'Centigrade to Celsius Conversion Chart' },
  { id: 'centigrade-vs-celsius', label: 'Centigrade vs. Celsius' },
  { id: 'related-temperature-converters', label: 'Other Related Temperature Converters' },
  { id: 'centigrade-to-celsius-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
  }[];
}

const CHART = [-40, -20, -10, 0, 10, 20, 25, 30, 37, 50, 75, 100] as const;

export const CENTIGRADE_TO_CELSIUS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'origin-of-centigrade-and-celsius',
    title: 'The Origin of Centigrade and Degrees Celsius',
    paragraphs: [
      'Anders Celsius proposed a temperature scale in 1742 with a 100-degree span between the freezing and boiling temperatures of water under standard atmospheric conditions. The word “centigrade” reflected that hundred-degree interval. Early versions of the scale were later inverted so that freezing sat near 0 and boiling near 100.',
      'In 1948 the international community adopted the name Celsius to honor Anders Celsius and to standardize scientific terminology. The modern Celsius scale is defined through the kelvin, not solely by water’s freezing and boiling points. Everyday speech still uses “centigrade,” but Celsius is the preferred scientific designation.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Centigrade to Celsius Converter',
    paragraphs: [
      '1. Enter a temperature in the centigrade field — Celsius shows the same number immediately.',
      '2. Or type a value in Celsius — the centigrade field updates automatically.',
      '3. Negative temperatures and decimals are supported.',
      '4. Use Share, Reload, or Clear when needed.',
      'Example: 17 degrees centigrade = 17 degrees Celsius. No multiplication or addition is required because the scales are numerically identical.',
    ],
  },
  {
    id: 'formula-and-examples',
    title: 'Formula to Convert Centigrade to Celsius With Examples',
    paragraphs: [
      'The relationship is an identity: °C = °centigrade. There is no numerical difference between the two scale names.',
      'Example 1 — 34 degrees centigrade: Centigrade 34 → Celsius 34. Therefore 34 degrees centigrade = 34 °C.',
      'Example 2 — freezing: 0 degrees centigrade = 0 °C.',
      'Example 3 — negative: −15 degrees centigrade = −15 °C.',
      'Example 4 — decimal: 36.6 degrees centigrade = 36.6 °C.',
    ],
    formula: '°C = °centigrade  ·  1 °centigrade = 1 °C',
  },
  {
    id: 'conversion-chart',
    title: 'Centigrade to Celsius Conversion Chart',
    paragraphs: [
      'Because the names describe the same scale, every chart row pairs identical numbers. Common references include freezing near 0°, typical room temperatures near 20–25°, a commonly cited body-temperature reference near 37°, and boiling near 100° under standard pressure.',
    ],
    tableHeaders: ['Centigrade', 'Celsius'],
    table: CHART.map((t) => [`${formatTemp(t)}°`, `${formatTemp(t)} °C`]),
  },
  {
    id: 'centigrade-vs-celsius',
    title: 'Centigrade vs. Celsius: Is There Any Difference?',
    paragraphs: [
      'The two names refer to the same temperature scale. The numerical temperature is unchanged. Celsius is the internationally standardized name; centigrade is an older everyday term. No actual temperature conversion is necessary.',
      'Example: temperature reported as centigrade 22° is reported as Celsius 22 °C. Difference: 0°. The scales do not have different zero points or intervals.',
    ],
  },
  {
    id: 'related-temperature-converters',
    title: 'Other Related Temperature Converters',
    paragraphs: [
      'Related Omega Calculators pages include Celsius Converter, Celsius to Fahrenheit Converter, and Temperature Conversion. Only active catalog tools appear as live site links in the related-tools rail.',
    ],
  },
];

export const CENTIGRADE_TO_CELSIUS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 0 Centigrade to Celsius?',
    answer:
      'Zero degrees centigrade is exactly zero degrees Celsius. The two scales are identical.',
  },
  {
    question: 'Is Centigrade the Same as Celsius?',
    answer: 'Yes. Centigrade is an older name for the Celsius temperature scale.',
  },
  {
    question: 'What Is the Freezing Point of Water in Celsius?',
    answer:
      'Pure water freezes at approximately 0 °C under standard atmospheric pressure.',
  },
  {
    question: 'What Is the Boiling Point of Water in Celsius?',
    answer:
      'Pure water boils at approximately 100 °C at standard atmospheric pressure of 1 atm. The boiling point changes with pressure.',
  },
  {
    question: 'What Is the Coldest Possible Temperature in Celsius?',
    answer: 'Absolute zero is −273.15 °C.',
  },
  {
    question: 'Why Was Centigrade Renamed Celsius?',
    answer:
      'The term Celsius was internationally adopted in 1948 to honor Anders Celsius and provide a standardized name for the temperature scale.',
  },
  {
    question: 'How Much Is 100 Degrees Centigrade in Celsius?',
    answer: '100 degrees centigrade equals exactly 100 °C.',
  },
  {
    question: 'Is 37 Degrees Centigrade Equal to 37 Celsius?',
    answer: 'Yes. Both represent exactly the same temperature.',
  },
];
