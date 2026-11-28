import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BOAT_SPEED_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Boat Speed Calculator' },
  { id: 'what-is-boat-speed', label: 'What Is Boat Speed?' },
  { id: 'how-calculator-works', label: 'How Does This Calculator Work?' },
  { id: 'crouch-formula', label: "What Is Crouch's Formula?" },
  { id: 'shaft-hp', label: 'What Is Shaft Horsepower?' },
  { id: 'displacement', label: 'What Is Boat Displacement?' },
  { id: 'crouch-constant', label: "What Is the Crouch Constant?" },
  { id: 'boat-types', label: 'Crouch Constants by Boat Type' },
  { id: 'how-to-calculate', label: 'How to Calculate Boat Speed' },
  { id: 'example', label: 'Boat Speed Calculation Example' },
  { id: 'required-hp', label: 'Required Boat Horsepower' },
  { id: 'calc-displacement', label: 'Calculate Boat Displacement' },
  { id: 'knots-vs-mph', label: 'Knots vs. MPH' },
  { id: 'what-affects', label: "What Affects a Boat's Top Speed?" },
  { id: 'doubling-hp', label: 'Does Doubling Horsepower Double Speed?' },
  { id: 'limitations', label: "Limitations of Crouch's Formula" },
  { id: 'related', label: 'Related Calculators' },
  { id: 'boat-speed-faq', label: 'Frequently Asked Questions' },
];

export const BOAT_SPEED_FAQS: readonly FAQItem[] = [
  {
    question: 'How do you calculate boat speed?',
    answer:
      "Using Crouch's formula: S = C × √(P / D), with speed in mph, power in mechanical horsepower, and displacement in pounds. Convert other units first.",
  },
  {
    question: "What is Crouch's formula?",
    answer:
      'An empirical planing-hull performance estimate relating shaft horsepower, displacement, and a hull-type coefficient (Crouch constant) to estimated speed.',
  },
  {
    question: "What is Crouch's constant?",
    answer:
      'An empirical coefficient C that absorbs hull form and related effects when power and displacement are expressed in the formula’s reference units (mph, hp, lb).',
  },
  {
    question: 'How do I calculate boat speed from horsepower?',
    answer:
      'Convert power to mechanical hp and displacement to pounds, choose C for your boat class, then compute S = C × √(P / D).',
  },
  {
    question: 'How does displacement affect boat speed?',
    answer:
      'Under Crouch’s formula, higher displacement lowers estimated speed roughly with 1/√D when power and C are fixed.',
  },
  {
    question: 'What is shaft horsepower?',
    answer:
      'Power delivered at the propeller shaft after gearbox and driveline losses. It is often less than advertised engine crankshaft horsepower.',
  },
  {
    question: 'How do you calculate required boat horsepower?',
    answer:
      'Rearrange the formula: P = D × (S / C)² with S in mph, D in pounds, and C the Crouch constant.',
  },
  {
    question: 'How do you calculate boat displacement?',
    answer:
      'From measured speed and power: D = P / (S / C)² using the same reference units.',
  },
  {
    question: 'What is the difference between mph and knots?',
    answer:
      'A knot is one nautical mile per hour. 1 mph ≈ 0.8690 knots; 1 knot ≈ 1.1508 mph.',
  },
  {
    question: 'How many knots are in 100 mph?',
    answer: 'About 86.90 knots (100 × 0.86897624).',
  },
  {
    question: 'Does more horsepower always increase boat speed?',
    answer:
      'In the Crouch model, yes for higher P with fixed D and C, but real boats also face hull limits, ventilation, propeller match, and drag that the formula does not capture.',
  },
  {
    question: 'Does doubling horsepower double boat speed?',
    answer:
      'No. Speed scales with √P, so doubling power multiplies estimated speed by √2 ≈ 1.41 if D and C are unchanged.',
  },
  {
    question: 'What is a good Crouch constant?',
    answer:
      'It depends on hull type. Illustrative values range from about 150 for average cruisers/runabouts to 220–230 for hydroplanes and racing catamarans.',
  },
  {
    question: "Can I use Crouch's formula for any boat?",
    answer:
      'It is best suited to comparable planing craft. Displacement hulls, heavily loaded boats, and unusual designs may need different methods.',
  },
  {
    question: 'What is the Crouch constant for a racing boat?',
    answer: 'This calculator’s illustrative racing-boat category uses C ≈ 210.',
  },
  {
    question: 'What is the Crouch constant for a runabout?',
    answer:
      'Average runabouts/cruisers are illustrated near C ≈ 150; light high-speed runabouts near C ≈ 190.',
  },
  {
    question: 'What is the Crouch constant for a hydroplane?',
    answer: 'The illustrative hydroplane category uses C ≈ 220.',
  },
  {
    question: 'How does boat weight affect speed?',
    answer:
      'Greater operating weight (displacement) reduces estimated Crouch speed for a given power, roughly with the square root of the power-to-weight ratio.',
  },
  {
    question: 'How accurate is a boat speed calculator?',
    answer:
      'It is an empirical estimate. Propeller efficiency, sea state, wind, trim, and hull fouling can make measured speed differ substantially.',
  },
  {
    question: 'What factors affect maximum boat speed?',
    answer:
      'Hull design, propulsion efficiency, power, displacement, water and wind conditions, drag, loading, and driveline losses.',
  },
  {
    question: 'What is the difference between engine horsepower and shaft horsepower?',
    answer:
      'Engine (crankshaft) ratings are measured at the engine; shaft horsepower is what remains at the shaft after transmission and related losses.',
  },
  {
    question: 'Why is my actual boat speed lower than the estimate?',
    answer:
      'Optimistic C, using crankshaft instead of shaft power, extra load, poor propeller match, or sea conditions can all reduce real-world speed.',
  },
  {
    question: 'Can I estimate speed using kilowatts?',
    answer:
      'Yes. Convert kW to mechanical horsepower first (1 hp ≈ 0.7457 kW), then apply Crouch’s formula.',
  },
  {
    question: 'How do I convert boat speed to km/h?',
    answer: 'Multiply mph by 1.609344. Example: 100 mph ≈ 160.93 km/h.',
  },
  {
    question: 'How do I calculate the Crouch constant from measured speed?',
    answer:
      'C = S × √(D / P) with S in mph, D in pounds, and P in mechanical hp.',
  },
];
