import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MS_TO_KMH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-speed', label: 'What Is Speed and How Do We Measure It?' },
  { id: 'ms-to-kmh', label: 'How to Convert m/s to km/h and km/h to m/s' },
  { id: 'how-to-use', label: 'How to Use the m/s to km/h Converter' },
  { id: 'speed-units', label: 'Different Units for Speed and How to Convert Them' },
  { id: 'ms-kmh-table', label: 'm/s to km/h Conversion Table' },
  { id: 'kmh-ms-table', label: 'km/h to m/s Conversion Table' },
  { id: 'applications', label: 'Real-World Applications of Speed Conversion' },
  { id: 'ms-to-kmh-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const MS_TO_KMH_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-speed',
    title: 'What Is Speed and How Do We Measure It?',
    paragraphs: [
      'Speed measures how far something travels per unit of time. It is a scalar quantity: it has magnitude but no direction. Velocity pairs that magnitude with a direction, so a signed one-dimensional component can be negative when motion opposes a chosen positive axis.',
      'Common everyday units include meters per second, kilometers per hour, and miles per hour. The SI derived unit of speed is the meter per second (m/s).',
      'If an object travels 100 meters in 20 seconds, its average speed is 100 ÷ 20 = 5 m/s. Multiplying by 3.6 converts that value to 18 km/h.',
    ],
    formula: 'Speed = Distance / Time · 5 m/s × 3.6 = 18 km/h',
  },
  {
    id: 'ms-to-kmh',
    title: 'How to Convert m/s to km/h and km/h to m/s',
    paragraphs: [
      'One kilometer equals 1,000 meters, and one hour equals 3,600 seconds. Therefore 1 m/s = 3,600/1,000 km/h = 3.6 km/h exactly. The reverse factor is 1 km/h = 1/3.6 m/s.',
      'Examples: 5 m/s = 18 km/h, 10 m/s = 36 km/h, 15 m/s = 54 km/h, 20 m/s = 72 km/h, 25 m/s = 90 km/h, and 30 m/s = 108 km/h.',
    ],
    formula: 'km/h = m/s × 3.6 · m/s = km/h ÷ 3.6',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the m/s to km/h Converter',
    paragraphs: [
      '1. Enter a speed in the meters-per-second field (or any other field).',
      '2. Review the automatically calculated kilometers-per-hour value.',
      '3. View mph, ft/s, and knots in the main panel.',
      '4. Alternatively, type into any other speed field to drive the conversion.',
      '5. Expand More conversion options for cm/s, mm/s, km/s, and related units.',
      '6. Copy or share the result.',
      '7. Use Reload calculator or Clear all changes when you need a reset.',
    ],
  },
  {
    id: 'speed-units',
    title: 'Different Units for Speed and How to Convert Them',
    paragraphs: [
      'Meters per second are standard in physics and engineering. Kilometers per hour dominate road signs in most of the world. Miles per hour appear in the United States and United Kingdom. Feet per second show up in some engineering and ballistics contexts. Knots are used in maritime and aviation navigation. Centimeters and millimeters per second help with slow processes; kilometers per second describe orbital or high-energy speeds.',
      'This converter derives every field from a single meters-per-second value using exact international definitions (for example the international mile of 1,609.344 m and the nautical mile of 1,852 m). Mach number is not included as a fixed factor because the speed of sound changes with temperature and medium.',
    ],
  },
  {
    id: 'ms-kmh-table',
    title: 'm/s to km/h Conversion Table',
    paragraphs: ['Common exact m/s → km/h values:'],
    tableHeaders: ['m/s', 'km/h'],
    table: [
      ['0', '0'],
      ['1', '3.6'],
      ['2', '7.2'],
      ['5', '18'],
      ['10', '36'],
      ['15', '54'],
      ['20', '72'],
      ['25', '90'],
      ['30', '108'],
      ['40', '144'],
      ['50', '180'],
      ['100', '360'],
    ],
  },
  {
    id: 'kmh-ms-table',
    title: 'km/h to m/s Conversion Table',
    paragraphs: ['Common km/h → m/s values:'],
    tableHeaders: ['km/h', 'm/s'],
    table: [
      ['3.6', '1'],
      ['18', '5'],
      ['36', '10'],
      ['54', '15'],
      ['72', '20'],
      ['90', '25'],
      ['100', '27.7778'],
      ['108', '30'],
      ['120', '33.3333'],
      ['180', '50'],
    ],
  },
  {
    id: 'applications',
    title: 'Real-World Applications of Speed Conversion',
    paragraphs: [
      'Vehicle dashboards and road limits often use km/h or mph, while physics labs report m/s. Runners and cyclists compare pace in different unit systems. Weather services publish wind speeds in knots, m/s, or mph depending on the audience. Engineers convert between systems when combining SI calculations with imperial specifications. Aircraft and ships routinely work in knots for navigation while ground crews may prefer km/h.',
    ],
  },
];

export const MS_TO_KMH_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert km/h to m/s?',
    answer: 'Divide the speed in kilometers per hour by 3.6. m/s = km/h ÷ 3.6.',
  },
  {
    question: 'How Do I Convert m/s to km/h?',
    answer: 'Multiply the speed in meters per second by 3.6. km/h = m/s × 3.6.',
  },
  {
    question: 'What Is 1 m/s in km/h?',
    answer: '1 m/s is equal to 3.6 km/h.',
  },
  {
    question: 'What Is 100 km/h in m/s?',
    answer: '100 ÷ 3.6 ≈ 27.7778 m/s.',
  },
  {
    question: 'What Is 100 m/s in km/h?',
    answer: '100 × 3.6 = 360 km/h.',
  },
  {
    question: 'How Do You Convert kph to mps?',
    answer: 'Divide kilometers per hour by 3.6 to get meters per second.',
  },
  {
    question: 'Is m/s the SI Unit of Speed?',
    answer: 'Yes. Meters per second is the SI derived unit for speed.',
  },
  {
    question: 'What Is the Difference Between Speed and Velocity?',
    answer:
      'Speed describes how fast an object moves. Velocity also includes direction, so a velocity component can be negative.',
  },
  {
    question: 'How Many mph Are in 1 m/s?',
    answer: '1 m/s is approximately 2.236936 mph.',
  },
  {
    question: 'How Many Knots Are in 1 m/s?',
    answer: '1 m/s is approximately 1.943844 knots.',
  },
  {
    question: 'How Do I Convert 72 km/h to m/s?',
    answer: '72 ÷ 3.6 = 20 m/s.',
  },
  {
    question: 'Can Speed Be Negative?',
    answer:
      'Speed as a magnitude cannot be negative. A signed velocity component can be negative to indicate direction.',
  },
];
