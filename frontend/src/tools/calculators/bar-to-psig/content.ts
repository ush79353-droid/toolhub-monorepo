import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  absoluteBarToPsig,
  formatPressure,
  gaugeBarToPsig,
} from './calculation';
import { PSI_PER_BAR, STANDARD_ATMOSPHERIC_BAR, STANDARD_ATMOSPHERIC_PSI } from './types';

export const BAR_TO_PSIG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert-bar-to-psig', label: 'How to Convert Bar to PSIG' },
  { id: 'absolute-vs-gauge-pressure', label: 'Absolute Pressure vs. Gauge Pressure' },
  { id: 'related-pressure-converters', label: 'Related Pressure Converters' },
  { id: 'bar-to-psig-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    formula?: string;
  }[];
  links?: readonly { href: string; label: string }[];
}

export const BAR_TO_PSIG_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert-bar-to-psig',
    title: 'How to Convert Bar to PSIG',
    paragraphs: [
      'A bar is a metric pressure unit equal to 100,000 pascals (100 kPa). PSI means pounds per square inch. PSIG is pounds per square inch gauge — pressure relative to the surrounding atmosphere, not to a perfect vacuum.',
      `When the bar reading is absolute (bar(a)), subtract atmospheric pressure in bar, then multiply by ${PSI_PER_BAR}. When the bar reading is already gauge (bar(g)), multiply by ${PSI_PER_BAR} with no atmospheric offset.`,
      `At standard atmosphere (${STANDARD_ATMOSPHERIC_BAR} bar ≈ ${formatPressure(STANDARD_ATMOSPHERIC_PSI)} psi), absolute pressure equal to atmosphere reads 0 PSIG.`,
    ],
    formula: `PSIG = (bar(a) − atmospheric pressure in bar) × ${PSI_PER_BAR}`,
    subsections: [
      {
        id: 'bar-to-psig-conversion-formula',
        title: 'Bar to PSIG Conversion Formula',
        paragraphs: [
          `Absolute: PSIG = (bar(a) − P_atm) × ${PSI_PER_BAR}. Gauge: PSIG = bar(g) × ${PSI_PER_BAR}. P_atm defaults to standard atmosphere ${STANDARD_ATMOSPHERIC_BAR} bar and is editable for other reference atmospheres.`,
        ],
        formula: `PSIG = bar(g) × ${PSI_PER_BAR}`,
      },
      {
        id: 'converting-10-bar-to-psig',
        title: 'Converting 10 Bar to PSIG',
        paragraphs: [
          `For 10 bar(a) at ${STANDARD_ATMOSPHERIC_BAR} bar atmosphere: PSIG = (10 − ${STANDARD_ATMOSPHERIC_BAR}) × ${PSI_PER_BAR} ≈ ${formatPressure(absoluteBarToPsig(10))} PSIG.`,
          `For 10 bar(g): PSIG = 10 × ${PSI_PER_BAR} ≈ ${formatPressure(gaugeBarToPsig(10))} PSIG. The absolute and gauge results differ because only absolute pressure must remove atmospheric pressure first.`,
        ],
      },
    ],
  },
  {
    id: 'absolute-vs-gauge-pressure',
    title: 'Absolute Pressure vs. Gauge Pressure',
    paragraphs: [
      'Absolute pressure is referenced to a perfect vacuum. Gauge pressure is referenced to the surrounding atmospheric pressure.',
      'Absolute pressure = Gauge pressure + Atmospheric pressure. Gauge pressure = Absolute pressure − Atmospheric pressure.',
      'The calculator’s pressure-reference selector chooses which bar definition you entered so atmospheric pressure is applied only when converting between absolute pressure and PSIG.',
    ],
    formula: 'Absolute = Gauge + Atmospheric · Gauge = Absolute − Atmospheric',
  },
  {
    id: 'applications-bar-to-psig',
    title: 'Applications of Bar to PSIG Conversion',
    paragraphs: [
      'Bar ↔ PSIG conversions appear in industrial measurements, pneumatic and hydraulic systems, compressors, pressure gauges, engineering calculations, equipment specifications, and process instrumentation. Match the unit and reference type (absolute vs gauge) used by the equipment documentation.',
    ],
  },
  {
    id: 'related-pressure-converters',
    title: 'Related Pressure Converters',
    paragraphs: ['Related Omega Calculators tools that already exist:'],
    links: [
      { href: '/tools/bar-to-psi-conversion', label: 'Bar to PSI Conversion' },
      { href: '/tools/pressure-conversion', label: 'Pressure Conversion' },
      { href: '/tools/atm-conversion', label: 'ATM Conversion' },
      { href: '/tools/bar-to-atm-conversion', label: 'Bar to ATM Conversion' },
      { href: '/tools/barometric-pressure-conversion', label: 'Barometric Pressure Conversion' },
      { href: '/tools/atm-to-pascals-conversion', label: 'ATM to Pascals Conversion' },
      { href: '/tools/lbs-to-psi-converter', label: 'Lbs to PSI Converter' },
    ],
  },
];

export const BAR_TO_PSIG_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Bar to PSIG?',
    answer: `For absolute bar: PSIG = (bar − ${STANDARD_ATMOSPHERIC_BAR}) × ${PSI_PER_BAR} at standard atmosphere. For gauge bar: PSIG = bar × ${PSI_PER_BAR}.`,
  },
  {
    question: 'What Is 150 Bar in PSIG?',
    answer: `At ${STANDARD_ATMOSPHERIC_BAR} bar atmosphere, 150 bar(a) ≈ ${formatPressure(absoluteBarToPsig(150))} PSIG. As gauge pressure, 150 bar(g) ≈ ${formatPressure(gaugeBarToPsig(150))} PSIG. The results differ because absolute mode subtracts atmospheric pressure.`,
  },
  {
    question: 'Is 1 Bar Equal to 14.5 PSIG?',
    answer: `One bar as a pressure difference is about ${PSI_PER_BAR} psi. One bar absolute at standard atmosphere is about ${formatPressure(absoluteBarToPsig(1))} PSIG (slightly negative). One bar gauge is about ${formatPressure(gaugeBarToPsig(1))} PSIG.`,
  },
  {
    question: 'What Does PSIG Stand For?',
    answer:
      'PSIG means pounds per square inch gauge. It expresses pressure relative to the surrounding atmosphere.',
  },
  {
    question: 'Can PSIG Be Negative?',
    answer:
      'Yes. Negative PSIG indicates pressure below atmospheric pressure and is commonly associated with vacuum conditions. Absolute pressure must still remain non-negative.',
  },
  {
    question: 'What Is the Difference Between PSI, PSIA, and PSIG?',
    answer:
      'PSI is a unit of pressure. PSIA is absolute pressure in pounds per square inch (vacuum reference). PSIG is gauge pressure in pounds per square inch (atmosphere reference). Saying “PSI” alone does not specify which reference is intended.',
  },
];
