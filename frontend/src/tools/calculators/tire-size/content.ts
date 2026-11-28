import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Tire Size Calculator' },
  { id: 'how-sizes', label: 'How Tire Sizes Work' },
  { id: 'numbers', label: 'What the Numbers Mean' },
  { id: 'read-size', label: 'How to Read a Tire Size' },
  { id: 'how-calc', label: 'How to Calculate Tire Size' },
  { id: 'sidewall', label: 'Sidewall Height Formula' },
  { id: 'diameter', label: 'Tire Diameter Formula' },
  { id: 'circ', label: 'Circumference Formula' },
  { id: 'how-use', label: 'How to Use This Calculator' },
  { id: 'compare', label: 'How to Compare Tire Sizes' },
  { id: 'speedo', label: 'Speedometer Effects' },
  { id: 'clearance', label: 'Ground Clearance' },
  { id: 'fuel', label: 'Fuel Economy' },
  { id: 'handling', label: 'Vehicle Handling' },
  { id: 'rim', label: 'Rim Compatibility' },
  { id: 'consider', label: 'What to Consider' },
  { id: 'example', label: 'Comparison Example' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ts-faq', label: 'Frequently Asked Questions' },
];

export const TS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a tire size calculator?',
    answer:
      'A tool that turns sidewall markings into width, sidewall height, overall diameter, circumference, and revolutions per distance, and can compare two sizes.',
  },
  {
    question: 'How do I read tire size numbers?',
    answer:
      'A common metric marking looks like 225/65 R17: width in mm, aspect ratio %, construction letter, and rim diameter in inches.',
  },
  {
    question: 'What does 225/65 R17 mean?',
    answer:
      '225 mm section width, 65% aspect ratio, radial construction, 17-inch rim. Sidewall ≈ 146.25 mm; overall diameter ≈ 724.3 mm.',
  },
  {
    question: 'What does the first number on a tire mean?',
    answer: 'Usually the section width in millimeters for metric passenger tires.',
  },
  {
    question: 'What does the aspect ratio mean?',
    answer:
      'Sidewall height as a percentage of section width. Higher ratios mean taller sidewalls.',
  },
  {
    question: 'What does R mean on a tire?',
    answer: 'Radial construction — plies run radially across the tire.',
  },
  {
    question: 'What does B mean on a tire?',
    answer: 'Bias-belted construction in this calculator’s marking model.',
  },
  {
    question: 'What does D mean on a tire?',
    answer: 'Diagonal (bias-ply) construction.',
  },
  {
    question: 'How do I calculate tire diameter?',
    answer:
      'Convert rim diameter to mm (× 25.4 if inches), add twice the sidewall height: D = R_mm + 2H.',
  },
  {
    question: 'How do I calculate tire sidewall height?',
    answer: 'H = W × A / 100, with W in mm and A the aspect ratio percent.',
  },
  {
    question: 'How do I calculate tire circumference?',
    answer: 'C = π × overall diameter (same length unit).',
  },
  {
    question: 'How do I convert tire diameter to inches?',
    answer: 'Divide millimeters by 25.4.',
  },
  {
    question: 'How do I compare two tire sizes?',
    answer:
      'Enable comparison, enter the replacement size, and review diameter %, clearance estimate, and speedometer correction.',
  },
  {
    question: 'Can I use a different tire size?',
    answer:
      'Possibly, but diameter similarity alone is not enough — check load/speed ratings, rim width, clearance, and OEM guidance.',
  },
  {
    question: 'How does tire size affect the speedometer?',
    answer:
      'If the speedometer assumes the original diameter, a larger tire usually means higher actual speed than indicated (theoretical ratio).',
  },
  {
    question: 'How do I calculate actual speed after changing tires?',
    answer:
      'V_actual = V_indicated × (D_new / D_original) using theoretical diameters.',
  },
  {
    question: 'Does a bigger tire increase ground clearance?',
    answer:
      'Theoretically about half the diameter change, assuming only the tire changes. Real clearance also depends on suspension and load.',
  },
  {
    question: 'Does a wider tire affect fuel economy?',
    answer:
      'Wider tires can raise rolling resistance and drag; effects vary and this calculator does not estimate fuel use.',
  },
  {
    question: 'What happens if I install larger tires?',
    answer:
      'Overall diameter and gearing feel can change; speedometer may read low; rubbing risk increases if clearance is tight.',
  },
  {
    question: 'What happens if I install smaller tires?',
    answer:
      'Diameter shrinks; indicated speed may exceed actual; gearing may feel shorter; load capacity must still be adequate.',
  },
  {
    question: 'What is the difference between tire width and diameter?',
    answer:
      'Width is section width across the tread/sidewall; diameter is overall height of the inflated tire on the rim.',
  },
  {
    question: 'How do I calculate tire revolutions per mile?',
    answer: 'Rev/mi = 1,609,344 / circumference_mm (theoretical).',
  },
  {
    question: 'How do I calculate tire revolutions per kilometer?',
    answer: 'Rev/km = 1,000,000 / circumference_mm (theoretical).',
  },
  {
    question: 'What is the load index on a tire?',
    answer:
      'A code related to load capacity. This tool can display the index but does not map it to kilograms without a standards table.',
  },
  {
    question: 'What is a tire speed rating?',
    answer:
      'A letter associated with a speed category. Shown here as a marking only — not a claimed safe speed.',
  },
  {
    question: 'How much tire diameter difference is acceptable?',
    answer:
      'Many guides discuss ~3% as a rough discussion band, but it is not a universal approval limit. Follow your vehicle maker.',
  },
  {
    question: 'Can I change tire width without changing the rim?',
    answer:
      'Sometimes within the rim’s approved width range. Check rim width charts and vehicle clearance.',
  },
  {
    question: 'Can different tire sizes have the same diameter?',
    answer:
      'Yes — different width/aspect/rim combinations can yield similar overall diameters (plus-sizing).',
  },
  {
    question: 'How do I find my original tire size?',
    answer:
      'Read the sidewall, the door jamb placard, or the owner’s manual for the OEM size.',
  },
  {
    question: 'How does tire size affect vehicle handling?',
    answer:
      'Shorter sidewalls often feel sharper; wider tires can change grip and aquaplaning behavior. Results vary by vehicle.',
  },
  {
    question: 'Can I install a different aspect ratio?',
    answer:
      'Yes if the overall package still fits and ratings match. Diameter and speedometer effects should be checked.',
  },
  {
    question: 'How do I calculate tire height from tire code?',
    answer:
      'Compute sidewall H = W×A/100, convert rim to mm, then D = R_mm + 2H.',
  },
  {
    question: 'What is the difference between radial and bias-ply tires?',
    answer:
      'Radial (R) plies run across the tire; diagonal/bias (D) plies run at angles. Construction affects ride and marking letter.',
  },
  {
    question: 'Does tire pressure change actual tire dimensions?',
    answer:
      'Yes — inflation and load change the rolling radius. This calculator uses unloaded theoretical geometry.',
  },
  {
    question: 'How does tread wear affect tire circumference?',
    answer:
      'Worn tread shortens effective radius slightly, so revolutions per distance can rise versus a new tire.',
  },
  {
    question: 'Is a tire size calculator accurate?',
    answer:
      'It is accurate for the geometric formulas used. Real rolling circumference differs with load, pressure, wear, and brand.',
  },
  {
    question: 'What does a tire size of 205/55 R16 mean?',
    answer:
      '205 mm width, 55% aspect, radial, 16-inch rim → sidewall 112.75 mm, diameter about 631.9 mm.',
  },
  {
    question: 'Can I use different tires on the front and rear?',
    answer:
      'Some vehicles allow staggered setups; ABS/ESP and drivetrain rules may restrict circumference mismatch. Check OEM guidance.',
  },
  {
    question: 'How do I know if a tire fits my vehicle?',
    answer:
      'Confirm rim diameter/width, load and speed ratings, clearance, and the vehicle placard — not diameter alone.',
  },
  {
    question: 'Should I follow the vehicle manufacturer’s recommended tire size?',
    answer:
      'Yes as the baseline for load, speed rating, and calibration. Deviations need careful verification.',
  },
];
