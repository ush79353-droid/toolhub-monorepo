import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertPressure, formatPressure, toPascals } from './calculation';
import { PASCALS_PER_ATM, PASCALS_PER_BAR, PASCALS_PER_PSI, PASCALS_PER_TORR } from './types';

export const BAROMETRIC_PRESSURE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-barometric-pressure', label: 'What Is Barometric Pressure?' },
  { id: 'barometric-pressure-units', label: 'Barometric Pressure Units Conversion' },
  { id: 'pressure-conversion-table', label: 'Pressure Conversion Table' },
  { id: 'barometric-pressure-example', label: 'Barometric Pressure Conversion Example' },
  { id: 'how-to-use-barometric-converter', label: 'How to Use the Barometric Pressure Converter' },
  { id: 'related-pressure-tools', label: 'Related Pressure Conversion Tools' },
  { id: 'barometric-pressure-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const BAROMETRIC_PRESSURE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-barometric-pressure',
    title: 'What Is Barometric Pressure?',
    paragraphs: [
      'Barometric pressure is atmospheric pressure — the force from the weight of the air column above a point on Earth. It is measured with a barometer and changes with altitude and weather. Higher altitude generally means lower atmospheric pressure. Meteorology and aviation rely on accurate pressure readings for forecasts and flight levels.',
      `The standard atmosphere is a defined reference, not the pressure at every location: 1 atm = ${PASCALS_PER_ATM.toLocaleString('en-US')} Pa = 1,013.25 hPa. Local weather and elevation still move the reading above or below that reference.`,
    ],
    formula: `1 atm = ${PASCALS_PER_ATM.toLocaleString('en-US')} Pa = 1,013.25 hPa`,
  },
  {
    id: 'barometric-pressure-units',
    title: 'Barometric Pressure Units Conversion',
    paragraphs: [
      'The pascal (Pa) is the SI unit of pressure: 1 Pa = 1 N/m². Hectopascals (hPa) are common in meteorology (1 hPa = 100 Pa). Millibars match that magnitude (1 mbar = 1 hPa). One bar equals 100,000 Pa.',
      `The standard atmosphere equals exactly ${PASCALS_PER_ATM.toLocaleString('en-US')} Pa. PSI (pounds-force per square inch) is common in engineering. Torr is defined as 1 atm / 760, while conventional mmHg uses 133.322387415 Pa — they are close but not identical.`,
    ],
    formula: `1 bar = ${PASCALS_PER_BAR.toLocaleString('en-US')} Pa  |  1 atm = ${PASCALS_PER_ATM.toLocaleString('en-US')} Pa  |  1 hPa = 1 mbar`,
  },
  {
    id: 'pressure-conversion-table',
    title: 'Pressure Conversion Table',
    paragraphs: [
      'Displayed values are rounded. The calculator uses exact SI-linked factors internally. Torr uses 101325/760 Pa; conventional mmHg is distinct.',
    ],
    tableHeaders: ['Starting Unit', 'Pascals (Pa)', 'Bar', 'Atmospheres (atm)'],
    table: [
      ['1 Pa', '1', formatPressure(convertPressure(1, 'Pa', 'bar')), formatPressure(convertPressure(1, 'Pa', 'atm'))],
      ['1 bar', formatPressure(PASCALS_PER_BAR), '1', formatPressure(convertPressure(1, 'bar', 'atm'))],
      ['1 atm', formatPressure(PASCALS_PER_ATM), formatPressure(convertPressure(1, 'atm', 'bar')), '1'],
      ['1 Torr', formatPressure(PASCALS_PER_TORR), formatPressure(convertPressure(1, 'Torr', 'bar')), formatPressure(convertPressure(1, 'Torr', 'atm'))],
      ['1 psi', formatPressure(PASCALS_PER_PSI), formatPressure(convertPressure(1, 'psi', 'bar')), formatPressure(convertPressure(1, 'psi', 'atm'))],
    ],
  },
  {
    id: 'barometric-pressure-example',
    title: 'Barometric Pressure Conversion Example',
    paragraphs: [
      `Convert 12 bar into atmospheres. First, 12 bar = ${formatPressure(toPascals(12, 'bar'))} Pa. Then atmospheres = ${formatPressure(toPascals(12, 'bar'))} ÷ ${PASCALS_PER_ATM.toLocaleString('en-US')} ≈ ${formatPressure(convertPressure(12, 'bar', 'atm'))} atm.`,
      'A typical standard atmospheric reading: 1,013.25 hPa = 101,325 Pa = 1 atm.',
    ],
    formula: `12 bar ≈ ${formatPressure(convertPressure(12, 'bar', 'atm'))} atm  |  1,013.25 hPa = 1 atm`,
  },
  {
    id: 'how-to-use-barometric-converter',
    title: 'How to Use the Barometric Pressure Converter',
    paragraphs: [
      '1. Select the pressure unit for the field you want to enter. 2. Type the pressure value. 3. View the automatically calculated equivalents. 4. Change another unit selector if needed — the physical pressure stays the same. 5. Edit any displayed field to start a new conversion. 6. Use Share Result to copy the values. 7. Use Reload Calculator or Clear All Changes to reset.',
    ],
  },
  {
    id: 'related-pressure-tools',
    title: 'Related Pressure Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include Pressure Conversion, ATM Conversion, ATM to Pascals Conversion, Torr to ATM Conversion, and Force Converter.',
    ],
  },
];

export const BAROMETRIC_PRESSURE_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert Barometric Pressure From Bars to Hectopascals?',
    answer:
      '1 bar = 1,000 hPa. Formula: hPa = bar × 1,000. Example: 1.2 bar = 1,200 hPa.',
  },
  {
    question: 'What Is 210 Kilopascals of Pressure in Bars?',
    answer: '1 bar = 100 kPa, so 210 kPa ÷ 100 = 2.1 bar. Result: 210 kPa equals 2.1 bar.',
  },
  {
    question: 'What Is Normal Atmospheric Pressure?',
    answer: `Standard atmospheric pressure is defined as ${PASCALS_PER_ATM.toLocaleString('en-US')} Pa, 1,013.25 hPa, 1.01325 bar, and 1 atm. Actual weather and altitude still vary around that reference.`,
  },
  {
    question: 'Is One Atmosphere Equal to One Bar?',
    answer: 'No. 1 atm = 1.01325 bar. One standard atmosphere is slightly greater than one bar.',
  },
  {
    question: 'How Do You Convert Atmospheres to PSI?',
    answer: `psi = atm × (${PASCALS_PER_ATM} ÷ ${PASCALS_PER_PSI}). Example: 2 atm ≈ ${formatPressure(convertPressure(2, 'atm', 'psi'))} psi.`,
  },
  {
    question: 'What Is the Difference Between hPa and mbar?',
    answer:
      'Both represent the same pressure magnitude: 1 hPa = 1 mbar. Hectopascals are common in meteorological reporting; millibars remain familiar in many contexts.',
  },
];
