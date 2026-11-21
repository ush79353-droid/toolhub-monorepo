import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ENERGY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-energy-conversion', label: 'What Is Energy Conversion?' },
  { id: 'joules-kcal', label: 'Joules to kcal and kcal to Joules' },
  { id: 'joules-kwh', label: 'Joules to kWh and kWh to Joules' },
  { id: 'joules-ev', label: 'Joules to eV and eV to Joules' },
  { id: 'tnt-therms', label: 'Tons of TNT and Therms to Joules' },
  { id: 'mass-to-energy', label: 'Mass to Energy Conversion' },
  { id: 'temperature-to-energy', label: 'Temperature to Energy Conversion' },
  { id: 'length-to-energy', label: 'Length to Energy Conversion' },
  { id: 'conversion-table', label: 'Energy Conversion Table' },
  { id: 'energy-conversion-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const ENERGY_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-energy-conversion',
    title: 'What Is Energy Conversion?',
    paragraphs: [
      'In physics, energy is the capacity to do work or transfer heat. The SI unit of energy is the joule (J). One joule equals one newton-metre: the work done by a force of one newton acting through one metre in the force’s direction.',
      'Different industries still use legacy units; kilocalories in nutrition, kilowatt-hours on electricity bills, electronvolts in particle physics, and TNT equivalents for large energy releases. Converting everything through joules keeps results consistent.',
      'Energy measures an amount; power measures how quickly energy is transferred (watts = joules per second). This calculator converts energy quantities, not power.',
    ],
    formula: '1 J = 1 N·m',
  },
  {
    id: 'joules-kcal',
    title: 'Joules to kcal and kcal to Joules Conversion',
    paragraphs: [
      'A thermochemical calorie (cal) equals 4.184 J. A food Calorie (written with a capital C, or as kilocalorie (kcal)) equals 4184 J. This calculator’s Calories (kcal) field uses the food-kilocalorie definition.',
      'Joules to kilocalories: kcal = J ÷ 4184. Example: 4184 J = 1 kcal.',
      'Kilocalories to joules: J = kcal × 4184. Example: 250 kcal = 1,046,000 J.',
    ],
    formula: '1 kcal = 4184 J · kcal = J ÷ 4184 · J = kcal × 4184',
  },
  {
    id: 'joules-kwh',
    title: 'Joules to kWh and kWh to Joules Conversion',
    paragraphs: [
      'Electrical energy is commonly billed in kilowatt-hours. One watt-hour is 3600 J, so one kilowatt-hour is 3,600,000 J (3.6 MJ).',
      'Joules to kWh: kWh = J ÷ 3,600,000. kWh to joules: J = kWh × 3,600,000.',
      'Examples: 1 kWh = 3.6 MJ; 2.5 kWh = 9,000,000 J. Utilities use kWh because household energy use is large when expressed only in joules.',
    ],
    formula: '1 kWh = 3,600,000 J · kWh = J ÷ 3,600,000',
  },
  {
    id: 'joules-ev',
    title: 'Joules to eV and eV to Joules Conversion',
    paragraphs: [
      'An electronvolt (eV) is the kinetic energy gained by a particle with elementary charge e when accelerated through a potential difference of one volt. It is an energy unit, not a voltage unit.',
      'By SI definition, 1 eV = 1.602176634 × 10⁻¹⁹ J exactly. Electronvolts and their multiples (keV, MeV, GeV) are standard in atomic, semiconductor, and particle physics.',
      'Example: 10 eV = 1.602176634 × 10⁻¹⁸ J.',
    ],
    formula: '1 eV = 1.602176634 × 10⁻¹⁹ J',
  },
  {
    id: 'tnt-therms',
    title: 'Tons of TNT and Therms to Joules',
    paragraphs: [
      'TNT equivalents describe large energy releases using a conventional conversion, not a precise chemistry measurement of every explosion: 1 ton TNT = 4.184 × 10⁹ J; 1 kiloton TNT = 4.184 × 10¹² J; 1 megaton TNT = 4.184 × 10¹⁵ J.',
      'A therm is a commercial energy unit often used for natural gas. This calculator uses the US therm ≈ 105.506 MJ (exactly 105,505,585.257348 J). A therm measures energy, not gas volume.',
    ],
    formula: '1 ton TNT = 4.184×10⁹ J · 1 US therm ≈ 105.506 MJ',
  },
  {
    id: 'mass-to-energy',
    title: 'Mass to Energy Conversion',
    paragraphs: [
      'Einstein’s mass–energy equivalence relates rest mass to energy: E = mc², where c = 299,792,458 m/s.',
      'For 1 gram (0.001 kg): E = 0.001 × (299792458)² ≈ 8.98755 × 10¹³ J. That is the rest-energy equivalent of the mass; not the energy released by chemically burning one gram of material.',
      'This section is educational; the calculator itself converts energy units through joules and does not take mass as an input.',
    ],
    formula: 'E = mc² · c = 299,792,458 m/s',
  },
  {
    id: 'temperature-to-energy',
    title: 'Temperature to Energy Conversion',
    paragraphs: [
      'A characteristic microscopic thermal energy scale is E = k_B T, where T is absolute temperature in kelvin and k_B = 1.380649 × 10⁻²³ J/K (SI exact).',
      'Temperature is not the same physical quantity as the total internal energy of a macroscopic object. k_B T describes a typical energy scale per degree of freedom, not the complete heat content of an arbitrary system.',
    ],
    formula: 'E = k_B T · k_B = 1.380649 × 10⁻²³ J/K',
  },
  {
    id: 'length-to-energy',
    title: 'Length to Energy Conversion',
    paragraphs: [
      'A photon’s energy relates to its vacuum wavelength by E = hc / λ, where h = 6.62607015 × 10⁻³⁴ J·s and c is the speed of light.',
      'For green light near λ = 550 nm: E ≈ hc / 5.5×10⁻⁷ ≈ 3.61 × 10⁻¹⁹ J ≈ 2.25 eV. This converts photon wavelength to photon energy; it is not a general conversion from arbitrary length into energy.',
    ],
    formula: 'E = hc / λ · h = 6.62607015 × 10⁻³⁴ J·s',
  },
  {
    id: 'conversion-table',
    title: 'Energy Conversion Table',
    paragraphs: [
      'Selected units and their joule factors. Hartree and Rydberg use CODATA 2018 recommended values. Therm is the US therm; BTU is the International Table (IT) definition.',
    ],
    tableHeaders: ['Unit', 'Symbol', 'Joules per Unit'],
    table: [
      ['Joule', 'J', '1'],
      ['Kilojoule', 'kJ', '1,000'],
      ['Megajoule', 'MJ', '1,000,000'],
      ['Gigajoule', 'GJ', '1,000,000,000'],
      ['Calorie (thermochemical)', 'cal', '4.184'],
      ['Kilocalorie', 'kcal', '4,184'],
      ['Watt-hour', 'Wh', '3,600'],
      ['Kilowatt-hour', 'kWh', '3,600,000'],
      ['Electronvolt', 'eV', '1.602176634 × 10⁻¹⁹'],
      ['Erg', 'erg', '10⁻⁷'],
      ['Ton of TNT', 'ton TNT', '4.184 × 10⁹'],
      ['Megaton of TNT', 'Mt TNT', '4.184 × 10¹⁵'],
      ['Therm (US)', 'thm', '105,505,585.257348'],
      ['BTU (IT)', 'BTU', '1,055.05585262'],
      ['Hartree (CODATA 2018)', 'Eh', '4.3597447222071 × 10⁻¹⁸'],
      ['Rydberg (CODATA 2018)', 'Ry', '2.1798723611035 × 10⁻¹⁸'],
    ],
  },
];

export const ENERGY_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is the SI Unit of Energy?',
    answer: 'The SI unit of energy is the joule, represented by J.',
  },
  {
    question: 'How Many Joules Are in One Calorie?',
    answer: 'One thermochemical calorie equals 4.184 joules.',
  },
  {
    question: 'How Many Joules Are in One Kilocalorie?',
    answer: 'One kilocalorie equals 4184 joules.',
  },
  {
    question: 'How Many Joules Are in One kWh?',
    answer: 'One kilowatt-hour equals 3,600,000 joules.',
  },
  {
    question: 'How Do I Convert Joules to kWh?',
    answer: 'Divide the joule value by 3,600,000.',
  },
  {
    question: 'What Is the Difference Between Energy and Power?',
    answer:
      'Energy measures the amount of work or energy transferred. Power measures the rate at which energy is transferred.',
  },
  {
    question: 'What Is an Electronvolt?',
    answer:
      'An electronvolt is the energy gained by a particle with one elementary positive charge when moving through an electric potential difference of one volt.',
  },
  {
    question: 'How Many Joules Are in One Electronvolt?',
    answer: 'One electronvolt equals exactly 1.602176634 × 10⁻¹⁹ joules.',
  },
  {
    question: 'How Much Energy Is One Ton of TNT?',
    answer: 'One ton of TNT is conventionally defined as 4.184 × 10⁹ joules.',
  },
  {
    question: 'Can Energy Be Negative?',
    answer:
      'Yes. Signed energy values can occur depending on the reference state, energy change, or physical model.',
  },
];
