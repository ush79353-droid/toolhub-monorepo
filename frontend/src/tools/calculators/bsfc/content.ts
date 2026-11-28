import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BSFC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BSFC Calculator' },
  { id: 'what-is', label: 'What Is BSFC?' },
  { id: 'what-measures', label: 'What Does BSFC Measure?' },
  { id: 'how-to-calculate', label: 'How to Calculate BSFC' },
  { id: 'formula', label: 'BSFC Formula' },
  { id: 'efficiency-from-bsfc', label: 'Efficiency from BSFC' },
  { id: 'bsfc-and-bte', label: 'BSFC and Brake Thermal Efficiency' },
  { id: 'fuel-type', label: 'How Fuel Type Affects Results' },
  { id: 'gasoline', label: 'BSFC for Gasoline Engines' },
  { id: 'diesel', label: 'BSFC for Diesel Engines' },
  { id: 'bsfc-vs-sfc', label: 'BSFC vs. Specific Fuel Consumption' },
  { id: 'load', label: 'How Engine Load Affects BSFC' },
  { id: 'rpm', label: 'BSFC and Engine RPM' },
  { id: 'improve', label: 'How to Improve Fuel Efficiency' },
  { id: 'limitations', label: 'Limitations of BSFC Calculations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bsfc-faq', label: 'Frequently Asked Questions' },
];

export const BSFC_FAQS: readonly FAQItem[] = [
  {
    question: 'What is BSFC?',
    answer:
      'Brake specific fuel consumption is the mass of fuel used per unit of brake (shaft) power over time — commonly reported in g/(kW·h).',
  },
  {
    question: 'What does brake specific fuel consumption mean?',
    answer:
      'It links fuel mass flow to useful mechanical power at the crankshaft or output shaft, independent of engine size when expressed per kilowatt.',
  },
  {
    question: 'How is BSFC calculated?',
    answer:
      'BSFC = ṁ_f / P_b. With mass flow in g/h and power in kW, BSFC is in g/(kW·h).',
  },
  {
    question: 'What is a good BSFC value?',
    answer:
      'Lower is generally better for a given fuel and comparable test conditions. Typical ranges differ for gasoline and diesel engines; treat published maps as context, not guarantees.',
  },
  {
    question: 'Is lower BSFC better?',
    answer:
      'Yes for fuel mass per unit brake power, when comparing like fuels and operating points. Heating value still matters for thermal efficiency.',
  },
  {
    question: 'What is the difference between BSFC and fuel efficiency?',
    answer:
      'BSFC is a specific mass-rate metric. Vehicle fuel economy (mpg, L/100 km) also includes drivetrain, load, and driving cycle effects.',
  },
  {
    question: 'How do you calculate engine efficiency from BSFC?',
    answer:
      'With BSFC in g/(kW·h) and LHV in MJ/kg: η_b(%) = 360000 / (BSFC × LHV). Example: 250 × 43.4 → ≈33.18%.',
  },
  {
    question: 'What is brake thermal efficiency?',
    answer:
      'The fraction of fuel chemical energy (usually LHV basis) converted into useful brake power.',
  },
  {
    question: 'What is the formula for BSFC?',
    answer: 'BSFC = ṁ_f / P_b, where ṁ_f is fuel mass flow and P_b is brake power.',
  },
  {
    question: 'What units are used for BSFC?',
    answer:
      'Common units include g/(kW·h), kg/(kW·h), lb/(hp·h), and g/(hp·h). This calculator converts among them.',
  },
  {
    question: 'How do you convert BSFC from g/kWh to lb/hp·h?',
    answer:
      'Multiply g/(kW·h) by ≈0.001644 to get lb/(hp·h). Example: 250 g/kWh ≈ 0.411 lb/(hp·h).',
  },
  {
    question: 'What is typical BSFC for a gasoline engine?',
    answer:
      'Many spark-ignition maps show best points often in a few hundred g/(kW·h) range depending on load and calibration — always use measured data for design.',
  },
  {
    question: 'What is typical BSFC for a diesel engine?',
    answer:
      'Compression-ignition engines often achieve lower BSFC than comparable gasoline engines at similar power, partly due to higher compression and lean operation, but values vary widely.',
  },
  {
    question: 'Does RPM affect BSFC?',
    answer:
      'Yes. Friction, pumping, and combustion timing change with speed, so BSFC maps are functions of speed and load.',
  },
  {
    question: 'Does engine load affect BSFC?',
    answer:
      'Yes. Part-load throttling losses (especially in gasoline engines) often raise BSFC compared with peak-efficiency islands.',
  },
  {
    question: 'Does fuel type affect BSFC?',
    answer:
      'Heating value and combustion characteristics differ. Efficiency from BSFC uses LHV; the same BSFC implies different η for different fuels.',
  },
  {
    question: 'How do you calculate fuel consumption from BSFC?',
    answer:
      'ṁ_f = BSFC × P. With BSFC in g/(kW·h) and P in kW, mass flow is g/h (divide by 1000 for kg/h).',
  },
  {
    question: 'Can BSFC be used to calculate horsepower?',
    answer:
      'If fuel mass flow and BSFC are known: P = ṁ_f / BSFC (consistent units). Use Required engine power mode.',
  },
  {
    question: 'What is the difference between brake power and indicated power?',
    answer:
      'Indicated power is from cylinder pressures; brake power is at the shaft after friction and accessory losses. BSFC uses brake power.',
  },
  {
    question: 'What is the difference between BSFC and SFC?',
    answer:
      'SFC is a general “specific fuel consumption” label. BSFC specifically uses brake power; ISFC uses indicated power.',
  },
  {
    question: 'Why does a diesel engine often have lower BSFC?',
    answer:
      'Higher compression ratios, lean burn, and typically higher thermal efficiency can reduce fuel mass per kilowatt-hour versus many gasoline engines.',
  },
  {
    question: 'What is the relationship between BSFC and fuel heating value?',
    answer:
      'For fixed LHV, efficiency and BSFC are inversely related: η% = 360000 / (BSFC × LHV).',
  },
  {
    question: 'What is a BSFC map?',
    answer:
      'A contour plot of BSFC versus engine speed and load (or torque), used to find efficient operating regions.',
  },
  {
    question: 'Why is BSFC important in engine design?',
    answer:
      'It helps compare fuel use at useful power levels, size fuel systems, and evaluate calibration changes.',
  },
  {
    question: 'How accurate is a BSFC calculator?',
    answer:
      'Formulas are exact for the inputs you provide. Real engines need measured BSFC/LHV; this tool is educational, not a dyno substitute.',
  },
];
