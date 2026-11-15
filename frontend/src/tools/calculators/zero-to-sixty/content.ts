import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '../auto-loan/TableOfContents';

export const ZERO_TO_SIXTY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-0-60-calculator', label: 'What Is a 0–60 Calculator?' },
  { id: 'what-does-0-60-mean', label: 'What Does 0–60 mph Mean?' },
  { id: 'how-the-calculator-works', label: 'How Does a 0–60 Calculator Work?' },
  { id: 'acceleration-formulas', label: 'Core Acceleration Physics Formulas' },
  { id: 'what-affects-0-60-performance', label: 'What Affects 0–60 Performance?' },
  { id: 'power-to-weight-ratio-explained', label: 'Power-to-Weight Ratio Explained' },
  { id: '0-60-vs-0-100-kmh', label: '0–60 mph vs. 0–100 km/h' },
  { id: 'drivetrain-comparison', label: 'Drivetrain Dynamics: FWD vs. RWD vs. AWD' },
  { id: 'worked-0-60-example', label: 'Worked Acceleration Example' },
  { id: 'model-accuracy-and-limits', label: 'How Accurate Are Mathematical Estimates?' },
  { id: 'common-estimation-mistakes', label: 'Common Estimation Mistakes' },
  { id: 'frequently-asked-questions', label: 'Frequently Asked Questions' },
] as const;

export const DRIVETRAIN_COMPARISON_DATA = [
  {
    drivetrain: 'Rear-Wheel Drive (RWD)',
    weightTransfer: 'Rearward shift increases normal force on driven wheels (+15% dynamic load).',
    launchStrength: 'Excellent dry traction; susceptible to wheelspin on cold or wet asphalt.',
    typicalEfficiency: '83% – 86%',
  },
  {
    drivetrain: 'All-Wheel Drive (AWD)',
    weightTransfer: 'All 4 tires utilize 100% of vehicle mass for traction under launch.',
    launchStrength: 'Superior launch grip; virtually eliminates wheelspin at high power levels.',
    typicalEfficiency: '80% – 83%',
  },
  {
    drivetrain: 'Front-Wheel Drive (FWD)',
    weightTransfer: 'Weight transfers away from front axle, decreasing available grip under acceleration.',
    launchStrength: 'Prone to wheelspin/torque steer during aggressive launches; lightweight package.',
    typicalEfficiency: '86% – 89%',
  },
] as const;

export const ZERO_TO_SIXTY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is considered a "good" 0–60 mph time for modern cars?',
    answer:
      'For typical modern commuter cars and compact crossovers, a 0–60 time between 7.5 and 9.0 seconds is standard and adequate for highway merging. Sporty sedans and hot hatchbacks typically record 5.0 to 6.5 seconds. Performance cars (such as Mustangs, BMW M-cars, or Corvettes) regularly accelerate in 3.5 to 4.5 seconds, while modern hypercars and performance dual-motor EVs achieve 1.9 to 2.8 seconds under prepped drag-strip conditions.',
  },
  {
    question: 'Does peak horsepower alone determine 0–60 mph acceleration?',
    answer:
      'No. Peak horsepower only indicates the maximum power the engine produces at a specific high RPM. Low-speed 0–60 acceleration is heavily determined by low-end torque, transmission gearing, tire grip coefficient, drivetrain layout (AWD vs. RWD vs. FWD), launch RPM, and total vehicle mass. A lighter 300 hp AWD car will often launch faster to 60 mph than a 500 hp heavy RWD car struggling for grip.',
  },
  {
    question: 'How much does vehicle weight affect acceleration?',
    answer:
      "Vehicle mass directly opposes acceleration according to Newton's second law (a = F / m). Adding 100 lb (45 kg) of extra passenger or cargo weight typically increases 0–60 time by approximately 0.1 to 0.15 seconds in standard passenger vehicles. In addition, rotating mass (wheels, tires, brake rotors, flywheel) has an outsized effect because rotational inertia requires extra torque to spin up.",
  },
  {
    question: 'Why is All-Wheel Drive (AWD) often faster from 0 to 60 than RWD or FWD?',
    answer:
      'At low speeds from a standstill, engine power frequently exceeds the traction limit of a single axle. AWD distributes wheel torque across all four tires, utilizing 100% of the vehicle’s normal weight for adhesion. While AWD systems carry a slight weight and parasitic drivetrain efficiency penalty at high speeds, their traction advantage off the line significantly reduces 0–60 times.',
  },
  {
    question: 'How does transmission type impact 0–60 performance?',
    answer:
      'Dual-Clutch Transmissions (DCT) and modern multi-ratio automatics (8- to 10-speed) execute gear changes in tens of milliseconds without cutting power. In contrast, traditional manual gearboxes require disengaging the clutch and lifting off the throttle, creating a 0.3 to 0.5-second interruption in forward drive force during the 1st-to-2nd gear shift.',
  },
  {
    question: 'What is the exact difference between 0–60 mph and 0–100 km/h?',
    answer:
      'Sixty miles per hour equals exactly 96.5606 km/h. Therefore, 100 km/h is equivalent to 62.1371 mph. Reaching 100 km/h requires an additional 2.14 mph of acceleration beyond 60 mph. Depending on the car and whether a second gear shift is required, the 0–100 km/h time is typically 0.2 to 0.5 seconds longer than the 0–60 mph time.',
  },
  {
    question: 'Can any mathematical calculator predict exact real-world 0–60 times?',
    answer:
      'Mathematical simulations provide grounded engineering estimates, but real-world results vary with environmental and mechanical variables. Factors such as pavement temperature, asphalt roughness, tire wear, tire pressure, driver reaction time, clutch heat, altitude (which robs naturally aspirated engines of ~3% power per 1,000 feet), and fuel weight will always create minor variations from laboratory figures.',
  },
  {
    question: 'Why do manufacturer advertised acceleration times differ from magazine tests?',
    answer:
      'Automotive publications (such as Car and Driver or Motor Trend) historically apply a "1-foot rollout" subtraction (~0.2 to 0.3 seconds) matching drag-strip timing equipment, and test on prepped or sticky surfaces. Conversely, manufacturer claims may be conservative to ensure average customer reproducibility, or measured without rollout on standard European road surfaces with full European test payloads.',
  },
];

