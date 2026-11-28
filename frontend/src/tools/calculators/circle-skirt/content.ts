import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CIRCLE_SKIRT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Circle Skirt Calculator' },
  { id: 'what', label: 'What Is a Circle Skirt Calculator?' },
  { id: 'how-works', label: 'How Does a Circle Skirt Calculator Work?' },
  { id: 'how-make', label: 'How to Make a Circle Skirt' },
  { id: 'full', label: 'What Is a Full Circle Skirt?' },
  { id: 'three-q', label: 'What Is a 3/4 Circle Skirt?' },
  { id: 'half', label: 'What Is a Half Circle Skirt?' },
  { id: 'quarter', label: 'What Is a Quarter Circle Skirt?' },
  { id: 'math', label: 'Circle Skirt Math Explained' },
  { id: 'radius-formula', label: 'Circle Skirt Radius Formula' },
  { id: 'measure-waist', label: 'How to Measure Your Waist' },
  { id: 'measure-length', label: 'How to Measure Skirt Length' },
  { id: 'calc-r', label: 'How to Calculate Waist Radius' },
  { id: 'calc-outer', label: 'How to Calculate Outer Skirt Radius' },
  { id: 'calc-fabric', label: 'How to Calculate Fabric Length' },
  { id: 'how-much', label: 'How Much Fabric Do You Need?' },
  { id: 'width', label: 'How Fabric Width Affects Cutting' },
  { id: 'layout', label: 'Circle Skirt Pattern Layout' },
  { id: 'compare', label: 'Full Circle vs. Half Circle Skirts' },
  { id: 'chart', label: 'Circle Skirt Measurement Chart' },
  { id: 'seam', label: 'How to Add Seam Allowance' },
  { id: 'hem', label: 'How to Add Hem Allowance' },
  { id: 'cut', label: 'How to Cut a Circle Skirt' },
  { id: 'sew', label: 'How to Sew a Circle Skirt' },
  { id: 'mistakes', label: 'Common Circle Skirt Sewing Mistakes' },
  { id: 'example', label: 'Circle Skirt Calculator Example' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cs-faq', label: 'Frequently Asked Questions' },
];

export const CIRCLE_SKIRT_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate a circle skirt?',
    answer:
      'Choose the circle fraction, measure waist and finished length, then compute R = W/(2πf) and outer radius R+L. Add allowances only for cutting.',
  },
  {
    question: 'How do I calculate the radius of a circle skirt?',
    answer: 'R = W / (2πf), where W is waist circumference and f is the circle fraction.',
  },
  {
    question: 'How do I calculate a full circle skirt?',
    answer: 'Use f = 1 so R = W/(2π). Outer radius is R + skirt length.',
  },
  {
    question: 'How do I calculate a half circle skirt?',
    answer: 'Use f = 0.5 so R = W/π. Outer radius is R + skirt length.',
  },
  {
    question: 'How do I calculate a 3/4 circle skirt?',
    answer: 'Use f = 0.75 so R = W/(1.5π).',
  },
  {
    question: 'How do I calculate a quarter circle skirt?',
    answer: 'Use f = 0.25 so R = 2W/π.',
  },
  {
    question: 'What is the circle skirt formula?',
    answer:
      'Waist arc W = 2πRf. Rearranged: R = W/(2πf). Hem circumference ≈ 2π(R+L)f.',
  },
  {
    question: 'How do I measure my waist for a circle skirt?',
    answer:
      'Measure where the waistband will sit — often natural waist or high hip — with a level tape.',
  },
  {
    question: 'How do I measure the length of a circle skirt?',
    answer:
      'From the waistband position straight down to the desired finished hem (exclude hem allowance).',
  },
  {
    question: 'What is the waist radius of a circle skirt?',
    answer:
      'The distance from the circle center to the waist opening edge used when drafting the pattern.',
  },
  {
    question: 'How do I calculate skirt fabric length?',
    answer:
      'Radial cutting length ≈ L + R + allowances. Purchased yardage also depends on fabric width and layout.',
  },
  {
    question: 'How much fabric is required for a full circle skirt?',
    answer:
      'Often about a diameter of 2(R+L) in both directions for a single piece — more if the fabric is narrow.',
  },
  {
    question: 'How much fabric is required for a half circle skirt?',
    answer:
      'Less than a full circle; folded layouts are common. Still verify width against R+L.',
  },
  {
    question: 'How do I calculate fabric yardage?',
    answer:
      'Convert the needed length along the bolt after checking width. This tool’s fabric check is a simplified warning, not a full marker.',
  },
  {
    question: 'How do I calculate fabric requirements in meters?',
    answer:
      'Compute in cm (or inches), then convert: 1 m = 100 cm. Switch units in the calculator.',
  },
  {
    question: 'What is the difference between a full and half circle skirt?',
    answer:
      'Full uses f=1 (very full); half uses f=0.5 (moderate fullness) and a larger waist radius for the same waist.',
  },
  {
    question: 'What does a 3/4 circle skirt look like?',
    answer:
      'A 270° sector — fuller than half, less fabric than a full circle.',
  },
  {
    question: 'What does a quarter circle skirt look like?',
    answer:
      'A 90° sector with lighter fullness and a relatively large waist radius.',
  },
  {
    question: 'Which circle skirt uses the most fabric?',
    answer:
      'Usually the full circle, assuming similar length and a single-piece layout.',
  },
  {
    question: 'Which circle skirt is easiest to sew?',
    answer:
      'Half or quarter styles are often simpler to cut and handle; “easiest” still depends on closures and hems.',
  },
  {
    question: 'How do I calculate hem circumference?',
    answer: 'C_hem = 2π(R+L)f using the finished outer radius.',
  },
  {
    question: 'How do I add seam allowance?',
    answer:
      'Add it to cutting dimensions (and waist opening edge as needed). Do not bake it into the mathematical waist radius R from W.',
  },
  {
    question: 'How do I add hem allowance?',
    answer:
      'Add extra length beyond finished L when cutting; finish the hem after the bias has settled if needed.',
  },
  {
    question: 'How do I cut a circle skirt from folded fabric?',
    answer:
      'Fold according to the sector (often quarters for full). Mark R and R+L from the center, then cut.',
  },
  {
    question: 'Can I make a circle skirt without a pattern?',
    answer:
      'Yes — draft with radius marks from measurements. A muslin helps verify fit.',
  },
  {
    question: 'Can I make a circle skirt with elastic?',
    answer:
      'Yes — draft the waist for the stretched elastic circumference or use a casing; ease differs from a fitted waistband.',
  },
  {
    question: 'How do I calculate a circle skirt for children?',
    answer:
      'Use the same formulas with the child’s waist and desired length.',
  },
  {
    question: 'Can I calculate circle skirt measurements in inches?',
    answer: 'Yes — select inches (or feet) in the unit selector.',
  },
  {
    question: 'Can I calculate circle skirt measurements in centimeters?',
    answer: 'Yes — centimeters are the default display unit.',
  },
  {
    question: 'How accurate is a circle skirt calculator?',
    answer:
      'Geometry is exact for the inputs. Fabric yield depends on width, grain, seams, and stretch.',
  },
  {
    question: 'Why does my circle skirt waist opening seem too large?',
    answer:
      'Check whether seam allowance was subtracted incorrectly, or whether the waist measure included ease/elastic stretch.',
  },
  {
    question: 'Why does my circle skirt hem become uneven?',
    answer:
      'Bias hang is common — let the skirt hang, then re-level the hem before finishing.',
  },
  {
    question: 'How do I calculate a circle skirt with a zipper?',
    answer:
      'Radius math is unchanged; add seam allowances at the opening and plan the zipper placement.',
  },
  {
    question: 'How do I calculate a circle skirt for a petticoat?',
    answer:
      'Use waist and length as usual; fullness choice (f) sets volume. Multiple tiers are a different construction.',
  },
  {
    question: 'Can I use this calculator for a circular dress skirt?',
    answer:
      'Yes for a circular skirt portion — bodice drafting is separate.',
  },
];
