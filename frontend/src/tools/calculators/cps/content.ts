import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CPS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the CPS Calculator' },
  { id: 'frequency-units', label: 'Frequency Units' },
  { id: 'conversion-table', label: 'Frequency Conversion Table' },
  { id: 'cps-to-hz', label: 'How to Convert Cycles per Second to Hertz' },
  { id: 'cps-to-rpm', label: 'How to Convert Cycles per Second to RPM' },
  { id: 'cps-to-rad', label: 'How to Convert Cycles per Second to Radians per Second' },
  { id: 'cps-to-deg', label: 'How to Convert Cycles per Second to Degrees per Second' },
  { id: 'applications', label: 'Practical Applications of Frequency Conversion' },
  { id: 'cps-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const CPS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the CPS Calculator',
    paragraphs: [
      '1. Enter a frequency value into any of the nine fields.',
      '2. View the equivalent values in all other units instantly.',
      '3. Edit another field to reverse the conversion.',
      '4. Use Share Result to copy the answer, or Reload / Clear to start over.',
      'Example: 5 cps equals 5 Hz, 300 RPM, 1,800 deg/s, and about 31.416 rad/s — assuming one cycle is one full revolution.',
    ],
  },
  {
    id: 'frequency-units',
    title: 'Frequency Units',
    paragraphs: [
      'Frequency measures how often a repeating event occurs per unit of time. Cycles per second (cps) and hertz (Hz) describe the same SI frequency quantity. Cycles per minute (cpm) and revolutions per minute (RPM) count events or revolutions per minute.',
      'Kilohertz, megahertz, and gigahertz are scaled SI prefixes of hertz. Degrees per second and radians per second measure angular speed (angular frequency) for a rotating or oscillating system.',
      'This calculator converts between those units under the assumption that each cycle corresponds to one complete revolution or angular period (2π radians or 360°).',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Frequency Conversion Table',
    paragraphs: ['Representative values under the one-cycle-per-revolution assumption:'],
    tableHeaders: ['cps', 'Hz', 'RPM', 'rad/s', 'deg/s'],
    table: [
      ['0.5', '0.5', '30', '3.141593', '180'],
      ['1', '1', '60', '6.283185', '360'],
      ['2', '2', '120', '12.566371', '720'],
      ['5', '5', '300', '31.415927', '1,800'],
      ['10', '10', '600', '62.831853', '3,600'],
      ['50', '50', '3,000', '314.159265', '18,000'],
      ['100', '100', '6,000', '628.318531', '36,000'],
    ],
  },
  {
    id: 'cps-to-hz',
    title: 'How to Convert Cycles per Second to Hertz',
    paragraphs: [
      'Hertz is the SI unit of frequency. One cycle per second equals one hertz. Example: 25 cps = 25 Hz.',
    ],
    formula: 'f_Hz = f_cps',
  },
  {
    id: 'cps-to-rpm',
    title: 'How to Convert Cycles per Second to RPM',
    paragraphs: [
      'Multiply cps by 60 when one cycle is one complete revolution. Example: 5 × 60 = 300 RPM.',
    ],
    formula: 'RPM = cps × 60',
  },
  {
    id: 'cps-to-rad',
    title: 'How to Convert Cycles per Second to Radians per Second',
    paragraphs: [
      'Angular frequency ω equals 2πf, where f is frequency in cps or Hz. Example: 4 × 2π ≈ 25.132741 rad/s.',
    ],
    formula: 'ω = 2πf',
  },
  {
    id: 'cps-to-deg',
    title: 'How to Convert Cycles per Second to Degrees per Second',
    paragraphs: [
      'Multiply cps by 360 for a full rotational cycle. Example: 4 × 360 = 1,440 deg/s.',
    ],
    formula: 'deg/s = cps × 360',
  },
  {
    id: 'applications',
    title: 'Practical Applications of Frequency Conversion',
    paragraphs: [
      'Frequency conversion appears in electric motors, rotating machinery, vibration analysis, electronics, alternating current, acoustics, radio systems, scientific instruments, and industrial equipment.',
      'Angular speed (rad/s or deg/s) has a physical meaning only when the cycle maps to a defined angular period. Always check how the measured “cycle” is defined for your system.',
    ],
  },
];

export const CPS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Hertz Are in One Cycle per Second?',
    answer: 'One cycle per second equals one hertz.',
  },
  {
    question: 'How Many Cycles per Second Are in One Kilohertz?',
    answer: 'One kilohertz equals 1,000 cycles per second.',
  },
  {
    question: 'How Many Cycles per Second Are 60 Hz?',
    answer: '60 Hz equals 60 cycles per second.',
  },
  {
    question: 'How Many RPM Equal One CPS?',
    answer:
      'One CPS equals 60 RPM when one cycle represents one full revolution.',
  },
  {
    question: 'How Do I Convert CPS to Radians per Second?',
    answer: 'Multiply CPS by 2π.',
  },
  {
    question: 'What Is the Difference Between CPS and Hz?',
    answer:
      'They describe the same frequency quantity. Hertz is the SI unit of frequency, while cycles per second expresses the quantity descriptively.',
  },
  {
    question: 'Is RPM the Same as Hertz?',
    answer:
      'No. Hertz counts cycles per second, while RPM counts revolutions per minute. For a rotating system with one revolution per cycle, 1 Hz equals 60 RPM.',
  },
  {
    question: 'How Many Degrees per Second Equal 1 Hz?',
    answer:
      'One hertz corresponds to 360 degrees per second for a complete rotational cycle.',
  },
];
