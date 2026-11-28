import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const JEANS_SIZE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Jeans Size Calculator' },
  { id: 'what', label: 'What Is a Jeans Size Calculator?' },
  { id: 'how', label: 'How Does a Jeans Size Calculator Work?' },
  { id: 'use', label: 'How to Use the Jeans Size Calculator' },
  { id: 'measure', label: 'How to Measure Your Jeans Size' },
  { id: 'waist', label: 'How to Measure Your Waist for Jeans' },
  { id: 'inseam', label: 'How to Measure Jeans Inseam Length' },
  { id: 'existing', label: 'How to Measure an Existing Pair of Jeans' },
  { id: 'body-vs', label: 'Body Waist vs. Jeans Waistband Measurement' },
  { id: 'wl', label: 'What Do W and L Mean in Jeans?' },
  { id: 'calc-w', label: 'How to Calculate Jeans Waist Size' },
  { id: 'calc-l', label: 'How to Calculate Jeans Length' },
  { id: 'mens', label: "Men's Jeans Size Chart" },
  { id: 'womens', label: "Women's Jeans Size Chart" },
  { id: 'us', label: 'US Jeans Size Chart' },
  { id: 'uk', label: 'UK Jeans Size Chart' },
  { id: 'eu', label: 'European Jeans Size Chart' },
  { id: 'intl', label: 'International Jeans Size Conversion' },
  { id: 'convert-w', label: "How to Convert Women's Jeans Sizes" },
  { id: 'convert-m', label: "How to Convert Men's Jeans Sizes" },
  { id: 'units', label: 'Jeans Waist Size in Inches and Centimeters' },
  { id: 'what-inseam', label: 'What Is Jeans Inseam?' },
  { id: 'rise', label: 'What Is Jeans Rise?' },
  { id: 'rise-types', label: 'Low-Rise vs. Mid-Rise vs. High-Rise Jeans' },
  { id: 'fits', label: 'Skinny vs. Slim vs. Straight Jeans' },
  { id: 'regular', label: 'Regular vs. Relaxed Fit Jeans' },
  { id: 'choose-l', label: 'How to Choose the Correct Jeans Length' },
  { id: 'height', label: 'Jeans Length Based on Height' },
  { id: 'between', label: 'What to Do When Between Jeans Sizes' },
  { id: 'brands', label: 'How Jeans Sizing Differs Between Brands' },
  { id: 'vanity', label: 'Understanding Vanity Sizing' },
  { id: 'vs-pants', label: 'Jeans Size vs. Pants Size' },
  { id: 'buy', label: 'Tips for Buying Jeans Online' },
  { id: 'mistakes', label: 'Common Jeans Measurement Mistakes' },
  { id: 'fit-check', label: 'How to Tell Whether Jeans Fit Properly' },
  { id: 'limits', label: 'Jeans Size Calculator Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'jeans-faq', label: 'Frequently Asked Questions' },
];

export const JEANS_SIZE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate my jeans size?',
    answer:
      'Measure waist (or flat waistband ×2) and inseam, then match this chart for W and L labels.',
  },
  {
    question: 'What jeans size am I?',
    answer:
      'Enter measurements; e.g. women’s 70 cm waist + ~81 cm inseam → W28 × L32 on this chart.',
  },
  {
    question: 'How do I measure my waist for jeans?',
    answer:
      'Wrap a tape where the waistband will sit — rise changes that position.',
  },
  {
    question: 'How do I measure the inseam of jeans?',
    answer: 'From crotch seam to hem along the inside leg.',
  },
  {
    question: 'What does W32 L30 mean?',
    answer: 'Nominal waist 32 and inseam length 30 (often inches) — not a guarantee of exact garment measures.',
  },
  {
    question: 'What does W34 L32 mean?',
    answer: 'Waist designation 34 with length 32 — confirm on the brand chart.',
  },
  {
    question: 'What is the difference between waist and inseam?',
    answer: 'Waist is the band size; inseam is inside-leg length.',
  },
  {
    question: 'How do I find jeans size from centimeters?',
    answer: 'Convert or enter cm directly — this tool normalizes to cm internally.',
  },
  {
    question: 'How do I convert jeans size from inches to centimeters?',
    answer: 'Multiply inches by 2.54 (or use the unit switcher).',
  },
  {
    question: "What size is 32 in women's jeans?",
    answer: 'On this chart W32 pairs with US ~16 / UK ~20 / EU ~48 — brands vary.',
  },
  {
    question: "What size is 30 in men's jeans?",
    answer: 'Men’s W30 is about 76–79 cm waist on this chart.',
  },
  {
    question: "What does size 10 mean in women's jeans?",
    answer: 'US 10 maps near W29 on this women’s chart.',
  },
  {
    question: 'What is a US size 8 in UK jeans?',
    answer: 'On this chart US 8 ≈ UK 12 (with W28).',
  },
  {
    question: 'How do I convert US jeans size to EU size?',
    answer: 'Use the paired chart row — not a single universal formula.',
  },
  {
    question: 'How do I convert UK jeans size to US size?',
    answer: 'Read the US column on the same women’s chart row.',
  },
  {
    question: "How do men's and women's jeans sizes differ?",
    answer: 'Separate charts and ladders — do not interchange them.',
  },
  {
    question: 'How do I measure jeans that already fit?',
    answer: 'Flat waistband width and inseam; circumference ≈ 2 × flat width.',
  },
  {
    question: 'How do I measure flat waistband width?',
    answer: 'Lay jeans flat and measure side-to-side across the waistband.',
  },
  {
    question: 'Is jeans waist size equal to actual waist circumference?',
    answer: 'Not reliably — vanity sizing and stretch change the relationship.',
  },
  {
    question: 'How do I know if my jeans are too tight?',
    answer: 'Pinching at waist/hips, strained zip, or restricted sitting.',
  },
  {
    question: 'How do I know if my jeans are too loose?',
    answer: 'Gap at the waist or slipping without a belt.',
  },
  {
    question: 'What is the difference between jeans length and inseam?',
    answer: 'Inseam is the measured inside leg; L labels are nominal length codes.',
  },
  {
    question: 'What jeans length should I buy?',
    answer: 'Match inseam to L28–L38 options; between lengths, choose by shoe and break preference.',
  },
  {
    question: 'What does L30 mean in jeans?',
    answer: 'About a 30-inch inseam on many charts.',
  },
  {
    question: 'What does L32 mean in jeans?',
    answer: 'About a 32-inch inseam — a common regular length.',
  },
  {
    question: 'What does L34 mean in jeans?',
    answer: 'About a 34-inch inseam — often for taller wearers.',
  },
  {
    question: 'How do I determine jeans length based on height?',
    answer: 'Height correlates loosely; measure inseam for accuracy.',
  },
  {
    question: 'Should I size up or down in jeans?',
    answer: 'Between sizes, size up for stretch comfort or down for a closer non-stretch fit — brand dependent.',
  },
  {
    question: 'What should I do if I fall between jeans sizes?',
    answer: 'This tool lists nearby W and L options with fit notes.',
  },
  {
    question: "Are men's and women's jeans sizes interchangeable?",
    answer: 'No — use the matching chart.',
  },
  {
    question: 'What is vanity sizing?',
    answer: 'When labeled sizes run larger than historical body measures — why brand charts matter.',
  },
  {
    question: 'Why do jeans sizes differ between brands?',
    answer: 'Different blocks, stretch, and labeling conventions.',
  },
  {
    question: 'Do stretch jeans fit differently?',
    answer: 'Yes — elastane changes ease; try-on still wins.',
  },
  {
    question: 'What is the difference between skinny and slim jeans?',
    answer: 'Skinny is closer through the ankle; slim is tapered but less extreme.',
  },
  {
    question: 'What is the difference between regular and relaxed fit?',
    answer: 'Relaxed adds room in seat/thigh versus a balanced regular cut.',
  },
  {
    question: 'Does jeans rise affect waist measurement?',
    answer: 'Yes — measure where the waistband sits for that rise.',
  },
  {
    question: 'What is the difference between body measurements and garment measurements?',
    answer: 'Body is you; garment includes ease and construction — don’t mix them blindly.',
  },
  {
    question: 'Are jeans size calculators accurate?',
    answer: 'Accurate to their charts; real fit still depends on brand and fabric.',
  },
  {
    question: 'Can I calculate jeans size without measuring?',
    answer: 'Not reliably — measuring is required for useful recommendations.',
  },
  {
    question: 'Should I measure with or without clothes?',
    answer: 'Lightweight base layers; avoid bulky outerwear under the tape.',
  },
];
