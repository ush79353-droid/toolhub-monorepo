import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'si-unit', label: 'SI Unit of Capacitance' },
  { id: 'other-units', label: 'Other Units of Capacitance' },
  { id: 'unit-conversion', label: 'Capacitance Unit Conversion' },
  { id: 'conversion-chart', label: 'Capacitance Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'practical-uses', label: 'Practical Applications' },
  { id: 'cap-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    formula?: string;
  }[];
}

export const CAP_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'si-unit',
    title: 'SI Unit of Capacitance',
    paragraphs: [
      'Electrical capacitance measures how much electric charge a component can store per volt of potential difference. Capacitors appear in power supplies, filters, timing networks, sensors, and RF circuits. The SI unit is the farad (F). Capacitance relates charge and voltage by C = Q / V, so one farad stores one coulomb of charge across one volt.',
      'Example: if a capacitor holds 2 C across 4 V, C = 2 / 4 = 0.5 F. Practical electronics almost always use millifarads, microfarads, nanofarads, or picofarads rather than whole farads, except for large supercapacitors.',
    ],
    formula: 'C = Q / V · 1 F = 1 C / 1 V',
  },
  {
    id: 'other-units',
    title: 'Other Units of Capacitance',
    paragraphs: [
      'SI prefixes scale the farad by powers of ten. Millifarads (mF) and microfarads (µF) are common for electrolytic and bulk capacitors. Nanofarads (nF) appear in many signal and coupling parts. Picofarads (pF) describe small ceramic, trimmer, and RF capacitances.',
    ],
    tableHeaders: ['Unit', 'Symbol', 'Value in farads'],
    table: [
      { left: 'Farad', right: 'F', third: '1' },
      { left: 'Millifarad', right: 'mF', third: '10⁻³' },
      { left: 'Microfarad', right: 'µF', third: '10⁻⁶' },
      { left: 'Nanofarad', right: 'nF', third: '10⁻⁹' },
      { left: 'Picofarad', right: 'pF', third: '10⁻¹²' },
    ],
  },
  {
    id: 'unit-conversion',
    title: 'Capacitance Unit Conversion',
    paragraphs: [
      'Adjacent SI capacitance prefixes differ by a factor of 1000. Convert by multiplying or dividing by 1000 for each step, or convert through farads as a common base.',
    ],
    formula: '1 F = 1000 mF · 1 mF = 1000 µF · 1 µF = 1000 nF · 1 nF = 1000 pF',
    subsections: [
      {
        id: 'uf-to-nf',
        title: 'Microfarads to Nanofarads',
        paragraphs: ['Multiply microfarads by 1000. Example: 4.7 µF = 4700 nF.'],
        formula: 'nF = µF × 1000',
      },
      {
        id: 'nf-to-pf',
        title: 'Nanofarads to Picofarads',
        paragraphs: ['Multiply nanofarads by 1000. Example: 47 nF = 47,000 pF.'],
        formula: 'pF = nF × 1000',
      },
      {
        id: 'pf-to-uf',
        title: 'Picofarads to Microfarads',
        paragraphs: ['Divide picofarads by 1,000,000. Example: 100,000 pF = 0.1 µF.'],
        formula: 'µF = pF / 1,000,000',
      },
      {
        id: 'uf-to-f',
        title: 'Microfarads to Farads',
        paragraphs: ['Divide microfarads by 1,000,000. Example: 2200 µF = 0.0022 F.'],
        formula: 'F = µF / 1,000,000',
      },
    ],
  },
  {
    id: 'conversion-chart',
    title: 'Capacitance Conversion Chart',
    paragraphs: ['Common microfarad values with nanofarad and picofarad equivalents:'],
    tableHeaders: ['µF', 'nF', 'pF'],
    table: [
      { left: '0.001', right: '1', third: '1000' },
      { left: '0.01', right: '10', third: '10000' },
      { left: '0.047', right: '47', third: '47000' },
      { left: '0.1', right: '100', third: '100000' },
      { left: '0.22', right: '220', third: '220000' },
      { left: '0.47', right: '470', third: '470000' },
      { left: '1', right: '1000', third: '1000000' },
      { left: '2.2', right: '2200', third: '2200000' },
      { left: '4.7', right: '4700', third: '4700000' },
      { left: '10', right: '10000', third: '10000000' },
      { left: '100', right: '100000', third: '100000000' },
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Capacitance Converter',
    paragraphs: [
      '1) Open the Capacitance Converter. 2) Enter a value in any of the five fields (F, mF, µF, nF, pF). 3) Read the automatically updated equivalents. 4) Edit another field for reverse conversion. 5) Share or copy the summary if needed. 6) Clear fields or reload to the 1 F default.',
    ],
  },
  {
    id: 'practical-uses',
    title: 'Practical Applications of Capacitance Conversion',
    paragraphs: [
      'Use these conversions when reading datasheets, matching BOM values, designing filters and timing networks, sizing power-supply bulk capacitance, selecting RF and sensor parts, and comparing markings that use different SI prefixes. Always confirm voltage rating, dielectric, ESR, and tolerance separately from the unit conversion.',
    ],
  },
];

export const CAP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the SI unit of capacitance?',
    answer:
      'The SI unit of capacitance is the farad (F). One farad represents one coulomb of charge per volt.',
  },
  {
    question: 'What is the formula for capacitance?',
    answer: 'C = Q / V. Capacitance equals electric charge divided by potential difference.',
  },
  {
    question: 'How do I convert µF to nF?',
    answer: 'Multiply the microfarad value by 1000. Example: 2.2 µF = 2200 nF.',
  },
  {
    question: 'How do I convert pF to nF?',
    answer: 'Divide the picofarad value by 1000. Example: 10,000 pF = 10 nF.',
  },
  {
    question: 'How do I convert µF to F?',
    answer: 'Divide the microfarad value by 1,000,000. Example: 1000 µF = 0.001 F.',
  },
  {
    question: 'How many microfarads are in one farad?',
    answer: '1 F = 1,000,000 µF.',
  },
  {
    question: 'How many picofarads are in one nanofarad?',
    answer: '1 nF = 1000 pF.',
  },
  {
    question: 'Is 100 nF equal to 0.1 µF?',
    answer: 'Yes. 100 nF = 0.1 µF.',
  },
  {
    question: 'What is the difference between µF and nF?',
    answer: 'A microfarad is 1000 times larger than a nanofarad. 1 µF = 1000 nF.',
  },
  {
    question: 'Can I convert capacitor values automatically?',
    answer:
      'Yes. Enter a value in any field of this Capacitance Converter to calculate equivalents in F, mF, µF, nF, and pF.',
  },
];
