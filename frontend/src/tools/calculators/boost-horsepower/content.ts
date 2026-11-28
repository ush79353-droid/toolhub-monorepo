import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BOOST_HP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Boost Horsepower Calculator' },
  { id: 'what-is', label: 'What Is a Boost Horsepower Calculator?' },
  { id: 'supercharger', label: 'How Does a Supercharger Work?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'formula', label: 'Boost Horsepower Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Boosted HP' },
  { id: 'boost-pressure', label: 'What Is Boost Pressure?' },
  { id: 'pressure-ratio', label: 'What Is the Pressure Ratio?' },
  { id: 'turbo-vs-super', label: 'Supercharger vs. Turbocharger' },
  { id: 'six-psi', label: 'How Much HP Does 6 PSI Add?' },
  { id: 'ten-psi', label: 'How Much HP Does 10 PSI Add?' },
  { id: 'real-vs-ideal', label: 'Why Real Gains Differ' },
  { id: 'too-much-boost', label: 'Can Too Much Boost Damage an Engine?' },
  { id: 'limitations', label: 'Limitations of the Formula' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'boost-hp-faq', label: 'Frequently Asked Questions' },
];

export const BOOST_HP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a boost horsepower calculator?',
    answer:
      'A tool that estimates ideal engine power after additional forced-induction boost using baseline horsepower, boost gauge pressure, and atmospheric pressure.',
  },
  {
    question: 'How do you calculate horsepower from boost pressure?',
    answer:
      'HP_boosted = HP_current × (P_boost + P_atm) / P_atm. With P_atm ≈ 14.7 psi, that is HP × (1 + P_boost / 14.7).',
  },
  {
    question: 'How does a supercharger increase horsepower?',
    answer:
      'It compresses intake air so more oxygen enters each cylinder, supporting more fuel and higher potential power if the engine is tuned accordingly.',
  },
  {
    question: 'How much horsepower does 6 PSI of boost add?',
    answer:
      'Ideally about 40.8% of baseline: 200 hp → ≈281.6 hp (gain ≈81.6 hp) at 14.7 psi atmosphere. Real results vary.',
  },
  {
    question: 'How much horsepower does 10 PSI of boost add?',
    answer:
      'Ideally HP × (1 + 10/14.7) ≈ HP × 1.680: 200 hp → ≈336.1 hp under the same assumptions.',
  },
  {
    question: 'How much horsepower does 15 PSI of boost add?',
    answer:
      'Ideally HP × (1 + 15/14.7) ≈ HP × 2.020: 200 hp → ≈404.1 hp in the ideal model.',
  },
  {
    question: 'What is boost pressure?',
    answer:
      'Gauge pressure above ambient in the intake manifold, typically produced by a turbocharger or supercharger.',
  },
  {
    question: 'What is the difference between gauge pressure and absolute pressure?',
    answer:
      'Gauge pressure is relative to atmosphere; absolute pressure equals gauge plus atmospheric pressure.',
  },
  {
    question: 'What is atmospheric pressure in PSI?',
    answer:
      'Standard atmosphere is about 14.6959 psi. This calculator defaults to 14.7 psi for the simplified reference model.',
  },
  {
    question: 'What is a boost pressure ratio?',
    answer:
      'Absolute intake pressure divided by atmospheric pressure: PR = (P_boost + P_atm) / P_atm.',
  },
  {
    question: 'Does doubling boost pressure double horsepower?',
    answer:
      'No. Ideal power scales with absolute pressure ratio, not with gauge boost alone. Doubling gauge boost does not double HP.',
  },
  {
    question: 'Does boost always increase engine power?',
    answer:
      'Higher density can enable more power, but heat, fueling limits, knock, and poor tuning can reduce or prevent gains.',
  },
  {
    question: 'Is turbocharger boost the same as supercharger boost?',
    answer:
      'Both raise intake pressure, but drive methods and response differ. The ideal pressure-ratio formula can estimate either if gauge boost and baseline HP are known.',
  },
  {
    question: 'What is the difference between a turbocharger and a supercharger?',
    answer:
      'A turbo uses exhaust energy; a supercharger is usually mechanically driven by the crankshaft. Packaging, lag, and parasitic losses differ.',
  },
  {
    question: 'What is naturally aspirated horsepower?',
    answer:
      'Power without forced induction (or before the modeled additional boost). Enter it as the current engine power (N).',
  },
  {
    question: 'What is the difference between crank horsepower and wheel horsepower?',
    answer:
      'Crank HP is measured at the engine; wheel HP is at the driven wheels after drivetrain losses. Do not mix them without accounting for those losses.',
  },
  {
    question: 'Can I calculate horsepower using kW?',
    answer:
      'Yes. Convert with the unit selector (1 mechanical hp ≈ 0.7457 kW) before or after applying the boost formula.',
  },
  {
    question: 'How do I convert PSI to bar?',
    answer: '1 psi ≈ 0.06895 bar (or divide kPa by 100 after converting psi → kPa).',
  },
  {
    question: 'How do I calculate the boost required for target horsepower?',
    answer:
      'P_boost = P_atm × (HP_target / HP_current − 1). Use Required boost mode in this calculator.',
  },
  {
    question: 'How accurate is the boost horsepower formula?',
    answer:
      'It is an ideal estimate. Dyno results often differ due to temperature, efficiency, fueling, and calibration.',
  },
  {
    question: 'Does air temperature affect boosted horsepower?',
    answer:
      'Yes. Hotter charge air lowers density. Intercoolers and compressor efficiency matter; the basic formula ignores temperature.',
  },
  {
    question: 'Does engine displacement affect boost power potential?',
    answer:
      'Displacement and airflow capacity influence how much air the engine can use at a given boost, but the simple ratio model does not explicitly include displacement.',
  },
  {
    question: 'Can too much boost damage an engine?',
    answer:
      'Excessive boost without adequate fueling, cooling, and mechanical strength can cause detonation or failure. Follow manufacturer and tuner limits.',
  },
  {
    question: 'Why is measured horsepower lower than calculated horsepower?',
    answer:
      'Compressor heat, pressure drops, rich/lean limits, ignition retard, altitude, and drivetrain losses commonly reduce real output versus the ideal model.',
  },
  {
    question: 'What factors limit horsepower under forced induction?',
    answer:
      'Compressor maps, intercooling, fuel octane/delivery, timing, airflow restrictions, engine speed, and mechanical durability.',
  },
];
