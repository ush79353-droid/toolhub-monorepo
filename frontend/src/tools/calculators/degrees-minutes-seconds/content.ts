import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  decimalToDMS,
  dmsToDecimal,
  formatDdAngle,
  formatDmsAngleLine,
} from './calculation';

export const DMS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-dms', label: 'What Are Degrees, Minutes, and Seconds?' },
  { id: 'dms-to-dd', label: 'Convert DMS to Decimal Degrees' },
  { id: 'dd-to-dms', label: 'Convert Decimal Degrees to DMS' },
  { id: 'negative-angles', label: 'Understanding Negative Angles' },
  { id: 'examples', label: 'DMS Conversion Examples' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'applications', label: 'Applications' },
  { id: 'dms-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
  tableNote?: string;
}

const ex47 = dmsToDecimal(47, 23, 12, 1);
const ex47Parts = decimalToDMS(ex47);

export const DMS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'Degrees, minutes, and seconds (DMS) split an angle into whole degrees plus arcminutes and arcseconds. Decimal degrees (DD) express the same angle as a single number.',
      'This calculator converts either direction for general angles—not only geographic coordinates. Negative values, fractional seconds, and angles larger than 360° are supported.',
    ],
  },
  {
    id: 'what-is-dms',
    title: 'What Are Degrees, Minutes, and Seconds?',
    paragraphs: [
      'One degree contains 60 arcminutes, and one arcminute contains 60 arcseconds, so one degree equals 3600 arcseconds. The usual symbols are ° for degrees, ′ for arcminutes, and ″ for arcseconds.',
      'Arcminutes and arcseconds measure angles, not time. The same sexagesimal idea appears in mathematics, geometry, astronomy, surveying, navigation, and geographic coordinates.',
    ],
    formula: '1° = 60′ = 3600″',
  },
  {
    id: 'dms-to-dd',
    title: 'How to Convert DMS to Decimal Degrees',
    paragraphs: [
      `Add whole degrees, minutes divided by 60, and seconds divided by 3600. Apply the sign to the full magnitude. Example: 47° 23′ 12″ → ${formatDdAngle(ex47)}°.`,
    ],
    formula: 'DD = Sign × (Degrees + Minutes/60 + Seconds/3600)',
  },
  {
    id: 'dd-to-dms',
    title: 'Decimal Degrees to DMS',
    paragraphs: [
      `Take the absolute value, extract whole degrees, multiply the fractional part by 60 for minutes, then multiply the remaining fraction by 60 for seconds. Example: ${formatDdAngle(ex47)}° → ${formatDmsAngleLine(ex47Parts)}.`,
      'Display rounding may carry 60″ into the next minute and 60′ into the next degree so invalid 60″ or 60′ values never appear.',
    ],
  },
  {
    id: 'negative-angles',
    title: 'Understanding Negative Angles',
    paragraphs: [
      'A negative DMS angle applies its sign to the entire magnitude: −12° 30′ 0″ equals −12.5°, not −12 + 0.5. Values such as −0° 30′ 0″ are −0.5°. Negative geographic latitudes or longitudes are one common application; this tool does not enforce geographic bounds.',
    ],
    formula: '−12° 30′ 0″ = −12.5°',
  },
  {
    id: 'examples',
    title: 'DMS Conversion Examples',
    paragraphs: [
      'Selected conversions computed with the same engine as the calculator:',
    ],
    table: [
      { left: '0° 30′ 0″', right: '0.5°' },
      { left: '12° 15′ 0″', right: '12.25°' },
      { left: '30° 45′ 0″', right: '30.75°' },
      { left: '45° 30′ 0″', right: '45.5°' },
      { left: '90° 0′ 0″', right: '90°' },
      { left: '−12° 30′ 0″', right: '−12.5°' },
    ],
    tableHeaders: ['DMS', 'Decimal Degrees'],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Calculator',
    paragraphs: [
      'Enter degrees, minutes, and seconds to see decimal degrees, or type a decimal-degree value to see DMS. Try an example, then copy or share the result. Reload or clear to start over.',
    ],
  },
  {
    id: 'applications',
    title: 'Applications of DMS Conversion',
    paragraphs: [
      'DMS conversion appears in survey measurements, celestial coordinates, GPS workflows, marine navigation, land mapping, GIS, general angle calculations, and engineering drawings whenever a sexagesimal format must match a decimal one.',
    ],
  },
];

export const DMS_FAQS: readonly FAQItem[] = [
  {
    question: 'What does DMS stand for?',
    answer: 'DMS stands for Degrees, Minutes, Seconds.',
  },
  {
    question: 'How do I convert DMS to decimal degrees?',
    answer:
      'Add whole degrees, minutes divided by 60, and seconds divided by 3600, applying the sign to the entire magnitude.',
  },
  {
    question: 'How do I convert decimal degrees to DMS?',
    answer:
      'Extract whole degrees, convert the fractional degrees into minutes, and convert the remaining fractional minutes into seconds.',
  },
  {
    question: 'How many minutes are in one degree?',
    answer: 'There are 60 arcminutes in one degree.',
  },
  {
    question: 'How many seconds are in one degree?',
    answer: 'There are 3600 arcseconds in one degree.',
  },
  {
    question: 'What is 30 minutes in decimal degrees?',
    answer: '30 arcminutes equal 0.5 degrees.',
  },
  {
    question: 'What is 45 minutes in decimal degrees?',
    answer: '45 arcminutes equal 0.75 degrees.',
  },
  {
    question: 'How do I convert 47.5 degrees to DMS?',
    answer: '47.5° equals 47° 30′ 0″.',
  },
  {
    question: 'How do I convert 10° 30′ 0″ to decimal degrees?',
    answer: '10° 30′ 0″ equals 10.5°.',
  },
  {
    question: 'Are DMS minutes the same as time minutes?',
    answer:
      'No. DMS arcminutes measure angles, while time minutes measure duration.',
  },
  {
    question: 'Can DMS angles be negative?',
    answer:
      'Yes. Negative angles are supported, with the sign applied to the entire angular magnitude.',
  },
  {
    question: 'Can DMS angles exceed 360 degrees?',
    answer:
      'Yes. General-purpose angles can exceed 360°. Geographic latitude and longitude have separate restrictions in dedicated converters.',
  },
  {
    question: 'Why does my converted result have small decimal differences?',
    answer:
      'Floating-point representation and display rounding can introduce very small numerical differences.',
  },
  {
    question: 'Is DMS used for latitude and longitude?',
    answer: 'Yes. DMS is one common format for geographic coordinates.',
  },
  {
    question: 'What is the difference between DMS and DD?',
    answer:
      'DMS expresses angles using degrees, arcminutes, and arcseconds. DD expresses the same angle as one decimal number.',
  },
];
