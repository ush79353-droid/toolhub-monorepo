import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RMS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-rms-watts', label: 'What Are RMS Watts?' },
  { id: 'what-can-i-use', label: 'What Can I Use the Converter For?' },
  { id: 'formula', label: 'Watts RMS vs. Peak Watts — The Formula' },
  { id: 'rms-vs-continuous', label: 'Difference Between RMS Watts and Continuous Power' },
  { id: 'how-to-use', label: 'How to Use the RMS to Watts Converter' },
  { id: 'examples', label: 'Examples of RMS and Peak Calculations' },
  { id: 'rms-to-watts-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const RMS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-rms-watts',
    title: 'What Are RMS Watts?',
    paragraphs: [
      'Root mean square (RMS) is a statistical measure of a time-varying waveform. For a quantity x(t), RMS is the square root of the mean of x(t)² over a period. For voltage, V_RMS relates to the equivalent heating effect in a resistor compared with a DC voltage of the same magnitude.',
      'When people say “RMS watts,” they may mean different things: the RMS value of a sinusoidal power waveform, continuous average electrical power into a load, or marketing language around audio amplifiers. Only the first case uses P_peak = P_RMS × √2 as a waveform identity — and only when power itself is the sinusoidal quantity.',
      'Continuous amplifier output power, peak instantaneous power, and “RMS watt” marketing claims are not universally interchangeable. Standardized continuous ratings, load impedance, distortion limits, and test conditions matter for fair comparisons.',
    ],
  },
  {
    id: 'what-can-i-use',
    title: 'What Can I Use the RMS to Watts Converter For?',
    paragraphs: [
      'Use the primary converter for sinusoidal power-waveform RMS↔peak analysis in education and signal work. Use the optional electrical-power section for AC resistive or power-factor calculations from V_RMS, I_RMS, and R.',
      'Reliable amplifier comparisons require standardized continuous output-power ratings, stated load impedance, distortion limits, and documented test conditions — not a √2 multiplier alone.',
    ],
  },
  {
    id: 'formula',
    title: 'Watts RMS vs. Peak Watts — The Formula',
    paragraphs: [
      'For a sinusoidal power waveform (the quantity whose RMS is taken is itself a sinusoid of power):',
    ],
    formula: 'P_peak = √2 × P_RMS ·  P_RMS = P_peak / √2',
  },
  {
    id: 'formula-electrical',
    title: 'Real electrical power (separate from waveform RMS↔peak)',
    paragraphs: [
      'For sinusoidal AC with a power factor: P = V_RMS × I_RMS × PF. Apparent power S = V_RMS × I_RMS (VA). For a purely resistive load, PF = 1 and P = V_RMS × I_RMS = V_RMS² / R = I_RMS² × R.',
      'Do not confuse RMS voltage with RMS power. Converting a voltage amplitude with √2 does not by itself yield watts.',
    ],
    formula: 'P = V_RMS I_RMS PF ·  P = V_RMS² / R (resistive)',
  },
  {
    id: 'rms-vs-continuous',
    title: 'Difference Between RMS Watts and Continuous Power',
    paragraphs: [
      'Continuous (or average) output power describes sustained delivery under defined measurement conditions. Peak power may mean the highest instantaneous product of voltage and current, a short-term burst rating, or a marketing figure.',
      'Audio marketing sometimes labels continuous or average power as “RMS watts.” That informal usage is not the same as applying √2 to a sinusoidal power waveform. Speaker impedance, distortion, and rating standards determine whether two products are comparable.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the RMS to Watts Converter',
    paragraphs: [
      '1. Identify whether you have a sinusoidal power-waveform quantity or an electrical circuit calculation.',
      '2. Confirm the sinusoidal-waveform assumption before using RMS↔peak.',
      '3. Enter RMS or peak watts; the other field updates with √2.',
      '4. Open Electrical power calculator for V/I/R/PF modes when needed.',
      '5. Use Share, Reload, or Clear as needed.',
    ],
  },
  {
    id: 'examples',
    title: 'Examples of RMS and Peak Calculations',
    paragraphs: [
      'Example 1 (waveform): 100 W RMS → 100√2 ≈ 141.42 W peak.',
      'Example 2 (waveform): 500 W peak → 500/√2 ≈ 353.55 W RMS.',
      'Example 3 (electrical, unity PF): 120 V RMS × 2 A RMS = 240 W real power.',
      'Example 4 (electrical, PF 0.8): 120 × 2 × 0.8 = 192 W real power.',
      'Examples 1–2 assume a sinusoidal power waveform. Examples 3–4 assume RMS voltage and current with the stated power factor.',
    ],
  },
];

export const RMS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert 45 RMS watts to peak watts?',
    answer:
      'For the RMS value of a sinusoidal power waveform: 45√2 ≈ 63.64 W peak. This is not a universal amplifier power-rating conversion.',
  },
  {
    question: 'How many RMS watts is 500 peak watts?',
    answer:
      'For a sinusoidal power waveform: 500/√2 ≈ 353.55 W RMS under the same assumption.',
  },
  {
    question: 'How many RMS watts is 1000 peak watts?',
    answer:
      'For a sinusoidal power waveform: 1000/√2 ≈ 707.11 W RMS.',
  },
  {
    question: 'Is RMS power the same as average power?',
    answer:
      'No. RMS and average are different mathematical operations on a waveform. Average power into a resistor over a cycle is often what people mean by continuous electrical power; RMS of a power waveform is a different quantity unless the context defines otherwise.',
  },
  {
    question: 'Can I convert RMS voltage directly to watts?',
    answer:
      'Not without additional information such as resistance, current, or power factor. Use the electrical-power section when those inputs are known.',
  },
  {
    question: 'What is the difference between peak power and continuous power?',
    answer:
      'Peak power often refers to an instantaneous or short-term maximum. Continuous power is sustained output under defined measurement conditions. They are not interchangeable labels.',
  },
  {
    question: 'Is RMS wattage useful for choosing speakers?',
    answer:
      'Prefer standardized continuous power ratings, matching impedance, distortion limits, and manufacturer specifications. A √2 conversion alone does not choose a safe speaker rating.',
  },
];
