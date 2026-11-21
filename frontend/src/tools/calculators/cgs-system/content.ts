import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CGS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cgs', label: 'What Is the CGS System of Units?' },
  { id: 'mechanics', label: 'CGS Units in Mechanics' },
  { id: 'electromagnetism', label: 'CGS Units in Electromagnetism' },
  { id: 'constants', label: 'Physical Constants in CGS and MKS Units' },
  { id: 'how-to-convert', label: 'How to Convert CGS Units to SI Units' },
  { id: 'how-to-use', label: 'How to Use the CGS System of Units Converter' },
  { id: 'force-table', label: 'Force Conversion Table' },
  { id: 'energy-table', label: 'Energy Conversion Table' },
  { id: 'acceleration-table', label: 'Acceleration Conversion Table' },
  { id: 'cgs-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const CGS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-cgs',
    title: 'What Is the CGS System of Units?',
    paragraphs: [
      'CGS stands for centimeter–gram–second. It is a metric unit system whose fundamental mechanical units are the centimeter, the gram, and the second. SI (and MKS) use the meter, kilogram, and second for the corresponding base quantities. CGS remains useful in older literature and in some specialized scientific contexts.',
    ],
    tableHeaders: ['Fundamental quantity', 'CGS', 'SI'],
    table: [
      ['Length', 'centimeter (cm)', 'meter (m)'],
      ['Mass', 'gram (g)', 'kilogram (kg)'],
      ['Time', 'second (s)', 'second (s)'],
    ],
  },
  {
    id: 'mechanics',
    title: 'CGS Units in Mechanics',
    paragraphs: [
      'Common mechanical mappings include: 1 m = 100 cm; 1 kg = 1,000 g; 1 N = 100,000 dyn; 1 J = 10⁷ erg; 1 Pa = 10 Ba; 1 m/s² = 100 Gal; 1 Pa·s = 10 P; 1 m²/s = 10,000 St. The galileo (Gal) is an acceleration unit; not the gallon (gal).',
    ],
    tableHeaders: ['Quantity', 'SI', 'CGS', 'Factor (SI → CGS)'],
    table: [
      ['Length', 'm', 'cm', '×100'],
      ['Mass', 'kg', 'g', '×1,000'],
      ['Force', 'N', 'dyn', '×100,000'],
      ['Energy', 'J', 'erg', '×10,000,000'],
      ['Pressure', 'Pa', 'Ba', '×10'],
      ['Acceleration', 'm/s²', 'Gal', '×100'],
      ['Dynamic viscosity', 'Pa·s', 'P', '×10'],
      ['Kinematic viscosity', 'm²/s', 'St', '×10,000'],
    ],
  },
  {
    id: 'electromagnetism',
    title: 'CGS Units in Electromagnetism',
    paragraphs: [
      'Electromagnetic CGS is historically important but is not a single universal system. CGS-ESU (electrostatic), CGS-EMU (electromagnetic), Gaussian CGS, and Heaviside–Lorentz formulations use different quantity definitions and field equations. Units such as the statcoulomb, abcoulomb, gauss, oersted, and statvolt belong to specific conventions.',
      'Because of that, electromagnetic quantities cannot safely share one SI↔CGS factor the way mechanical quantities can. This converter focuses on reliable mechanical conversions; electromagnetic discussion here is educational and convention-aware rather than a mixed EM calculator.',
    ],
  },
  {
    id: 'constants',
    title: 'Physical Constants in CGS and MKS Units',
    paragraphs: [
      'Selected constants below use SI (MKS-compatible) values for shared mechanical constants. Electromagnetic constants depend on convention and are labeled accordingly.',
    ],
    tableHeaders: ['Constant', 'SI / MKS value', 'Notes'],
    table: [
      ['Speed of light c', '2.99792458×10⁸ m/s', 'Exact in SI'],
      ['Gravitational constant G', '6.67430×10⁻¹¹ m³·kg⁻¹·s⁻²', 'CODATA-style SI'],
      ['Planck constant h', '6.62607015×10⁻³⁴ J·s', 'Exact in SI'],
      ['Boltzmann constant k', '1.380649×10⁻²³ J/K', 'Exact in SI'],
      ['Avogadro constant Nₐ', '6.02214076×10²³ mol⁻¹', 'Exact in SI'],
      ['Elementary charge e', '1.602176634×10⁻¹⁹ C', 'SI; CGS charge units depend on ESU/EMU/Gaussian'],
      ['Vacuum permeability μ₀', '1.25663706212×10⁻⁶ N·A⁻²', 'SI; CGS EM formulations differ'],
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert CGS Units to SI Units',
    paragraphs: [
      'Identify the quantity, then divide the CGS value by the SI→CGS factor (or multiply SI by that factor). Example: 500,000 dyn ÷ 100,000 = 5 N, because 1 N = 100,000 dyn.',
    ],
    formula: 'CGS = SI × k · SI = CGS / k',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the CGS System of Units Converter',
    paragraphs: [
      '1. Select the physical quantity (Acceleration is the default).',
      '2. Enter an SI or CGS value.',
      '3. The other field updates immediately.',
      '4. Edit either field for reverse conversion.',
      '5. Change quantity to clear stale values and switch units.',
      '6. Share or copy the result; Reload or Clear to reset.',
    ],
  },
  {
    id: 'force-table',
    title: 'Force Conversion Table',
    paragraphs: ['1 N = 100,000 dyn'],
    tableHeaders: ['Newtons', 'Dynes'],
    table: [
      ['0.001', '100'],
      ['0.01', '1,000'],
      ['0.1', '10,000'],
      ['1', '100,000'],
      ['5', '500,000'],
      ['10', '1,000,000'],
    ],
  },
  {
    id: 'energy-table',
    title: 'Energy Conversion Table',
    paragraphs: ['1 J = 10,000,000 erg'],
    tableHeaders: ['Joules', 'Ergs'],
    table: [
      ['0.000001', '10'],
      ['0.001', '10,000'],
      ['0.01', '100,000'],
      ['0.1', '1,000,000'],
      ['1', '10,000,000'],
      ['10', '100,000,000'],
    ],
  },
  {
    id: 'acceleration-table',
    title: 'Acceleration Conversion Table',
    paragraphs: ['1 m/s² = 100 Gal (galileo)'],
    tableHeaders: ['m/s²', 'Gal'],
    table: [
      ['0.01', '1'],
      ['0.1', '10'],
      ['1', '100'],
      ['5', '500'],
      ['9.80665', '980.665'],
      ['10', '1,000'],
    ],
  },
];

export const CGS_FAQS: readonly FAQItem[] = [
  {
    question: 'What Does CGS Stand For?',
    answer:
      'CGS stands for centimeter–gram–second, referring to the three fundamental mechanical units of the system.',
  },
  {
    question: 'What Is the Difference Between CGS and SI Units?',
    answer:
      'CGS uses centimeters and grams as its fundamental length and mass units, while SI uses meters and kilograms. Both use seconds for time. Electromagnetic conventions also differ significantly.',
  },
  {
    question: 'How Do I Convert CGS Force to SI Force?',
    answer: 'Divide the force in dynes by 100,000 to obtain newtons. N = dyn / 100000.',
  },
  {
    question: 'How Many Dynes Are in One Newton?',
    answer: '1 N = 100,000 dyn.',
  },
  {
    question: 'How Many Ergs Are in One Joule?',
    answer: '1 J = 10,000,000 erg.',
  },
  {
    question: 'What Is the CGS Unit of Pressure?',
    answer: 'The barye (Ba), equal to one dyne per square centimeter. 1 Ba = 0.1 Pa.',
  },
  {
    question: 'What Is the CGS Unit of Acceleration?',
    answer: 'The galileo (Gal). 1 Gal = 0.01 m/s².',
  },
  {
    question: 'Is CGS Still Used Today?',
    answer:
      'Yes. CGS-derived units remain useful in some scientific and engineering contexts, including astrophysics, geophysics, fluid mechanics, and older literature.',
  },
  {
    question: 'Is the CGS System the Same as MKS?',
    answer:
      'No. CGS uses centimeters, grams, and seconds, while MKS uses meters, kilograms, and seconds.',
  },
  {
    question: 'Can All Electromagnetic CGS Units Be Converted Using One Factor?',
    answer:
      'No. Electromagnetic conversions depend on the CGS convention (ESU, EMU, Gaussian, etc.) and the quantity being measured.',
  },
];
