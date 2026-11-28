import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PPM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Pulse per Mile Calculator' },
  { id: 'what-ppm', label: 'What Is Pulse per Mile?' },
  { id: 'vss', label: 'Vehicle Speed Sensors' },
  { id: 'what-vss', label: 'What Is a VSS?' },
  { id: 'location', label: 'Where Is a VSS Located?' },
  { id: 'axle', label: 'What Is an Axle Ratio?' },
  { id: 'reluctor', label: 'What Is a Reluctor Wheel?' },
  { id: 'formula', label: 'The PPM Formula' },
  { id: 'wrm-how', label: 'Wheel Rotations per Mile' },
  { id: 'ppm-how', label: 'How to Calculate PPM' },
  { id: 'tire-effect', label: 'Tire Diameter and PPM' },
  { id: 'axle-effect', label: 'Axle Ratio and PPM' },
  { id: 'teeth-effect', label: 'Tooth Count and PPM' },
  { id: 'example', label: 'Worked Example' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'rolling', label: 'Diameter vs Rolling Circumference' },
  { id: 'calibration', label: 'VSS Calibration' },
  { id: 'causes', label: 'Incorrect PPM Readings' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ppm-faq', label: 'Frequently Asked Questions' },
];

export const PPM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is pulses per mile?',
    answer:
      'Pulses per mile (PPM) is the number of vehicle speed sensor pulses generated while the vehicle travels one statute mile.',
  },
  {
    question: 'What does PPM mean in a vehicle?',
    answer:
      'In this context PPM means pulses per mile from the speed sensor tone wheel, not parts per million.',
  },
  {
    question: 'What is a vehicle speed sensor?',
    answer:
      'A VSS detects rotational motion in the drivetrain or at a wheel and outputs a pulse train used for speedometer, ABS, and control modules.',
  },
  {
    question: 'What does VSS stand for?',
    answer: 'Vehicle Speed Sensor.',
  },
  {
    question: 'What is wheel rotations per mile?',
    answer:
      'How many times a tire of a given diameter theoretically rotates while covering one mile: WRM = 63,360 ÷ (π × tire diameter in inches).',
  },
  {
    question: 'How do I calculate wheel rotations per mile?',
    answer:
      'Convert tire diameter to inches, then divide 63,360 by π times that diameter. A 26-inch tire is about 775.7 rev/mi.',
  },
  {
    question: 'How do I calculate pulses per mile?',
    answer:
      'PPM = WRM × axle ratio × reluctor tooth count, assuming one counted pulse per tooth on a shaft that turns at axle-ratio × wheel speed.',
  },
  {
    question: 'What is the pulse per mile formula?',
    answer:
      'PPM = (63,360 × AR × NT) / (π × TD), with TD in inches, AR axle ratio, and NT tooth count.',
  },
  {
    question: 'What is an axle ratio?',
    answer:
      'The gear ratio between driveshaft (or pinion) revolutions and one wheel revolution—for example 3.42 means 3.42 driveshaft turns per wheel turn.',
  },
  {
    question: 'What is a reluctor wheel?',
    answer:
      'A toothed tone ring that passes a magnetic or Hall-effect sensor; each tooth (or edge) can generate a pulse.',
  },
  {
    question: 'What is reluctor tooth count?',
    answer:
      'The number of teeth on that tone wheel—often 20, 40, or another OEM-specified count.',
  },
  {
    question: 'How does the number of reluctor teeth affect PPM?',
    answer:
      'Under the assumed formula, PPM scales linearly with tooth count: twice the teeth means twice the pulses per mile.',
  },
  {
    question: 'How does tire diameter affect PPM?',
    answer:
      'Larger diameter → fewer wheel revolutions per mile → lower WRM and lower PPM for the same axle and tooth count.',
  },
  {
    question: 'How does axle ratio affect PPM?',
    answer:
      'A numerically higher axle ratio spins the assumed shaft faster relative to the wheels, raising PPM for the same tire and tooth count.',
  },
  {
    question: 'How many wheel rotations are in one mile?',
    answer:
      'It depends on tire diameter. Roughly 63,360 ÷ (π × diameter inches). There is no single number for all vehicles.',
  },
  {
    question: 'How many revolutions per mile does a 26-inch tire make?',
    answer: 'About 775.7 theoretical revolutions per mile.',
  },
  {
    question: 'How do I convert tire diameter from centimeters to inches?',
    answer: 'Divide by 2.54. Example: 66.04 cm ÷ 2.54 = 26 in.',
  },
  {
    question: 'Can I use millimeters for tire diameter?',
    answer:
      'Yes. Convert to inches (÷ 25.4) before applying the WRM/PPM formulas, or use this calculator’s unit selector.',
  },
  {
    question: 'What happens to PPM when tire size increases?',
    answer:
      'Larger tires reduce revolutions per mile, so expected PPM drops if axle ratio and tooth count stay the same.',
  },
  {
    question: 'What happens to PPM when tire size decreases?',
    answer:
      'Smaller tires increase revolutions per mile and raise expected PPM under the same assumptions.',
  },
  {
    question: 'Why is my vehicle speed sensor reading incorrect?',
    answer:
      'Common causes include wrong tire size in calibration, wrong axle or tooth assumptions, different sensor location, or electrical noise—not always a bad sensor.',
  },
  {
    question: 'Where is a vehicle speed sensor located?',
    answer:
      'Placement varies: transmission output, transfer case, differential, ABS wheel hub, or another drivetrain location.',
  },
  {
    question: 'How does a vehicle speed sensor work?',
    answer:
      'Typically a magnetic or Hall sensor senses passing teeth and creates a pulse train proportional to rotational speed.',
  },
  {
    question: 'How can I calculate VSS pulse frequency?',
    answer:
      'Hz ≈ PPM × mph ÷ 3600. Example: 40,000 PPM at 60 mph ≈ 666.67 Hz.',
  },
  {
    question: 'What is the relationship between vehicle speed and pulse frequency?',
    answer:
      'For a fixed PPM calibration, pulse frequency rises in proportion to road speed.',
  },
  {
    question: 'How do I calculate PPM for a 3.73 axle ratio?',
    answer:
      'Use the same formula with AR = 3.73, your tooth count, and tire diameter in inches. Example: 3.73 × 20 teeth × 28 in ≈ 53,739 PPM.',
  },
  {
    question: 'Can I use a pulse per mile calculator for different tire sizes?',
    answer:
      'Yes—change tire diameter (and units) to estimate how PPM expectations shift with tire swaps.',
  },
  {
    question: 'Can I calculate PPM without knowing the axle ratio?',
    answer:
      'Not with this formula. You can still compute wheel revolutions per mile from diameter alone.',
  },
  {
    question: 'Do all vehicle speed sensors use the same PPM formula?',
    answer:
      'No. Mounting location, tooth counting (rising edge vs both edges), and electronic scaling can require a different relationship.',
  },
  {
    question: 'Does PPM change with vehicle speed?',
    answer:
      'PPM is pulses per mile—a distance-based calibration. Instantaneous pulse rate (Hz) changes with speed; PPM itself is not mph.',
  },
  {
    question: 'How do I calculate vehicle speed from sensor pulse frequency?',
    answer:
      'mph ≈ Hz × 3600 ÷ PPM when PPM is the calibrated pulses-per-mile constant.',
  },
  {
    question: 'Is wheel RPM the same as wheel rotations per mile?',
    answer:
      'No. Rotations per mile is distance-based. Wheel RPM is revolutions per minute at a given speed.',
  },
  {
    question: 'What is the difference between a wheel-mounted and transmission-mounted speed sensor?',
    answer:
      'A wheel-mounted sensor tracks that wheel’s rotation (often without axle ratio). A transmission/output-shaft sensor may include gearing that involves axle ratio.',
  },
  {
    question: 'How accurate is a pulse per mile calculator?',
    answer:
      'It is as accurate as the diameter, axle, tooth, and mounting assumptions. Real rolling circumference and OEM scaling often differ slightly.',
  },
  {
    question: 'Why is rolling circumference important?',
    answer:
      'Vehicles travel one rolling circumference per revolution. Nominal diameter × π is an approximation that ignores load, inflation, and wear.',
  },
];
