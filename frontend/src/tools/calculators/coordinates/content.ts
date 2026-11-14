import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  ddmToDecimalDegrees,
  decimalDegreesToDdmDisplay,
  decimalDegreesToDmsDisplay,
  dmsToDecimalDegrees,
  formatDd,
  formatDdmLine,
  formatDmsLine,
  formatMinutesField,
  formatSecondsField,
} from './calculation';
import { EXAMPLE_LATITUDE, EXAMPLE_LONGITUDE } from './types';

export const COORDINATES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'lat-lon', label: 'Latitude and Longitude' },
  { id: 'how-to-write', label: 'How to Write Coordinates' },
  { id: 'how-to-convert', label: 'How to Convert' },
  { id: 'dms-to-dd', label: 'DMS to Decimal Degrees' },
  { id: 'dd-to-dms', label: 'Decimal Degrees to DMS' },
  { id: 'dd-to-ddm', label: 'DD to DDM' },
  { id: 'ddm-to-dd', label: 'DDM to DD' },
  { id: 'examples', label: 'Examples' },
  { id: 'applications', label: 'Where Coordinates Are Used' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'coordinates-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  left: string;
  right: string;
  third?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly ConversionTableRow[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
  tableNote?: string;
}

const latDms = decimalDegreesToDmsDisplay(EXAMPLE_LATITUDE);
const lonDms = decimalDegreesToDmsDisplay(EXAMPLE_LONGITUDE);
const latDdm = decimalDegreesToDdmDisplay(EXAMPLE_LATITUDE);
const lonDdm = decimalDegreesToDdmDisplay(EXAMPLE_LONGITUDE);

export const COORDINATES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'Geographic coordinates describe a position on Earth using latitude and longitude. The same place can be written in Decimal Degrees (DD), Degrees Minutes Seconds (DMS), or Degrees and Decimal Minutes (DDM).',
      'This converter changes only the representation. Switching formats keeps the geographic location. Hemisphere letters (N/S, E/W) and signed decimals are two ways to show the same direction.',
    ],
  },
  {
    id: 'lat-lon',
    title: 'What Is Latitude and Longitude?',
    paragraphs: [
      'Latitude is the angular position north or south of the equator. It ranges from −90° at the South Pole to +90° at the North Pole. The equator is 0° latitude.',
      'Longitude is the angular position east or west of the prime meridian. It ranges from −180° to +180°. Positive latitudes are north; positive longitudes are east under the signed-decimal convention.',
    ],
    formula: 'Latitude: −90° … +90°   ·   Longitude: −180° … +180°',
  },
  {
    id: 'how-to-write',
    title: 'How to Write Coordinates',
    paragraphs: [
      `Decimal Degrees use a single number per axis, for example ${formatDd(EXAMPLE_LATITUDE)}, ${formatDd(EXAMPLE_LONGITUDE)}.`,
      `DMS splits each angle into degrees, minutes, and seconds: ${formatDmsLine(latDms, 'N')} and ${formatDmsLine(lonDms, 'W')}.`,
      `DDM uses whole degrees plus decimal minutes: ${formatDdmLine(latDdm, 'N')} and ${formatDdmLine(lonDdm, 'W')}. All three describe the same location.`,
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Latitude and Longitude',
    paragraphs: [
      'Angular sexagesimal units follow 1° = 60′ and 1′ = 60″, so 1° = 3600″. Convert each axis independently, then apply the hemisphere sign to the full magnitude.',
    ],
    formula: '1° = 60′ = 3600″',
  },
  {
    id: 'dms-to-dd',
    title: 'Convert DMS to Decimal Degrees',
    paragraphs: [
      `DD = Degrees + Minutes/60 + Seconds/3600, then apply N/S or E/W. Example: ${latDms.degrees}° ${latDms.minutes}′ ${formatSecondsField(latDms.seconds)}″ N → ${formatDd(dmsToDecimalDegrees(latDms.degrees, latDms.minutes, latDms.seconds, 1))}°.`,
      'Never apply a minus sign only to whole degrees while adding positive minutes and seconds.',
    ],
    formula: 'DD = ±(Degrees + Minutes/60 + Seconds/3600)',
  },
  {
    id: 'dd-to-dms',
    title: 'Convert Decimal Degrees to DMS',
    paragraphs: [
      `Take the absolute value, extract whole degrees, multiply the fraction by 60 for minutes, then multiply the remaining fraction by 60 for seconds. Example: ${formatDd(EXAMPLE_LATITUDE)}° → ${formatDmsLine(latDms, null)}.`,
    ],
    formula: 'Degrees = floor(|DD|); Minutes = floor(frac×60); Seconds = rem×60',
  },
  {
    id: 'dd-to-ddm',
    title: 'Convert DD to DDM',
    paragraphs: [
      `Whole degrees are floor(|DD|). Decimal minutes are the fractional degrees × 60. Example: ${formatDd(EXAMPLE_LATITUDE)}° → ${formatDdmLine(latDdm, null)}.`,
    ],
    formula: 'Decimal Minutes = (|DD| − Degrees) × 60',
  },
  {
    id: 'ddm-to-dd',
    title: 'Convert DDM to DD',
    paragraphs: [
      `DD = Degrees + Decimal Minutes/60, then apply the hemisphere sign. Example: ${latDdm.degrees}° ${formatMinutesField(latDdm.decimalMinutes)}′ → ${formatDd(ddmToDecimalDegrees(latDdm.degrees, latDdm.decimalMinutes, 1))}°.`,
    ],
    formula: 'DD = ±(Degrees + Decimal Minutes/60)',
  },
  {
    id: 'examples',
    title: 'Geographic Coordinate Examples',
    paragraphs: [
      'The table below compares one latitude/longitude pair across DD, DMS, and DDM. Displayed decimals are rounded for reading; conversions keep full internal precision.',
    ],
    tableHeaders: ['Representation', 'Latitude', 'Longitude'],
    table: [
      {
        left: 'DD',
        right: `${formatDd(EXAMPLE_LATITUDE)}°`,
        third: `${formatDd(EXAMPLE_LONGITUDE)}°`,
      },
      {
        left: 'DMS',
        right: formatDmsLine(latDms, 'N'),
        third: formatDmsLine(lonDms, 'W'),
      },
      {
        left: 'DDM',
        right: formatDdmLine(latDdm, 'N'),
        third: formatDdmLine(lonDdm, 'W'),
      },
    ],
    tableNote: 'Same geographic location in three formats.',
  },
  {
    id: 'applications',
    title: 'Where Coordinates Are Used',
    paragraphs: [
      'Latitude/longitude formats appear in GPS navigation, GIS, surveying, mapping, aviation and marine navigation, hiking, scientific fieldwork, and location sharing. Devices may display DD, DMS, or DDM depending on settings.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Coordinates Converter',
    paragraphs: [
      '1. Choose DD, DMS, or DDM.',
      '2. Optionally enable My coordinates show letters for N/S and E/W selectors.',
      '3. Enter latitude, then longitude.',
      '4. Switch formats to read the converted representation of the same place.',
      '5. Copy or share the result, or reload/clear to reset.',
    ],
  },
];

export const COORDINATES_FAQS: readonly FAQItem[] = [
  {
    question: 'What does DMS stand for in coordinates?',
    answer: 'DMS means Degrees, Minutes, Seconds.',
  },
  {
    question: 'What is DD coordinate format?',
    answer: 'DD means Decimal Degrees — each axis is a single decimal number of degrees.',
  },
  {
    question: 'What is DDM coordinate format?',
    answer: 'DDM means Degrees and Decimal Minutes.',
  },
  {
    question: 'How do I convert DMS to Decimal Degrees?',
    answer:
      'Add Degrees + Minutes/60 + Seconds/3600 for the magnitude, then apply the hemisphere sign to that whole magnitude.',
  },
  {
    question: 'How do I convert latitude and longitude to decimal degrees?',
    answer: 'Convert each axis independently with the matching DD, DMS, or DDM formula.',
  },
  {
    question: 'What is the range of latitude?',
    answer: 'Latitude ranges from −90° to +90°.',
  },
  {
    question: 'What is the range of longitude?',
    answer: 'Longitude ranges from −180° to +180°.',
  },
  {
    question: 'What does negative latitude mean?',
    answer: 'Under the signed-decimal convention, negative latitude is in the Southern Hemisphere.',
  },
  {
    question: 'What does negative longitude mean?',
    answer: 'Under the signed-decimal convention, negative longitude is in the Western Hemisphere.',
  },
  {
    question: 'What is the difference between latitude and longitude?',
    answer:
      'Latitude measures north–south angular position from the equator; longitude measures east–west angular position from the prime meridian.',
  },
  {
    question: 'How many minutes are in one degree?',
    answer: '60 angular minutes.',
  },
  {
    question: 'How many seconds are in one degree?',
    answer: '3600 angular seconds.',
  },
  {
    question: `Is ${formatDd(EXAMPLE_LATITUDE)}° the same as ${formatDmsLine(latDms, null)}?`,
    answer: 'Yes. Both represent the same angular coordinate (within ordinary floating-point tolerance).',
  },
  {
    question: 'Can coordinates contain zero?',
    answer:
      'Yes. Zero latitude is the equator; zero longitude is the prime meridian.',
  },
  {
    question: 'What coordinate format does GPS use?',
    answer:
      'GPS receivers and apps commonly support decimal degrees and other latitude–longitude notations depending on the device.',
  },
  {
    question: 'Does changing coordinate format change the geographic location?',
    answer:
      'No. Converting between DD, DMS, and DDM changes only the representation, not the place on Earth.',
  },
];
