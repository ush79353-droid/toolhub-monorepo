import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Speedometer Gear Calculator' },
  { id: 'what-gear', label: 'What Is a Speedometer Gear?' },
  { id: 'how-mech', label: 'How Mechanical Speedometers Work' },
  { id: 'drive-vs-driven', label: 'Driving vs Driven Gear' },
  { id: 'rev-mi', label: 'Tire Revolutions per Mile' },
  { id: 'calc-rev', label: 'How to Calculate Revolutions' },
  { id: 'axle', label: 'What Is Axle Ratio?' },
  { id: 'ratio-formula', label: 'Speedometer Gear Ratio Formula' },
  { id: 'teeth-formula', label: 'Driven Gear Tooth Count' },
  { id: 'how-calc', label: 'How to Calculate Gear Teeth' },
  { id: 'example', label: 'Worked Example' },
  { id: 'tire-size', label: 'Tire Size and Accuracy' },
  { id: 'axle-effect', label: 'Axle Ratio Effects' },
  { id: 'why-matter', label: 'Why Tooth Count Matters' },
  { id: 'choose', label: 'Choosing the Correct Gear' },
  { id: 'wrong-gear', label: 'Wrong Gear Effects' },
  { id: 'mech-vs-elec', label: 'Mechanical vs Electronic' },
  { id: 'limits', label: 'Limitations' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'sg-faq', label: 'Frequently Asked Questions' },
];

export const SG_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a speedometer?',
    answer:
      'An instrument that indicates vehicle road speed. Mechanical units use a cable; modern vehicles often use electronic sensors.',
  },
  {
    question: 'What is a speedometer gear?',
    answer:
      'A pair of gears (driving and driven) that scale transmission output rotation for the speedometer cable or sensor drive.',
  },
  {
    question: 'How does a mechanical speedometer work?',
    answer:
      'Transmission output turns a drive gear; the driven gear spins a cable; the cable turns the speedometer mechanism calibrated in cable revolutions per mile.',
  },
  {
    question: 'What is a driving speedometer gear?',
    answer:
      'The gear turned by the transmission (or adapter). Its tooth count is Tg in Td = A×R×Tg/C.',
  },
  {
    question: 'What is a driven speedometer gear?',
    answer:
      'The mating gear that drives the speedometer cable. Its tooth count is what this calculator estimates.',
  },
  {
    question: 'What is a speedometer gear ratio?',
    answer: 'G = A×R/C — the required driven-to-driving tooth ratio for calibration C.',
  },
  {
    question: 'How do I calculate speedometer gear teeth?',
    answer:
      'Td = A×R×Tg/C. With C=1000, Td = A×R×Tg/1000. Round to the nearest whole tooth and verify parts fit.',
  },
  {
    question: 'How do I calculate tire revolutions per mile?',
    answer:
      'This tool uses the practical estimate R = 20168/D with D in inches. Ideal circles use 63360/(πD); measured OEM values are often better.',
  },
  {
    question: 'What is the formula for speedometer gear ratio?',
    answer: 'G = (axle ratio × tire rev/mi) ÷ cable calibration (often 1000).',
  },
  {
    question: 'What is axle ratio?',
    answer:
      'Final-drive ratio: roughly how many driveshaft turns occur per wheel turn (e.g. 3.73:1).',
  },
  {
    question: 'How does axle ratio affect speedometer calibration?',
    answer:
      'A numerically higher axle ratio increases shaft revolutions per mile, raising the required driven/driving tooth ratio.',
  },
  {
    question: 'How does tire diameter affect speedometer readings?',
    answer:
      'Larger tires reduce revolutions per mile, which can make the speedometer read low unless gearing or electronics are corrected.',
  },
  {
    question: 'What happens when I install larger tires?',
    answer:
      'Fewer tire revolutions per mile; indicated speed may be lower than actual if unchanged. Recalculate driven gear or recalibrate electronics.',
  },
  {
    question: 'What happens when I install smaller tires?',
    answer:
      'More revolutions per mile; indicated speed may read high. Adjust gearing or calibration accordingly.',
  },
  {
    question: 'How do I correct a speedometer after changing tires?',
    answer:
      'For mechanical systems, select an appropriate driven gear (or adapter). Electronic systems usually need a relearn or programming procedure.',
  },
  {
    question: 'How do I correct a speedometer after changing axle gears?',
    answer:
      'Update the mechanical gear combination for the new axle ratio, or reprogram the electronic speedometer/VSS calibration.',
  },
  {
    question: 'How many teeth should a speedometer driven gear have?',
    answer:
      'Whatever the formula yields after rounding — commonly near 20 for the 30 in / 3.73 / 8-tooth example — if that part exists for your transmission.',
  },
  {
    question: 'Can speedometer gears have fractional teeth?',
    answer: 'No. Physical gears need whole teeth; the calculator shows theory then rounds.',
  },
  {
    question: 'Should I round speedometer gear teeth up or down?',
    answer:
      'Use nearest integer unless OEM charts specify otherwise, then check availability and indicated-speed error.',
  },
  {
    question: 'What happens if I use the wrong driven gear?',
    answer:
      'The speedometer (and often odometer) will read high or low relative to true road speed and distance.',
  },
  {
    question: 'Why does my speedometer read too fast?',
    answer:
      'Possible causes: smaller tires than calibrated, wrong gear teeth, or electronic calibration mismatch.',
  },
  {
    question: 'Why does my speedometer read too slow?',
    answer:
      'Larger tires, wrong driven/driving combination, or outdated calibration are common causes.',
  },
  {
    question: 'What is tire rolling circumference?',
    answer:
      'Distance traveled per wheel revolution under load — often less than π×nominal diameter.',
  },
  {
    question: 'What is the difference between tire diameter and rolling diameter?',
    answer:
      'Nominal diameter is the geometric size; rolling (effective) diameter reflects load and deflection.',
  },
  {
    question: 'How do I measure tire diameter?',
    answer:
      'Measure overall height of the mounted tire, or use size markings / OEM rev/mi data when available.',
  },
  {
    question: 'Can I use tire size markings to calculate diameter?',
    answer:
      'Yes approximately (section width × aspect × 2 + rim diameter), but measured or OEM rev/mi is better for gear selection.',
  },
  {
    question: 'Are speedometer gears interchangeable?',
    answer:
      'Only within matching transmission families and spline/adapter designs — not universally.',
  },
  {
    question: 'Are speedometer gears universal?',
    answer: 'No. Tooth counts and housings are vehicle- and transmission-specific.',
  },
  {
    question: 'Do electronic speedometers use mechanical gears?',
    answer:
      'Often not. Many use a VSS or ABS pulses and software scaling instead of a cable gearset.',
  },
  {
    question: 'Can this calculator be used for every vehicle?',
    answer:
      'No. It targets mechanical cable systems with known calibration C. Electronic vehicles need OEM procedures.',
  },
  {
    question: 'What does 1000 revolutions per mile mean?',
    answer:
      'A common speedometer cable calibration: 1000 cable turns correspond to one mile at correct indication.',
  },
  {
    question: 'How do I find my vehicle\'s speedometer calibration?',
    answer:
      'Service manuals, speedometer head markings, or OEM documentation. Do not assume 1000 for every design.',
  },
  {
    question: 'How do I determine my driving gear tooth count?',
    answer:
      'Count teeth on the installed drive gear or look up the transmission’s drive-gear part options.',
  },
  {
    question: 'How do I determine my axle ratio?',
    answer:
      'Tag on the axle, build sheet, or count ring-and-pinion teeth (ring ÷ pinion).',
  },
  {
    question: 'How accurate is the speedometer gear calculator?',
    answer:
      'As accurate as R, A, Tg, and C. The 20168/D estimate is approximate; measured rev/mi improves it.',
  },
  {
    question: 'How do I calculate speedometer error?',
    answer:
      'Compare indicated vs true speed over a measured course. Tooth-count deviation alone is not the reading error.',
  },
  {
    question: 'Can tire pressure affect speedometer accuracy?',
    answer:
      'Yes—pressure changes rolling radius slightly, altering revolutions per mile.',
  },
  {
    question: 'Does tire wear affect speedometer readings?',
    answer:
      'Worn tires can reduce effective diameter, increasing rev/mi and shifting indicated speed.',
  },
  {
    question: 'What is the difference between driving and driven gear tooth counts?',
    answer:
      'Driving (Tg) is the input gear; driven (Td) is the cable-side gear. Ratio ≈ Td/Tg for the pair.',
  },
  {
    question: 'How do I verify the correct speedometer gear before installation?',
    answer:
      'Match tooth count and part number to the transmission, confirm mesh/fitment, then road-test against GPS or a measured mile.',
  },
];
