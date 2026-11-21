import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatTemp, fromKelvin } from './calculation';

export const KELVIN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Kelvin Converter' },
  { id: 'what-is-kelvin', label: 'What Is the Kelvin Scale?' },
  { id: 'formulas', label: 'Kelvin Conversion Formulas' },
  { id: 'how-to-use', label: 'How to Use the Kelvin Converter' },
  { id: 'examples', label: 'Kelvin Conversion Examples' },
  { id: 'compare', label: 'Kelvin vs Celsius vs Fahrenheit' },
  { id: 'why-science', label: 'Why Is Kelvin Used in Science?' },
  { id: 'related-tools', label: 'Related Calculators' },
  { id: 'kelvin-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_KELVINS = [0, 273.15, 300, 310.15, 373.15] as const;

export const KELVIN_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Kelvin Converter',
    paragraphs: [
      'Convert temperatures among kelvin, Celsius, Fahrenheit, Rankine, Delisle, Newton, Réaumur, and Rømer with this free Omega Calculators tool. Enter a value in any field and the others update instantly.',
      'Kelvin is the internal canonical scale: every input is converted to kelvin first, validated against absolute zero, then expanded to every other scale.',
    ],
  },
  {
    id: 'what-is-kelvin',
    title: 'What Is the Kelvin Scale?',
    paragraphs: [
      'Kelvin is the SI base unit of thermodynamic temperature. Its zero point is absolute zero: the theoretical lower limit of temperature.',
      'Absolute zero is exactly 0 K, which equals −273.15°C. A one-kelvin interval has the same magnitude as a one-degree Celsius interval.',
      'Write kelvin values with the symbol K and without a degree sign: 300 K is correct; 300 °K is not.',
    ],
    formula: '0 K = −273.15°C = −459.67°F',
  },
  {
    id: 'formulas',
    title: 'Kelvin Conversion Formulas',
    paragraphs: [
      'Major SI and customary conversions use exact ratios and offsets. Historical scales (Delisle, Newton, Réaumur, Rømer) follow the same kelvin hub.',
      'Delisle increases as temperature falls relative to the boiling point of water, so its direction is inverted compared with Celsius.',
    ],
    formula:
      '°C = K − 273.15\n°F = (K − 273.15) × 9/5 + 32\n°R = K × 9/5\n°De = (373.15 − K) × 3/2\n°N = (K − 273.15) × 33/100\n°Ré = (K − 273.15) × 4/5\n°Rø = (K − 273.15) × 21/40 + 7.5',
    tableHeaders: ['Conversion', 'Formula'],
    table: [
      ['Kelvin to Celsius', '°C = K − 273.15'],
      ['Kelvin to Fahrenheit', '°F = (K − 273.15) × 9/5 + 32'],
      ['Kelvin to Rankine', '°R = K × 9/5'],
      ['Kelvin to Delisle', '°De = (373.15 − K) × 3/2'],
      ['Kelvin to Newton', '°N = (K − 273.15) × 33/100'],
      ['Kelvin to Réaumur', '°Ré = (K − 273.15) × 4/5'],
      ['Kelvin to Rømer', '°Rø = (K − 273.15) × 21/40 + 7.5'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Kelvin Converter',
    paragraphs: [
      '1. Enter a temperature in any of the eight fields.',
      '2. The calculator converts the value to kelvin internally.',
      '3. All other temperature scales update automatically.',
      '4. Edit another field to reverse the conversion.',
      '5. Use Share Result to copy or share the current set of values.',
      '6. Reload restores an empty calculator; Clear empties the fields.',
    ],
  },
  {
    id: 'examples',
    title: 'Kelvin Conversion Examples',
    paragraphs: [
      'These examples are generated from the same conversion engine as the calculator.',
      ...EXAMPLE_KELVINS.map((k) => {
        const c = fromKelvin(k, 'celsius');
        const f = fromKelvin(k, 'fahrenheit');
        return `${formatTemp(k)} K = ${formatTemp(c)}°C = ${formatTemp(f)}°F`;
      }),
    ],
    tableHeaders: ['Kelvin', 'Celsius', 'Fahrenheit', 'Rankine'],
    table: EXAMPLE_KELVINS.map((k) => [
      formatTemp(k),
      formatTemp(fromKelvin(k, 'celsius')),
      formatTemp(fromKelvin(k, 'fahrenheit')),
      formatTemp(fromKelvin(k, 'rankine')),
    ]),
  },
  {
    id: 'compare',
    title: 'Kelvin vs Celsius vs Fahrenheit',
    paragraphs: [
      'Kelvin and Celsius share the same degree size but different zero points. Fahrenheit uses a smaller degree and a different zero.',
      'Science and engineering prefer kelvin for absolute temperature. Weather and daily life often use Celsius or Fahrenheit depending on region.',
    ],
    tableHeaders: ['Property', 'Kelvin', 'Celsius', 'Fahrenheit'],
    table: [
      ['Symbol', 'K', '°C', '°F'],
      ['Absolute zero', '0', '−273.15', '−459.67'],
      ['Water freeze (1 atm)', '273.15', '0', '32'],
      ['Water boil (1 atm)', '373.15', '100', '212'],
      ['Degree size vs °C', 'Same', 'Reference', '5/9 of °C'],
    ],
  },
  {
    id: 'why-science',
    title: 'Why Is Kelvin Used in Science?',
    paragraphs: [
      'Thermodynamics, chemistry, and physics equations often require absolute temperature. Ideal-gas law, blackbody radiation, and entropy calculations are framed in kelvin.',
      'Because kelvin starts at absolute zero, ratios of absolute temperatures are meaningful in a way that °C or °F ratios are not.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Temperature Converter, Celsius Converter, Fahrenheit Converter, Fahrenheit to Celsius Converter, Celsius to Fahrenheit Converter, and other kelvin/Celsius/Fahrenheit pair tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KELVIN_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is 500 Kelvin in Fahrenheit?',
    answer: `°F = (500 − 273.15) × 9/5 + 32 ≈ ${formatTemp(fromKelvin(500, 'fahrenheit'))}°F.`,
  },
  {
    question: 'How Do I Convert Kelvin to Celsius?',
    answer: 'Subtract 273.15 from the kelvin value: °C = K − 273.15.',
  },
  {
    question: 'What Is the Boiling Point of Water in Kelvin?',
    answer:
      'At standard atmospheric pressure, the normal boiling point of water is approximately 373.15 K.',
  },
  {
    question: 'What Is Absolute Zero in Kelvin?',
    answer: 'Absolute zero is exactly 0 K.',
  },
  {
    question: 'Is Kelvin Written With a Degree Symbol?',
    answer: 'No. Kelvin uses the symbol K without a degree sign (for example, 300 K).',
  },
  {
    question: 'How Do I Convert Celsius to Kelvin?',
    answer: 'Add 273.15 to the Celsius temperature: K = °C + 273.15.',
  },
  {
    question: 'What Is 300 Kelvin in Celsius?',
    answer: `300 − 273.15 = ${formatTemp(fromKelvin(300, 'celsius'))}°C.`,
  },
  {
    question: 'Can Kelvin Be Negative?',
    answer:
      'For ordinary thermodynamic temperatures, values below 0 K are not physically valid and this converter rejects them. Specialized negative absolute-temperature states in certain bounded physical systems are outside the scope of this conventional tool.',
  },
];
