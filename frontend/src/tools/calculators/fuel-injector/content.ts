import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FUEL_INJ_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Fuel Injector Calculator' },
  { id: 'what-is-injector', label: 'What Is a Fuel Injector?' },
  { id: 'what-is-calc', label: 'What Is a Fuel Injector Calculator?' },
  { id: 'how-injection', label: 'How Does Fuel Injection Work?' },
  { id: 'bsfc', label: 'What Is BSFC?' },
  { id: 'bsfc-fuels', label: 'BSFC for Different Fuel Types' },
  { id: 'na-vs-fi', label: 'Naturally Aspirated vs. Forced Induction' },
  { id: 'how-to-find', label: 'How to Find Required Flow Rate' },
  { id: 'formula', label: 'Fuel Injector Flow Rate Formula' },
  { id: 'how-to-size', label: 'How to Calculate Injector Size' },
  { id: 'example', label: 'Worked Example' },
  { id: 'duty-cycle', label: 'What Is Injector Duty Cycle?' },
  { id: 'duty-formula', label: 'Duty Cycle Formula' },
  { id: 'fuel-pressure', label: 'What Is Fuel Pressure?' },
  { id: 'pressure-flow', label: 'How Fuel Pressure Affects Flow' },
  { id: 'turbo', label: 'Sizing for Turbocharged Engines' },
  { id: 'super', label: 'Sizing for Supercharged Engines' },
  { id: 'na', label: 'Sizing for Naturally Aspirated Engines' },
  { id: 'units', label: 'Flow Rate Units' },
  { id: 'lb-to-cc', label: 'Converting lb/hr to cc/min' },
  { id: 'v8', label: 'Estimating for a V8' },
  { id: 'four-cyl', label: 'Estimating for a Four-Cylinder' },
  { id: 'mistakes', label: 'Common Sizing Mistakes' },
  { id: 'limitations', label: 'Why Estimates Differ From Reality' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'fi-faq', label: 'Frequently Asked Questions' },
];

export const FUEL_INJ_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a fuel injector?',
    answer:
      'A fuel injector is an electronically controlled valve that meters and atomizes fuel into the intake or combustion chamber.',
  },
  {
    question: 'What does a fuel injector do?',
    answer:
      'It delivers a precise fuel mass over time so the engine management system can meet requested air–fuel ratios and power.',
  },
  {
    question: 'How does a fuel injector work?',
    answer:
      'The ECU opens the injector for a pulse width. Fuel flows under pressure through the nozzle while the valve is open.',
  },
  {
    question: 'What is a fuel injector calculator?',
    answer:
      'A planning tool that estimates required injector mass-flow from horsepower, BSFC, injector count, and duty cycle.',
  },
  {
    question: 'How do I calculate fuel injector size?',
    answer:
      'IFR = (HP × BSFC) / (N × DC), with DC as a decimal (e.g., 80% → 0.80).',
  },
  {
    question: 'What is the fuel injector sizing formula?',
    answer: 'IFR (lb/hr per injector) = (HP × BSFC) / (N × DC).',
  },
  {
    question: 'What is BSFC?',
    answer:
      'Brake-specific fuel consumption — fuel mass per unit brake horsepower per hour, typically lb/(hp·hr).',
  },
  {
    question: 'What does injector duty cycle mean?',
    answer:
      'The percentage of available time the injector is commanded open. Higher assumed DC lowers the calculated size requirement.',
  },
  {
    question: 'What is a good fuel injector duty cycle?',
    answer:
      'Many sizing examples use ~80% for headroom. Acceptable DC depends on the injector, ECU, and duty definition — not a universal rule.',
  },
  {
    question: 'How do I calculate injector duty cycle?',
    answer:
      'Required DC = (HP × BSFC) / (N × InjectorFlow). Compare against your maximum target.',
  },
  {
    question: 'How many injectors does a four-cylinder engine need?',
    answer:
      'Often one per cylinder for multiport (4). Some engines use more (staged or dual injectors).',
  },
  {
    question: 'How many injectors does a V8 engine need?',
    answer:
      'Commonly eight for one-per-cylinder multiport; override the count if your setup differs.',
  },
  {
    question: 'How do I calculate injector flow for a V8 engine?',
    answer:
      'Example: 400 hp, BSFC 0.50, 8 injectors, 80% DC → 31.25 lb/hr each.',
  },
  {
    question: 'How does horsepower affect injector size?',
    answer:
      'Required flow scales linearly with HP for a fixed BSFC, injector count, and duty cycle.',
  },
  {
    question: 'How does turbocharging affect injector requirements?',
    answer:
      'Forced induction often uses richer/more conservative BSFC assumptions and may change differential pressure across the injector.',
  },
  {
    question: 'How does supercharging affect injector requirements?',
    answer:
      'Similar to turbocharging for sizing: higher power and often richer BSFC estimates increase required flow.',
  },
  {
    question: 'How does fuel pressure affect injector flow?',
    answer:
      'For an ideal orifice model, flow scales with √(ΔP). Use differential pressure across the injector, not rail gauge alone under boost.',
  },
  {
    question: 'How do I convert lb/hr to cc/min?',
    answer:
      'Convert mass to g/min, then divide by fuel density (g/mL). Density differs by fuel — do not use one universal factor.',
  },
  {
    question: 'How do I convert cc/min to lb/hr?',
    answer:
      'Multiply volume flow by density to get mass flow, then convert grams per minute to pounds per hour.',
  },
  {
    question: 'Why is fuel density important?',
    answer:
      'Volume units (cc/min) require density; mass units (lb/hr) do not. Wrong density skews volume conversions.',
  },
  {
    question: 'What is the difference between gasoline and diesel injector sizing?',
    answer:
      'Typical BSFC and density differ. Diesel engines often show lower BSFC than gasoline SI engines at similar brake power.',
  },
  {
    question: 'How does E85 affect injector sizing?',
    answer:
      'Alcohol blends usually need more fuel mass for the same power — suggested BSFC estimates are higher than gasoline.',
  },
  {
    question: 'Can fuel injectors be too large?',
    answer:
      'Oversized injectors can make idle and part-throttle control harder if the ECU cannot resolve short pulse widths well.',
  },
  {
    question: 'What happens when fuel injectors are too small?',
    answer:
      'They may hit maximum duty cycle before target power, causing lean conditions or power limits.',
  },
  {
    question: 'How can I estimate injector size for a 300 hp engine?',
    answer:
      'With BSFC 0.50, 6 injectors, 80% DC: (300×0.50)/(6×0.8) = 31.25 lb/hr.',
  },
  {
    question: 'What injector size is needed for 500 hp?',
    answer:
      'Example with BSFC 0.60, 8 injectors, 80% DC: 46.875 lb/hr each.',
  },
  {
    question: 'What is the difference between crankshaft and wheel horsepower?',
    answer:
      'Crankshaft HP is engine output; wheel HP is after drivetrain losses. This tool sizes from crankshaft HP assumptions.',
  },
  {
    question: 'Can I use this calculator for a turbocharged engine?',
    answer:
      'Yes — select turbocharged aspiration for a suggested BSFC and review differential pressure under boost.',
  },
  {
    question: 'Why does the calculated injector size differ from manufacturer recommendations?',
    answer:
      'Manufacturers include proprietary margins, tested BSFC, and system limits. This formula is a transparent estimate only.',
  },
  {
    question: 'How accurate is a fuel injector calculator?',
    answer:
      'Accuracy tracks BSFC, HP, injector count, duty cycle, and pressure assumptions. It does not replace dyno data or OEM specs.',
  },
];
