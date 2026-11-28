import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FLIGHT_RAD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Flight Radiation Calculator' },
  { id: 'what-is', label: 'What Is Flight Radiation?' },
  { id: 'why-increases', label: 'Why Exposure Increases During Flights' },
  { id: 'how-to-calculate', label: 'How to Calculate Flight Radiation' },
  { id: 'formula', label: 'Flight Radiation Formula' },
  { id: 'dose-rate', label: 'What Is a Radiation Dose Rate?' },
  { id: 'microsievert', label: 'What Is a Microsievert?' },
  { id: 'millisievert', label: 'What Is a Millisievert?' },
  { id: 'how-much', label: 'How Much Radiation During a Flight?' },
  { id: 'short-flights', label: 'Radiation on Short Flights' },
  { id: 'long-haul', label: 'Radiation on Long-Haul Flights' },
  { id: 'altitude', label: 'Does Altitude Affect Exposure?' },
  { id: 'latitude', label: 'Does Latitude Affect Exposure?' },
  { id: 'solar', label: 'Does Solar Activity Affect Exposure?' },
  { id: 'frequent', label: 'Radiation for Frequent Flyers' },
  { id: 'crew', label: 'Radiation for Pilots and Cabin Crew' },
  { id: 'medical', label: 'Cosmic vs. Medical Radiation' },
  { id: 'pregnancy', label: 'Flying During Pregnancy' },
  { id: 'accuracy', label: 'How Accurate Is This Calculator?' },
  { id: 'limitations', label: 'Limitations of Flight Radiation Estimates' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'fr-faq', label: 'Frequently Asked Questions' },
];

export const FLIGHT_RAD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is flight radiation?',
    answer:
      'Flight radiation usually means cosmic ionizing radiation encountered at aircraft altitudes. The atmosphere shields less at cruise height than at ground level.',
  },
  {
    question: 'How much radiation do you receive on a flight?',
    answer:
      'There is no single answer for every flight. Dose depends on duration, altitude, latitude, route, and solar conditions. This tool estimates Dose = Dose rate × Time under a stated average rate.',
  },
  {
    question: 'How do I calculate radiation exposure during a flight?',
    answer:
      'Multiply an assumed average dose rate by flight time in matching units. Example: 0.003 mSv/h × 8 h = 0.024 mSv.',
  },
  {
    question: 'What is the flight radiation formula?',
    answer: 'Dose = Dose Rate × Flight Time (optionally × number of identical flights).',
  },
  {
    question: 'Why is radiation exposure higher at cruising altitude?',
    answer:
      'Less atmosphere sits above the aircraft, so cosmic radiation is less attenuated than at sea level.',
  },
  {
    question: 'Does flight duration affect radiation exposure?',
    answer:
      'Yes. For a constant average rate, longer flights accumulate proportionally more dose.',
  },
  {
    question: 'Does flight altitude affect cosmic radiation?',
    answer:
      'Generally yes — higher cruise altitudes tend to increase exposure. This calculator does not invent an altitude formula; enter a rate appropriate to your scenario.',
  },
  {
    question: 'Does geographic latitude affect radiation exposure?',
    answer:
      'Often yes. Geomagnetic shielding is typically weaker near the poles than near the equator, so polar routes can see higher rates for similar altitudes.',
  },
  {
    question: 'What is cosmic radiation?',
    answer:
      'High-energy particles from space and the Sun that interact with the atmosphere, producing secondary radiation relevant to aviation exposure.',
  },
  {
    question: 'What is a radiation dose rate?',
    answer:
      'Dose received per unit time (for example µSv/h or mSv/h). An average cruise rate simplifies a flight that actually varies along the route.',
  },
  {
    question: 'What is a microsievert?',
    answer:
      'A microsievert (µSv) is one-millionth of a sievert, a unit of equivalent/effective dose used in radiation protection.',
  },
  {
    question: 'What is a millisievert?',
    answer:
      'A millisievert (mSv) equals 1,000 µSv. Annual background and occupational guidance are often discussed in mSv.',
  },
  {
    question: 'How many microsieverts are in one millisievert?',
    answer: '1 mSv = 1,000 µSv.',
  },
  {
    question: 'How much radiation is received during a three-hour flight?',
    answer:
      'Using the illustrative default 0.003 mSv/h: 0.003 × 3 = 0.009 mSv (9 µSv). Replace the rate if you have a better estimate.',
  },
  {
    question: 'How much radiation is received during an eight-hour flight?',
    answer:
      'At 0.003 mSv/h: 0.024 mSv (24 µSv). This is an estimate under that assumption only.',
  },
  {
    question: 'How much radiation is received during a twelve-hour flight?',
    answer:
      'At 0.003 mSv/h: 0.036 mSv (36 µSv). Long-haul routes may differ substantially from this average.',
  },
  {
    question: 'Is radiation exposure higher on long-haul flights?',
    answer:
      'Longer duration usually increases total dose, and many long-haul routes also fly at high altitudes and higher latitudes. Duration alone does not determine the rate.',
  },
  {
    question: 'Does flying frequently increase cumulative radiation exposure?',
    answer:
      'Yes — cumulative dose rises with more flying hours at a given average rate. Individual risk assessment belongs with qualified professionals and applicable guidance.',
  },
  {
    question: 'How does radiation affect airline pilots?',
    answer:
      'Flight crew are often treated as occupationally exposed workers in many jurisdictions, with monitoring frameworks from aviation and radiation authorities. This calculator is educational, not compliance software.',
  },
  {
    question: 'How does radiation affect cabin crew?',
    answer:
      'Cabin crew share similar altitude exposure patterns as pilots on the same routes. Occupational programs, where required, track cumulative exposure over time.',
  },
  {
    question: 'Is radiation exposure during pregnancy a consideration?',
    answer:
      'Aviation and public-health agencies publish guidance for air travel and pregnancy. This tool cannot personalize medical advice — consult a qualified clinician and relevant aviation guidance.',
  },
  {
    question: 'Does solar activity affect flight radiation?',
    answer:
      'Yes. Solar particle events and the solar cycle can change cosmic radiation levels, especially at high latitudes and altitudes.',
  },
  {
    question: 'Are polar flights exposed to different radiation levels?',
    answer:
      'Polar and near-polar routes often experience higher cosmic radiation rates than comparable equatorial flights because of weaker geomagnetic shielding.',
  },
  {
    question: 'Can a calculator predict exact radiation exposure on a flight?',
    answer:
      'No. A constant-rate model cannot replace validated route-specific codes, onboard measurements, or airline dosimetry programs.',
  },
  {
    question: 'What factors affect flight radiation dose?',
    answer:
      'Duration, altitude, latitude/route, solar activity, geomagnetic conditions, and aircraft operations that change time at altitude.',
  },
  {
    question: 'What is the difference between absorbed dose and effective dose?',
    answer:
      'Absorbed dose (gray, Gy) measures energy deposited. Effective dose (sievert, Sv) weights radiation type and tissue sensitivity for radiation-protection comparisons.',
  },
  {
    question: 'How does flight radiation compare with natural background radiation?',
    answer:
      'Natural background typically accumulates continuously at ground level; a single flight adds a short-duration increment. Compare only with stated periods and sources — avoid unqualified “safe/unsafe” claims.',
  },
  {
    question: 'Can flight radiation be measured?',
    answer:
      'Yes, with specialized instruments and with computational models used by aviation authorities. Passenger apps and simple calculators are estimates.',
  },
  {
    question: 'What units are used to measure flight radiation exposure?',
    answer:
      'Sieverts and subunits (µSv, mSv) for equivalent/effective dose; rem/mrem in some older U.S. contexts (1 rem = 10 mSv).',
  },
  {
    question: 'How accurate is the flight radiation calculator?',
    answer:
      'It is only as accurate as the dose-rate assumption you enter. Default 0.003 mSv/h is illustrative. For operational or medical decisions, use validated models and professional guidance.',
  },
];
