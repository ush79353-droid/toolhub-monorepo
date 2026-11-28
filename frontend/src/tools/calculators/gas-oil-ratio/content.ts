import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GAS_OIL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Gas Oil Ratio Calculator' },
  { id: 'what-is', label: 'What Is a Gas-to-Oil Ratio?' },
  { id: 'two-vs-four', label: 'Two-Stroke vs. Four-Stroke' },
  { id: 'why-mix', label: 'Why Mix Oil With Gas?' },
  { id: '50-1', label: 'What Does 50:1 Mean?' },
  { id: 'how-calculate', label: 'How to Calculate Gas-to-Oil Ratio' },
  { id: 'oil-requirements', label: 'How to Calculate Oil Requirements' },
  { id: 'one-liter', label: 'Oil for 1 Liter of Gas' },
  { id: 'five-liters', label: 'Oil for 5 Liters of Gas' },
  { id: 'one-gallon', label: 'Oil for 1 Gallon of Gas' },
  { id: 'chart', label: 'Mixing Chart' },
  { id: 'common-ratios', label: 'Common Mixture Ratios' },
  { id: 'how-to-mix', label: 'How to Mix Correctly' },
  { id: 'too-much', label: 'Too Much Oil' },
  { id: 'too-little', label: 'Too Little Oil' },
  { id: 'universal', label: 'Is One Ratio Universal?' },
  { id: 'chainsaws', label: 'Chainsaws' },
  { id: 'trimmers', label: 'Trimmers' },
  { id: 'blowers', label: 'Leaf Blowers' },
  { id: 'motorcycles', label: 'Motorcycles' },
  { id: 'outboards', label: 'Outboard Motors' },
  { id: 'mistakes', label: 'Common Mixing Mistakes' },
  { id: 'safety', label: 'Safety Guidance' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gor-faq', label: 'Frequently Asked Questions' },
];

export const GAS_OIL_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a gas-to-oil ratio?',
    answer:
      'A volume ratio stating how many parts of gasoline go with one part of two-stroke oil (for example 50:1).',
  },
  {
    question: 'What does 50:1 mean?',
    answer:
      'Fifty parts gasoline for every one part two-stroke oil by volume — about 20 mL of oil per liter of gas.',
  },
  {
    question: 'How much oil do I add to 1 liter of gas at 50:1?',
    answer: '20 mL of two-stroke oil.',
  },
  {
    question: 'How much oil do I add to 5 liters of gas at 50:1?',
    answer: '100 mL of two-stroke oil.',
  },
  {
    question: 'How much oil do I add to 10 liters of gas at 50:1?',
    answer: '200 mL of two-stroke oil.',
  },
  {
    question: 'How much oil do I add to 1 gallon of gas at 50:1?',
    answer:
      'About 2.56 US fl oz of oil per US gallon (128 US fl oz ÷ 50).',
  },
  {
    question: 'How much oil do I add to 1 gallon of gas at 40:1?',
    answer: 'About 3.2 US fl oz of oil per US gallon.',
  },
  {
    question: 'How much oil do I add to 1 gallon of gas at 32:1?',
    answer: '4 US fl oz of oil per US gallon.',
  },
  {
    question: 'How much oil do I add to 1 gallon of gas at 25:1?',
    answer: 'About 5.12 US fl oz of oil per US gallon.',
  },
  {
    question: 'What is the difference between 40:1 and 50:1?',
    answer:
      '40:1 uses more oil per liter of gas than 50:1 (25 mL/L vs 20 mL/L). Follow your engine’s specified ratio.',
  },
  {
    question: 'Is 40:1 more oil than 50:1?',
    answer:
      'Yes — a lower ratio number means a richer oil mix (more oil relative to gasoline).',
  },
  {
    question: 'How do I calculate a 2-stroke oil mixture?',
    answer:
      'Oil volume = gasoline volume ÷ ratio when both are in the same units (e.g. 5000 mL ÷ 50 = 100 mL).',
  },
  {
    question: 'How do I calculate the gas-to-oil ratio?',
    answer:
      'Ratio = gasoline volume ÷ oil volume after converting both to the same unit.',
  },
  {
    question: 'How do I convert a gas-to-oil ratio into a percentage?',
    answer:
      'Oil as a share of the total mixture ≈ 100 / (ratio + 1). Oil as a share of gasoline alone = 100 / ratio.',
  },
  {
    question: 'What percentage of oil is a 50:1 mixture?',
    answer:
      'About 1.96% of the total mixture, or 2% of the gasoline volume alone.',
  },
  {
    question: 'What percentage of oil is a 40:1 mixture?',
    answer:
      'About 2.44% of the total mixture, or 2.5% of the gasoline volume alone.',
  },
  {
    question: 'How much gas do I need for 100 mL of oil?',
    answer: 'At 50:1: 100 × 50 = 5,000 mL (5 L) of gasoline.',
  },
  {
    question: 'How do I calculate gas required from oil volume?',
    answer: 'Gas = Oil × Ratio (same volume units).',
  },
  {
    question: 'Can I calculate a custom fuel ratio?',
    answer:
      'Yes — enter any positive ratio (for example 45:1) or compute ratio from known gas and oil volumes.',
  },
  {
    question: 'Can I use milliliters and gallons together?',
    answer:
      'Yes — convert both components to the same unit before dividing, or let the calculator normalize internally.',
  },
  {
    question: 'What is the difference between US gallons and imperial gallons?',
    answer:
      'A US gallon is about 3.785 L; an imperial gallon is about 4.546 L. Do not mix the systems.',
  },
  {
    question: 'Can I use a gas oil ratio calculator for a chainsaw?',
    answer:
      'Yes for the math — but use only the ratio and oil type specified in the chainsaw manual.',
  },
  {
    question: 'Can I use it for a leaf blower?',
    answer:
      'Yes mathematically; confirm the manufacturer’s premix ratio and oil grade first.',
  },
  {
    question: 'Can I use it for a string trimmer?',
    answer:
      'Yes for volume math. Many trimmers specify 40:1 or 50:1 — check your model.',
  },
  {
    question: 'Can I use it for a two-stroke motorcycle?',
    answer:
      'Yes for premix math when the bike uses premix. Some systems are oil-injection — follow the service manual.',
  },
  {
    question: 'Can I use it for an outboard motor?',
    answer:
      'Only when the outboard requires premix. Many modern outboards use separate oil injection.',
  },
  {
    question: 'Do all two-stroke engines use 50:1?',
    answer:
      'No. Ratios vary by design and oil type. There is no universal safe ratio.',
  },
  {
    question: 'What happens if I use too much two-stroke oil?',
    answer:
      'Excess oil can foul plugs, create smoke, and leave deposits. Still prefer manufacturer guidance over guessing lean.',
  },
  {
    question: 'What happens if I use too little two-stroke oil?',
    answer:
      'Inadequate lubrication can cause overheating, scoring, and engine failure.',
  },
  {
    question: 'Can I mix two-stroke oil directly into the fuel tank?',
    answer:
      'Prefer mixing in an approved fuel can so oil disperses evenly before filling equipment.',
  },
  {
    question: 'What type of oil should I use for a two-stroke engine?',
    answer:
      'Use manufacturer-approved two-stroke oil meeting the required specification (for example TC-W3 for some marine engines).',
  },
  {
    question: 'How do I measure two-stroke oil accurately?',
    answer:
      'Use a graduated syringe or measuring cup marked in mL or fl oz — kitchen spoons are imprecise.',
  },
  {
    question: 'How should I store premixed fuel?',
    answer:
      'In an approved, labeled fuel container away from ignition sources, following local storage rules.',
  },
  {
    question: 'How long can premixed gasoline be stored?',
    answer:
      'Stability varies with fuel, oil, and storage conditions. Many users prefer fresh mix within weeks; check product guidance.',
  },
  {
    question: 'Can I use regular motor oil in a two-stroke engine?',
    answer:
      'Not unless the manufacturer explicitly allows it. Automotive four-stroke oils are usually unsuitable for premix.',
  },
  {
    question: 'What happens if I use premix in a four-stroke engine?',
    answer:
      'Four-stroke engines typically need straight gasoline plus separate crankcase oil. Premix can foul the system — follow the manual.',
  },
  {
    question: 'What is the best gas-to-oil ratio?',
    answer:
      'The best ratio is the one specified for your engine and oil. Calculators do not replace that specification.',
  },
  {
    question: 'How can I check an existing fuel mixing ratio?',
    answer:
      'Measure gasoline and oil volumes (same units) and divide: ratio = gas ÷ oil.',
  },
  {
    question: 'Does the calculator support metric and imperial units?',
    answer:
      'Yes — milliliters, liters, US and imperial fluid ounces and gallons.',
  },
  {
    question: 'How accurate is the gas oil ratio calculator?',
    answer:
      'The math is exact for the volumes and ratio you enter. Real-world accuracy depends on measuring carefully and using the correct specified ratio.',
  },
];
