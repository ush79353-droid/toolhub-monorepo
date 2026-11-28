import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CURTAIN_SIZE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Curtain Size Calculator' },
  { id: 'what-calc', label: 'What Is a Curtain Size Calculator?' },
  { id: 'measure', label: 'How to Measure Your Window for Curtains' },
  { id: 'measure-w', label: 'How to Measure Window Width' },
  { id: 'measure-h', label: 'How to Measure Window Height' },
  { id: 'choose-len', label: 'How to Choose the Right Curtain Length' },
  { id: 'types-len', label: 'Different Types of Curtain Lengths' },
  { id: 'sill', label: 'What Are Sill-Length Curtains?' },
  { id: 'cafe', label: 'What Are Café Curtains?' },
  { id: 'extra', label: 'What Are Extra-Long Curtains?' },
  { id: 'calc-len', label: 'How to Calculate Curtain Length' },
  { id: 'calc-w', label: 'How to Calculate Curtain Width' },
  { id: 'fullness', label: 'What Is Curtain Fullness?' },
  { id: 'fullness-types', label: 'Standard vs Deluxe vs Ultra Fullness' },
  { id: 'choose-f', label: 'How to Choose the Right Fullness Ratio' },
  { id: 'how-wide', label: 'How Wide Should Curtains Be?' },
  { id: 'how-long', label: 'How Long Should Curtains Be?' },
  { id: 'panels', label: 'How Many Curtain Panels Do I Need?' },
  { id: 'per-panel', label: 'How to Calculate Curtain Width Per Panel' },
  { id: 'rod-ext', label: 'How Far Should Curtain Rods Extend?' },
  { id: 'rod-high', label: 'How High Should Curtain Rods Be Installed?' },
  { id: 'floor', label: 'How to Measure Floor-Length Curtains' },
  { id: 'living', label: 'Curtains for a Living Room' },
  { id: 'bedroom', label: 'Curtains for a Bedroom' },
  { id: 'kitchen', label: 'Curtains for a Kitchen' },
  { id: 'cafe-m', label: 'How to Measure Café Curtains' },
  { id: 'window-types', label: 'Curtain Size for Different Window Types' },
  { id: 'common', label: 'Common Curtain Sizes' },
  { id: 'examples', label: 'Curtain Size Calculation Examples' },
  { id: 'mistakes', label: 'Standard Curtain Measurement Mistakes' },
  { id: 'tips', label: 'Practical Tips for Choosing Curtains' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cs-faq', label: 'Frequently Asked Questions' },
];

export const CURTAIN_SIZE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate curtain size?',
    answer:
      'Rod width = window + 2× extension. Total flat width = rod × fullness. Length depends on sill, café, or floor-length formulas.',
  },
  {
    question: 'How do I measure window width for curtains?',
    answer: 'Measure horizontally across the window opening or frame edge to edge.',
  },
  {
    question: 'How do I measure window height for curtains?',
    answer:
      'Measure from the top of the opening to the sill. Curtain drop also depends on rod height and style.',
  },
  {
    question: 'How wide should curtains be?',
    answer:
      'Combined flat finished width ≈ effective rod width × fullness (often 1.5–2.5×).',
  },
  {
    question: 'How long should curtains be?',
    answer:
      'Sill: window + mount ± below sill. Café: fraction of height. Floor: rod-to-floor − clearance + puddle.',
  },
  {
    question: 'How much wider than the window should curtains be?',
    answer:
      'Rod often extends past each side; then multiply that rod by fullness for fabric flat width.',
  },
  {
    question: 'What is standard curtain fullness?',
    answer: 'This tool uses 1.5× as a standard starting multiplier.',
  },
  {
    question: 'What does 2x curtain fullness mean?',
    answer: 'Flat finished curtain width totals about twice the effective rod width.',
  },
  {
    question: 'What is deluxe curtain fullness?',
    answer: 'This tool uses 2.0× as deluxe.',
  },
  {
    question: 'What is ultra curtain fullness?',
    answer: 'This tool uses 2.5× as ultra.',
  },
  {
    question: 'How do I calculate curtain width?',
    answer: 'Wc = (W + 2E) × F.',
  },
  {
    question: 'How do I calculate curtain length?',
    answer:
      'Use the formula for your style — sill, café coverage, or floor reference height.',
  },
  {
    question: 'How many curtain panels do I need?',
    answer: 'Two is common; one or more also work. Split total width by panel count.',
  },
  {
    question: 'How wide should each curtain panel be?',
    answer: 'Wp = total flat width ÷ number of panels.',
  },
  {
    question: 'Should curtains touch the floor?',
    answer:
      'Preference: kiss, slight break, or puddle. Set clearance and puddle in advanced settings.',
  },
  {
    question: 'Should curtains hang below the window sill?',
    answer: 'Optional — use extra length below sill for sill-style curtains.',
  },
  {
    question: 'What are sill-length curtains?',
    answer: 'Curtains that end near the sill — common in kitchens and smaller windows.',
  },
  {
    question: 'What are café curtains?',
    answer: 'Curtains covering part of the window, often the lower half.',
  },
  {
    question: 'What are extra-long curtains?',
    answer: 'Floor-length or puddled curtains — need rod height above floor.',
  },
  {
    question: 'How high should I install a curtain rod?',
    answer:
      'Often several centimeters above the frame; this tool models that as mounting height for sill length.',
  },
  {
    question: 'How far should curtain rods extend past a window?',
    answer: 'Commonly 10–20 cm per side so open curtains clear more glass — adjustable here.',
  },
  {
    question: 'What curtain size works for a 100 cm wide window?',
    answer:
      'With 15 cm extension and 2× fullness: rod 130 cm → about 260 cm total flat width.',
  },
  {
    question: 'What curtain size works for a 150 cm wide window?',
    answer:
      'With 15 cm extension and 2× fullness: rod 180 cm → about 360 cm total flat width.',
  },
  {
    question: 'What curtain size works for a 200 cm wide window?',
    answer:
      'With 15 cm extension and 2× fullness: rod 230 cm → about 460 cm total flat width.',
  },
  {
    question: 'How wide should curtains be for an 84-inch window?',
    answer: 'Convert to your unit, add extensions, multiply by fullness.',
  },
  {
    question: 'What is the correct curtain length for a bedroom?',
    answer: 'Often floor-length; measure rod-to-floor rather than glass alone.',
  },
  {
    question: 'What is the correct curtain length for a living room?',
    answer: 'Often floor-length or puddle; style and furniture clearance matter.',
  },
  {
    question: 'How do I measure curtains for sliding doors?',
    answer:
      'Treat the opening width like a window, extend the rod if desired, and use floor-length formulas.',
  },
  {
    question: 'How do I measure curtains for bay windows?',
    answer:
      'Measure each section or continuous track carefully — this tool is for a single rectangular opening.',
  },
  {
    question: 'How do I choose curtains for short windows?',
    answer: 'Sill or café lengths keep proportions tidy; rods above the frame can add height.',
  },
  {
    question: 'How do I choose curtains for tall windows?',
    answer: 'Use accurate floor height for extra-long styles; avoid guessing room height.',
  },
  {
    question: 'Are curtain measurements the same as fabric measurements?',
    answer:
      'No — these are finished sizes. Cutting adds hems and may need fabric drops (see Curtain Panel Calculator).',
  },
  {
    question: 'What is the difference between curtain width and panel width?',
    answer: 'Total width is all panels combined flat; panel width splits that total.',
  },
  {
    question: 'Can I calculate curtains without a curtain rod?',
    answer:
      'Yes — estimate the planned rod span (window + extensions) even before install.',
  },
  {
    question: 'How accurate is the Curtain Size Calculator?',
    answer:
      'Exact for the formulas and inputs. Real installs vary with hardware and hang style.',
  },
];
