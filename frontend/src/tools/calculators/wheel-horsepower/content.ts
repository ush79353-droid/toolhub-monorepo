import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WHP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Wheel Horsepower Calculator' },
  { id: 'what-whp', label: 'What Is Wheel Horsepower?' },
  { id: 'whp-vs-hp', label: 'WHP vs Engine HP' },
  { id: 'how-calc-whp', label: 'How to Calculate WHP' },
  { id: 'formula', label: 'Wheel Horsepower Formula' },
  { id: 'how-calc-engine', label: 'Engine HP from WHP' },
  { id: 'drivetrain-loss', label: 'What Is Drivetrain Loss?' },
  { id: 'loss-percent', label: 'Drivetrain Loss Percentage' },
  { id: 'drivetrain-eff', label: 'Drivetrain Efficiency' },
  { id: 'gearbox', label: 'Gearbox Efficiency' },
  { id: 'prop-shaft', label: 'Propeller Shaft Efficiency' },
  { id: 'differential', label: 'Differential Efficiency' },
  { id: 'driveshaft', label: 'Driveshaft Efficiency' },
  { id: 'fwd-rwd', label: 'FWD vs RWD' },
  { id: 'awd-rwd', label: 'AWD vs RWD Losses' },
  { id: 'how-use', label: 'How to Use' },
  { id: 'example', label: 'Calculation Example' },
  { id: 'accuracy', label: 'How Accurate?' },
  { id: 'chassis-dyno', label: 'Chassis Dynamometer' },
  { id: 'engine-vs-chassis', label: 'Engine Dyno vs Chassis Dyno' },
  { id: 'why-matters', label: 'Why WHP Matters' },
  { id: 'improve', label: 'Improve Drivetrain Efficiency' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'whp-faq', label: 'Frequently Asked Questions' },
];

export const WHP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is wheel horsepower?',
    answer:
      'Wheel horsepower (WHP) is the power delivered at the driven wheels after drivetrain losses, typically measured on a chassis dynamometer.',
  },
  {
    question: 'What does WHP stand for?',
    answer: 'WHP stands for wheel horsepower.',
  },
  {
    question: 'How do I calculate wheel horsepower?',
    answer:
      'Multiply engine (crankshaft) horsepower by overall drivetrain efficiency as a decimal: WHP = HP × η.',
  },
  {
    question: 'What is the wheel horsepower formula?',
    answer:
      'WHP = HP × η, where η is drivetrain efficiency (0–1). Equivalently, HP = WHP / η when estimating crank power from measured WHP.',
  },
  {
    question: 'What is the difference between HP and WHP?',
    answer:
      'HP (engine/crankshaft horsepower) is measured or rated at the engine output. WHP is power at the wheels after transmission, shafts, differentials, and related losses.',
  },
  {
    question: 'How do I calculate engine horsepower from WHP?',
    answer:
      'Divide wheel horsepower by drivetrain efficiency: HP = WHP / η. Efficiency must be greater than zero.',
  },
  {
    question: 'What is drivetrain loss?',
    answer:
      'Drivetrain loss is the difference between engine power and wheel power caused by friction, gear meshing, fluid churning, and other parasitic losses in the power path.',
  },
  {
    question: 'How do you calculate drivetrain loss?',
    answer:
      'Power loss ≈ HP − WHP when both are expressed in the same units. Loss percentage ≈ 100 × (1 − η).',
  },
  {
    question: 'What is drivetrain efficiency?',
    answer:
      'The fraction of engine power that reaches the wheels. η = WHP / HP when both are measured under consistent conditions.',
  },
  {
    question: 'What is the typical drivetrain loss percentage?',
    answer:
      'Illustrative estimates often cite roughly 10–20% depending on layout (for example ~12% FWD, ~15% RWD, ~20% AWD/4WD). Real vehicles vary widely.',
  },
  {
    question: 'How much horsepower is lost through the transmission?',
    answer:
      'It depends on gearbox design, gear selected, fluid temperature, and load. Component mode lets you enter a gearbox efficiency percentage as an estimate.',
  },
  {
    question: 'Does RWD lose more power than FWD?',
    answer:
      'Often RWD paths include a propeller shaft and rear differential that FWD layouts avoid, so illustrative RWD loss can be higher — but packaging and hardware still dominate real results.',
  },
  {
    question: 'Does AWD have more drivetrain loss?',
    answer:
      'Many AWD systems engage extra gearing and differentials, so illustrative models use higher losses (~20%). Mode of operation and design matter a lot.',
  },
  {
    question: 'How much WHP is 300 engine horsepower?',
    answer:
      'At 85% drivetrain efficiency, about 255 WHP (300 × 0.85). Change η to match your estimate or measurements.',
  },
  {
    question: 'How much WHP is 400 engine horsepower?',
    answer:
      'At 85% efficiency ≈ 340 WHP; at 80% ≈ 320 WHP. Always state the efficiency assumption.',
  },
  {
    question: 'How much WHP is 500 engine horsepower?',
    answer:
      'At 85% efficiency ≈ 425 WHP; at 80% ≈ 400 WHP.',
  },
  {
    question: 'How much engine horsepower is 250 WHP?',
    answer:
      'At 85% efficiency ≈ 294 hp (250 / 0.85). Higher assumed loss means higher estimated crank HP.',
  },
  {
    question: 'How much engine horsepower is 350 WHP?',
    answer: 'At 85% efficiency ≈ 412 hp (350 / 0.85).',
  },
  {
    question: 'How much engine horsepower is 500 WHP?',
    answer: 'At 85% efficiency ≈ 588 hp (500 / 0.85).',
  },
  {
    question: 'Is WHP measured at the wheels?',
    answer:
      'Yes. Chassis dynamometers measure power at the driven wheels (subject to dyno correction methods and setup).',
  },
  {
    question: 'What is crankshaft horsepower?',
    answer:
      'Power at the engine crankshaft (often called crank HP). It is upstream of most drivetrain losses that reduce WHP.',
  },
  {
    question: 'What is brake horsepower?',
    answer:
      'Brake horsepower (BHP) historically refers to engine output measured on a brake dynamometer — typically crank/engine power, not wheel power.',
  },
  {
    question: 'Is brake horsepower the same as wheel horsepower?',
    answer:
      'No. BHP is generally engine output; WHP is at the wheels after drivetrain losses.',
  },
  {
    question: 'What is the difference between WHP and BHP?',
    answer:
      'WHP is wheel horsepower; BHP is brake/engine horsepower. WHP is usually lower than BHP for the same vehicle state.',
  },
  {
    question: 'What is a chassis dynamometer?',
    answer:
      'A roller or hub dynamometer that loads the vehicle through the driven wheels to measure wheel power and related metrics.',
  },
  {
    question: 'Can drivetrain loss vary with speed?',
    answer:
      'Yes. Fluid viscosity, gear selection, tire losses, and aerodynamic loading on the dyno can change observed losses with speed.',
  },
  {
    question: 'Can gearbox efficiency affect wheel horsepower?',
    answer:
      'Yes. Transmission friction and pumping losses reduce power reaching the wheels; lower gearbox η lowers WHP for a given engine HP.',
  },
  {
    question: 'How does differential efficiency affect WHP?',
    answer:
      'Differentials introduce gear and bearing losses. Lower differential efficiency reduces overall η and WHP in a series model.',
  },
  {
    question: 'Does transmission type affect drivetrain loss?',
    answer:
      'Yes. Manual, automatic, dual-clutch, and CVT designs have different loss characteristics by gear and temperature.',
  },
  {
    question: 'Can tire size affect wheel horsepower measurements?',
    answer:
      'Tire diameter, compound, pressure, and slip influence chassis-dyno readings and effective losses.',
  },
  {
    question: 'Is wheel horsepower more important than engine horsepower?',
    answer:
      'WHP better reflects power available for acceleration at the tires, while engine HP is useful for comparing engines and tuning. Both matter depending on the question.',
  },
  {
    question: 'Can wheel horsepower be higher than engine horsepower?',
    answer:
      'Under a simple loss model, WHP should not exceed crank HP. If measured WHP > HP, check units, correction factors, dyno methods, or data consistency.',
  },
  {
    question: 'How do I convert WHP to kW?',
    answer:
      '1 mechanical horsepower ≈ 0.7457 kW. Convert after computing WHP in hp, or enter power in kW with the unit selector.',
  },
  {
    question: 'How accurate is a wheel horsepower calculator?',
    answer:
      'Exact for the formulas and efficiencies you enter. Real drivetrain losses vary with hardware, gear, speed, temperature, and dyno methodology.',
  },
  {
    question: 'Does drivetrain efficiency change with temperature?',
    answer:
      'Often yes — fluid viscosity and friction change as components warm up, so cold and hot runs can differ.',
  },
  {
    question: 'How do you calculate drivetrain efficiency from measured horsepower?',
    answer:
      'η = WHP / HP when both values use the same units and comparable test conditions.',
  },
  {
    question: 'Is 15% drivetrain loss normal?',
    answer:
      'It is a common illustrative RWD-style assumption (~85% efficiency), not a universal rule for every vehicle.',
  },
  {
    question: 'What factors affect measured wheel horsepower?',
    answer:
      'Engine output, drivetrain design, gear, tires, temperature, atmospheric corrections, dyno type, and operator procedure.',
  },
  {
    question: 'Does engine tuning increase wheel horsepower?',
    answer:
      'Tuning that raises engine output usually raises WHP as well, minus whatever drivetrain losses remain under those conditions.',
  },
  {
    question: 'How can I reduce drivetrain power loss?',
    answer:
      'Maintain fluids, ensure healthy bearings/gears, minimize unnecessary spinning mass where appropriate, and follow manufacturer guidance — expect modest, variable gains, not guaranteed horsepower.',
  },
];
