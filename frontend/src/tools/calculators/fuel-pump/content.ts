import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FUEL_PUMP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Fuel Pump Calculator' },
  { id: 'what-is-pump', label: 'What Is a Fuel Pump?' },
  { id: 'what-is-calc', label: 'What Is a Fuel Pump Calculator?' },
  { id: 'how-works', label: 'How Does a Fuel Pump Work?' },
  { id: 'flow-explained', label: 'Fuel Pump Flow Rate Explained' },
  { id: 'how-to-calc', label: 'How to Calculate Fuel Pump Flow Rate' },
  { id: 'bsfc', label: 'What Is BSFC?' },
  { id: 'na', label: 'Requirements for Naturally Aspirated Engines' },
  { id: 'turbo', label: 'Requirements for Turbocharged Engines' },
  { id: 'super', label: 'Requirements for Supercharged Engines' },
  { id: 'gas-diesel', label: 'Gasoline vs. Diesel Requirements' },
  { id: 'fuel-type', label: 'How Fuel Type Affects Required Flow' },
  { id: 'base-pressure', label: 'Understanding Base Fuel Pressure' },
  { id: 'boost-pressure', label: 'How Boost Affects Fuel Pressure' },
  { id: 'return', label: 'Return vs. Returnless Fuel Systems' },
  { id: 'choose', label: 'How to Choose a Fuel Pump' },
  { id: 'vs-pressure', label: 'Flow Rate vs. Operating Pressure' },
  { id: 'example', label: 'Fuel Pump Sizing Example' },
  { id: 'convert', label: 'Converting L/hr to Gallons per Hour' },
  { id: 'margin', label: 'Fuel Pump Capacity Safety Margins' },
  { id: 'mistakes', label: 'Common Fuel Pump Sizing Mistakes' },
  { id: 'limitations', label: 'Fuel Pump Calculator Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'fp-faq', label: 'Frequently Asked Questions' },
];

export const FUEL_PUMP_FAQS: readonly FAQItem[] = [
  {
    question: 'What does a fuel pump do?',
    answer:
      'It moves fuel from the tank to the rail or injectors at the pressure and flow the engine management system needs.',
  },
  {
    question: 'How does a fuel pump work?',
    answer:
      'An electric or mechanical pump raises fuel pressure and delivers volume against system resistance. Delivered flow usually falls as outlet pressure rises.',
  },
  {
    question: 'What is a fuel pump calculator?',
    answer:
      'A planning tool that estimates engine fuel demand from horsepower and BSFC, plus rail/outlet pressure from your pressure-control assumptions.',
  },
  {
    question: 'How do I calculate fuel pump flow rate?',
    answer:
      'Fuel mass flow = HP × BSFC. Volume flow = mass / density. In L/hr: Q = (HP × BSFC × 0.45359237) / ρ_kg/L.',
  },
  {
    question: 'What is the formula for fuel pump flow?',
    answer:
      'Q_L/hr = (HP × BSFC × 0.45359237) / ρ, with BSFC in lb/(hp·hr) and density in kg/L.',
  },
  {
    question: 'How much fuel flow does a 300 hp engine need?',
    answer:
      'At BSFC 0.50 and density 0.745 kg/L: about 91.33 L/hr of estimated demand — not a free-flow pump rating.',
  },
  {
    question: 'How much fuel flow does a 500 hp engine need?',
    answer:
      'At BSFC 0.60 and density 0.745 kg/L: about 182.65 L/hr estimated demand.',
  },
  {
    question: 'What is BSFC?',
    answer:
      'Brake-specific fuel consumption — fuel mass per unit brake horsepower per hour (lb/(hp·hr) here).',
  },
  {
    question: 'What is a typical BSFC for gasoline engines?',
    answer:
      'Sizing estimates often start near 0.50 lb/(hp·hr) for NA gasoline and somewhat higher for forced induction — still estimates, not maps.',
  },
  {
    question: 'How does turbocharging affect fuel pump requirements?',
    answer:
      'Higher power and often richer BSFC estimates raise demand; boost may raise rail pressure on 1:1 referenced systems.',
  },
  {
    question: 'How does supercharging affect fuel pump requirements?',
    answer:
      'Similar to turbocharging for planning: more power and often higher BSFC assumptions increase required flow.',
  },
  {
    question: 'How does E85 affect fuel pump sizing?',
    answer:
      'Alcohol blends typically need more fuel mass for the same power — suggested BSFC estimates are higher than gasoline.',
  },
  {
    question: 'What is fuel pump flow rate?',
    answer:
      'Volume (or mass) of fuel delivered per unit time. Engine demand and pump delivery at a given pressure are different quantities.',
  },
  {
    question: 'What is base fuel pressure?',
    answer:
      'The system’s nominal gauge pressure reference used with your pressure-control mode.',
  },
  {
    question: 'What is boost pressure?',
    answer:
      'Manifold gauge boost. In a manifold-referenced 1:1 regulator, rail gauge pressure rises approximately with boost.',
  },
  {
    question: 'How does boost affect fuel-rail pressure?',
    answer:
      'Referenced 1:1: P_rail ≈ P_base + P_boost. Fixed rail: P_rail stays ≈ P_base while injector ΔP changes.',
  },
  {
    question: 'What is a return fuel system?',
    answer:
      'A system that returns unused fuel to the tank, often with a mechanical regulator that can be manifold-referenced.',
  },
  {
    question: 'What is a returnless fuel system?',
    answer:
      'A system without a continuous return line; pressure is often fixed or electronically controlled at the tank/module.',
  },
  {
    question: 'What is the difference between fuel-rail pressure and pump outlet pressure?',
    answer:
      'Rail pressure is at the rail. Pump outlet may be higher to overcome filter and line losses.',
  },
  {
    question: 'How do I convert L/hr to US gal/hr?',
    answer: 'Divide by 3.785411784 (US gallons).',
  },
  {
    question: 'How do I convert psi to bar?',
    answer: '1 psi ≈ 0.0689475729 bar (or multiply psi by 6.894757… for kPa).',
  },
  {
    question: 'What is a good fuel pump capacity margin?',
    answer:
      'Margins are design choices (often tens of percent). This tool defaults to 0% and only applies a margin you enter.',
  },
  {
    question: 'Can a fuel pump be too small?',
    answer:
      'Yes — if delivery at operating pressure is below demand, the system can go lean or lose pressure under load.',
  },
  {
    question: 'Can a fuel pump be too large?',
    answer:
      'Oversizing can raise heat, noise, or control challenges depending on the system — especially without proper regulation.',
  },
  {
    question: 'Why does fuel pump flow decrease at higher pressure?',
    answer:
      'The pump works against higher head; manufacturer curves show lower volume at higher outlet pressure.',
  },
  {
    question: 'How do I know whether my fuel pump is sufficient?',
    answer:
      'Compare demand (plus optional margin) to the manufacturer’s flow at your estimated outlet pressure — not free-flow alone.',
  },
  {
    question: 'Why is fuel density important?',
    answer:
      'Mass flow from BSFC must be converted to volume using density. Different fuels have different densities.',
  },
  {
    question: 'Can I calculate fuel pump flow using horsepower?',
    answer:
      'Yes, with a BSFC assumption: mass flow = HP × BSFC, then divide by density for volume.',
  },
  {
    question: 'Does the number of injectors determine fuel pump flow?',
    answer:
      'Pump demand is primarily total engine fuel mass flow. Injector count sizes injectors, not the pump’s total fuel requirement.',
  },
  {
    question: 'How accurate is a fuel pump calculator?',
    answer:
      'Accuracy tracks BSFC, density, pressure mode, and losses. It does not replace OEM pump curves or dyno validation.',
  },
];
