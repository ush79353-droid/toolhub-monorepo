import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RPM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'RPM Calculator' },
  { id: 'what-rpm', label: 'What Is RPM?' },
  { id: 'car-rpm', label: 'RPM in a Car' },
  { id: 'engine-rpm', label: 'Engine RPM' },
  { id: 'wheel-rpm', label: 'Wheel RPM' },
  { id: 'engine-vs-wheel', label: 'Engine vs Wheel RPM' },
  { id: 'ratio', label: 'Drivetrain Transmission Ratio' },
  { id: 'how-calc', label: 'How to Calculate RPM' },
  { id: 'engine-formula', label: 'Engine RPM Formula' },
  { id: 'wheel-formula', label: 'Wheel RPM Formula' },
  { id: 'speed-formula', label: 'Vehicle Speed Formula' },
  { id: 'speed-from-engine', label: 'Speed From Engine RPM' },
  { id: 'engine-from-speed', label: 'Engine RPM From Speed' },
  { id: 'tire-effect', label: 'Tire Diameter Effects' },
  { id: 'ratio-effect', label: 'Transmission Ratio Effects' },
  { id: 'fuel', label: 'RPM and Fuel Consumption' },
  { id: 'performance', label: 'RPM and Performance' },
  { id: 'torque', label: 'RPM vs Torque' },
  { id: 'horsepower', label: 'RPM vs Horsepower' },
  { id: 'highway', label: 'Highway Speeds' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'rpm-faq', label: 'Frequently Asked Questions' },
];

export const RPM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is RPM?',
    answer:
      'Revolutions per minute—how many full rotations a shaft or wheel completes in one minute.',
  },
  {
    question: 'What does RPM stand for?',
    answer: 'Revolutions Per Minute.',
  },
  {
    question: 'What does RPM mean in a car?',
    answer:
      'Usually engine crankshaft speed. Wheel RPM is separate and depends on gearing and tire size.',
  },
  {
    question: 'How do you calculate revolutions per minute?',
    answer:
      'Count rotations in a time interval and scale to one minute, or derive RPM from related speed and gearing formulas.',
  },
  {
    question: 'How do I calculate engine RPM?',
    answer: 'ERPM = WRPM × R, or from road speed: ERPM = (mph × 1056 × R) / (π × D).',
  },
  {
    question: 'How do I calculate wheel RPM?',
    answer:
      'WRPM = ERPM / R, or from speed: WRPM = 60 × V / (π × D) with consistent units.',
  },
  {
    question: 'How do I convert wheel RPM to vehicle speed?',
    answer:
      'mph = WRPM × π × D_inches / 1056. Example: 750 × π × 26 / 1056 ≈ 58.01 mph.',
  },
  {
    question: 'How do I calculate engine RPM from vehicle speed?',
    answer:
      'With tire diameter and overall ratio: ERPM = (mph × 1056 × R) / (π × D). Example: 60 mph, 26 in, R=3.73 ≈ 2894 RPM.',
  },
  {
    question: 'What is the relationship between RPM and speed?',
    answer:
      'Road speed tracks wheel RPM and tire circumference. Engine RPM tracks wheel RPM through the overall drivetrain ratio.',
  },
  {
    question: 'What is drivetrain transmission ratio?',
    answer:
      'Overall engine-to-wheel reduction R. Often gearbox ratio × final-drive ratio when the drivetrain is locked/slip-free.',
  },
  {
    question: 'How does transmission ratio affect RPM?',
    answer:
      'A numerically higher overall ratio raises engine RPM for the same wheel RPM (and road speed).',
  },
  {
    question: 'How does tire diameter affect vehicle speed?',
    answer:
      'Larger diameter increases distance per wheel revolution, so the same wheel RPM yields higher road speed.',
  },
  {
    question: 'How does tire diameter affect engine RPM?',
    answer:
      'At a fixed road speed and gearing, larger tires lower wheel RPM and therefore lower engine RPM.',
  },
  {
    question: 'What are the units for RPM?',
    answer: 'Revolutions per minute (1/min). Related unit: revolutions per second (RPS = RPM / 60).',
  },
  {
    question: 'What is the difference between RPM and RPS?',
    answer: 'RPS counts revolutions per second; RPM per minute. RPS = RPM ÷ 60.',
  },
  {
    question: 'How do I convert RPM to RPS?',
    answer: 'Divide by 60. Example: 3600 RPM = 60 RPS.',
  },
  {
    question: 'How do I convert RPS to RPM?',
    answer: 'Multiply by 60. Example: 50 RPS = 3000 RPM.',
  },
  {
    question: 'What is a good RPM for a car?',
    answer:
      'It depends on the engine and gear. Idle is often ~600–1000 RPM; cruising and power bands vary widely by vehicle.',
  },
  {
    question: 'What is idle RPM?',
    answer:
      'Engine speed with the vehicle stationary (or unloaded) and the throttle closed—typically a few hundred to about a thousand RPM.',
  },
  {
    question: 'What is redline RPM?',
    answer:
      'The manufacturer’s maximum recommended engine speed, often marked on the tachometer.',
  },
  {
    question: 'What is the difference between engine RPM and wheel RPM?',
    answer:
      'Engine RPM is crankshaft speed. Wheel RPM is how fast the wheels turn. They differ by the overall drivetrain ratio.',
  },
  {
    question: 'Why does engine RPM increase when accelerating?',
    answer:
      'More throttle raises engine speed; in a fixed gear, higher engine RPM also raises wheel RPM and road speed.',
  },
  {
    question: 'Why does engine RPM decrease when shifting gears?',
    answer:
      'Selecting a taller gear lowers overall ratio, so the same road speed needs fewer engine revolutions.',
  },
  {
    question: 'How do gear ratios affect vehicle speed?',
    answer:
      'For a given engine RPM, a lower numerical overall ratio yields higher wheel RPM and higher potential road speed.',
  },
  {
    question: 'What is a final-drive ratio?',
    answer:
      'The axle or differential reduction between the driveshaft/pinion and the wheels—part of overall R.',
  },
  {
    question: 'How do I calculate overall drivetrain ratio?',
    answer: 'Often R = gearbox ratio × final-drive ratio (assuming no slip).',
  },
  {
    question: 'Can tire size affect speedometer readings?',
    answer:
      'Yes. Speedometers assume a calibration tire circumference; different sizes change actual distance per wheel revolution.',
  },
  {
    question: 'How do I calculate tire circumference?',
    answer: 'C = π × D. A 26-inch tire has C ≈ 81.68 inches.',
  },
  {
    question: 'How do I calculate wheel revolutions per mile?',
    answer: 'WRM = 63,360 / (π × D_inches). Separate from revolutions per minute.',
  },
  {
    question: 'Can I calculate vehicle speed without knowing engine RPM?',
    answer: 'Yes—if you know wheel RPM and tire diameter (or equivalent circumference).',
  },
  {
    question: 'Can I calculate engine RPM without knowing the gear ratio?',
    answer:
      'Not from wheel or road speed alone. You need overall ratio (or both engine and wheel RPM to find it).',
  },
  {
    question: 'Does higher RPM mean higher speed?',
    answer:
      'Not always. In a lower gear you can have high engine RPM at modest road speed.',
  },
  {
    question: 'Can a vehicle travel at different speeds with the same engine RPM?',
    answer: 'Yes—different gears (different R) change road speed at the same engine RPM.',
  },
  {
    question: 'Why might calculated RPM differ from actual RPM?',
    answer:
      'Torque converter or clutch slip, rolling circumference vs nominal diameter, and measurement error.',
  },
  {
    question: 'Can RPM affect fuel efficiency?',
    answer:
      'Engine speed influences efficiency, but load, gear choice, aerodynamics, and engine map also matter.',
  },
  {
    question: 'What is the difference between RPM and horsepower?',
    answer:
      'RPM is rotational speed. Horsepower is power, often related by power ∝ torque × RPM.',
  },
  {
    question: 'What is the difference between RPM and torque?',
    answer:
      'Torque is twisting force; RPM is how fast that shaft spins. Together they determine power.',
  },
  {
    question: 'How do I calculate RPM for a manual transmission?',
    answer:
      'Use the selected gear ratio × final drive as R, then apply the same ERPM/WRPM/speed formulas.',
  },
  {
    question: 'How do I calculate RPM for an automatic transmission?',
    answer:
      'Same geometry when locked up; with a slipping torque converter, engine RPM can exceed the rigid R prediction.',
  },
  {
    question: 'Can this RPM calculator be used for motorcycles?',
    answer:
      'Yes for the same geometric relationships, using overall primary/gearbox/final ratios and tire diameter.',
  },
];
