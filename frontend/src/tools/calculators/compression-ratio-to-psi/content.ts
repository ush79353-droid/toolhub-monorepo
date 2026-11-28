import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CR_PSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Compression Ratio to PSI Calculator' },
  { id: 'what-is-cr', label: 'What Is Compression Ratio?' },
  { id: 'what-is-psi', label: 'What Is PSI?' },
  { id: 'what-is-pressure', label: 'What Is Compression Pressure?' },
  { id: 'cr-vs-pressure', label: 'Compression Ratio vs. Pressure' },
  { id: 'how-to-convert', label: 'How to Convert CR to PSI' },
  { id: 'formula', label: 'Compression Ratio to PSI Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Compression Pressure' },
  { id: 'atmospheric', label: 'What Is Atmospheric Pressure?' },
  { id: 'psia-psig', label: 'Absolute PSI vs. Gauge PSI' },
  { id: 'chart', label: 'CR to PSI Conversion Chart' },
  { id: 'dynamic-cr', label: 'What Is Dynamic Compression Ratio?' },
  { id: 'polytropic', label: 'What Is a Polytropic Model?' },
  { id: 'why-different', label: 'Why Actual PSI Differs' },
  { id: 'test-factors', label: 'What Affects a Compression Test?' },
  { id: 'petrol-diesel', label: 'Petrol vs. Diesel Compression' },
  { id: 'altitude', label: 'How Altitude Affects PSI' },
  { id: 'diagnose', label: 'Can PSI Diagnose Problems?' },
  { id: 'limitations', label: 'Why CR Is Not Exact PSI' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cr-psi-faq', label: 'Frequently Asked Questions' },
];

export const CR_PSI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is compression ratio?',
    answer:
      'Compression ratio is the dimensionless ratio of cylinder volume at bottom dead center to volume at top dead center (e.g., 10:1).',
  },
  {
    question: 'What does PSI mean?',
    answer:
      'PSI means pounds per square inch — a unit of pressure. Absolute readings use PSIA; gauge readings relative to atmosphere use PSIG.',
  },
  {
    question: 'How do I convert compression ratio to PSI?',
    answer:
      'A simplified estimate multiplies the ratio by atmospheric absolute pressure: P ≈ r × P_atm. For 10:1 at 14.7 psi, that is about 147 psia (≈132.3 psig). Real engines often read differently.',
  },
  {
    question: 'How much PSI is a 9:1 compression ratio?',
    answer:
      'Under the simplified model at 14.7 psia atmosphere: 9 × 14.7 = 132.3 psia absolute, or about 117.6 psig gauge. Treat this as educational, not a tester target.',
  },
  {
    question: 'How much PSI is a 10:1 compression ratio?',
    answer:
      'Simplified estimate at 14.7 psia: 147 psia absolute / about 132.3 psig gauge. Compression-test readings on a real engine can be lower or higher for many reasons.',
  },
  {
    question: 'How much PSI is a 12:1 compression ratio?',
    answer:
      'Simplified estimate at 14.7 psia: 176.4 psia absolute / about 161.7 psig gauge — again a linear approximation, not a warranty of measured PSI.',
  },
  {
    question: 'Can compression ratio be converted directly into PSI?',
    answer:
      'Not into an exact real-world PSI. Ratio is a volume relationship; measured cylinder pressure depends on effective compression, sealing, temperature, cranking speed, and ambient pressure.',
  },
  {
    question: 'What is the compression ratio to PSI formula?',
    answer:
      'Simplified: P_abs = r × P_atm. Gauge: P_gauge = P_abs − P_atm. Optional polytropic: P_abs = P_atm × rⁿ.',
  },
  {
    question: 'What is normal atmospheric pressure in PSI?',
    answer:
      'About 14.7 psi absolute at standard sea-level conditions. Local pressure falls with altitude and varies with weather.',
  },
  {
    question: 'What is the difference between PSIA and PSIG?',
    answer:
      'PSIA is absolute pressure including atmosphere. PSIG is gauge pressure relative to ambient (PSIG ≈ PSIA − P_atm). Compression gauges typically show PSIG.',
  },
  {
    question: 'How do I calculate gauge pressure from absolute pressure?',
    answer:
      'Subtract atmospheric absolute pressure: P_gauge = P_absolute − P_atm.',
  },
  {
    question: 'What is the difference between compression ratio and cylinder compression?',
    answer:
      'Compression ratio is geometric (volumes). Cylinder compression usually refers to the pressure measured during a cranking compression test.',
  },
  {
    question: 'Why does a compression tester measure a different PSI?',
    answer:
      'Intake valve closing timing, leakage past rings/valves, cranking RPM, temperature, throttle position, and tester design all move measured PSI away from a simple r × P_atm estimate.',
  },
  {
    question: 'Does a higher compression ratio always mean higher compression pressure?',
    answer:
      'All else equal, higher geometric CR tends to raise peak compression pressure, but effective (dynamic) compression and sealing can dominate real measurements.',
  },
  {
    question: 'How does altitude affect compression pressure?',
    answer:
      'Lower ambient absolute pressure at altitude reduces both absolute and gauge compression estimates that scale with P_atm.',
  },
  {
    question: 'How does intake valve timing affect compression PSI?',
    answer:
      'Late intake-valve closing shortens the trapped compression stroke, lowering dynamic compression ratio and often reducing measured cranking PSI.',
  },
  {
    question: 'What is a dynamic compression ratio?',
    answer:
      'An estimate of effective compression based on when the intake valve closes, rather than the full geometric BDC-to-TDC stroke.',
  },
  {
    question: 'What is a polytropic exponent?',
    answer:
      'In P₂ = P₁ × rⁿ, n characterizes heat transfer during compression. A common educational default is about 1.3; real processes vary.',
  },
  {
    question: 'How do I estimate compression pressure using a polytropic model?',
    answer:
      'Choose n, then compute P_abs = P_atm × rⁿ and P_gauge = P_abs − P_atm. Example: 10:1, 14.7 psia, n=1.3 ≈ 293 psia / ≈279 psig.',
  },
  {
    question: 'Can I calculate compression ratio from PSI?',
    answer:
      'You can invert the same models (simplified or polytropic) to get a model-implied volume ratio. That is not proof of the engine’s geometric CR.',
  },
  {
    question: 'What is a good compression ratio for a petrol engine?',
    answer:
      'It depends on fuel octane, boost, chamber design, and calibration. There is no single universal “good” CR for all petrol engines.',
  },
  {
    question: 'What is a typical compression ratio for a diesel engine?',
    answer:
      'Diesel engines often use higher geometric ratios than spark-ignition engines because they rely on compression ignition, but exact specs vary by design.',
  },
  {
    question: 'Does compression PSI indicate engine health?',
    answer:
      'Relative cylinder-to-cylinder readings and manufacturer procedures can help screen for sealing issues, but absolute PSI alone is not a complete diagnosis.',
  },
  {
    question: 'Can compression pressure be too high?',
    answer:
      'Unusually high readings can reflect carbon buildup, wrong assumptions about ambient pressure, or atypical test conditions — compare with service data for that engine.',
  },
  {
    question: 'How do piston rings affect compression-test results?',
    answer:
      'Worn or poorly seated rings leak compressed charge, typically lowering cranking compression PSI.',
  },
  {
    question: 'Does engine temperature affect compression-test PSI?',
    answer:
      'Yes. Temperature changes sealing, clearances, and gas density; procedures often specify warm or cold testing consistently.',
  },
  {
    question: 'Does cranking speed affect compression PSI?',
    answer:
      'Slower cranking leaves more time for leakage and can reduce measured peak pressure. Battery and starter condition matter.',
  },
  {
    question: 'What is the difference between a compression test and a leak-down test?',
    answer:
      'A compression test measures peak cranking pressure. A leak-down test pressurizes a cylinder at rest and measures leakage percentage and path (rings, valves, head gasket).',
  },
];
