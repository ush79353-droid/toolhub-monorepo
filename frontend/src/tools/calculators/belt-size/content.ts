import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BELT_SIZE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Belt Size Calculator' },
  { id: 'what', label: 'What Is a Belt Size Calculator?' },
  { id: 'how-know', label: 'How Do I Know What Belt Size to Buy?' },
  { id: 'how-sizes', label: 'How Belt Sizes Work' },
  { id: 'mens-chart', label: "Men's Belt Size Chart" },
  { id: 'womens-chart', label: "Women's Belt Size Chart" },
  { id: 'measure-waist', label: 'How to Measure Waist Circumference' },
  { id: 'measure-belt', label: 'How to Measure an Existing Belt' },
  { id: 'vs-pants', label: 'Belt Size vs. Pants Size' },
  { id: 'numerical', label: 'Numerical Belt Sizes' },
  { id: 'general', label: 'General Belt Sizes' },
  { id: 'dress', label: "Women's Dress Size to Belt Size" },
  { id: 'pants', label: "Men's Pants Size to Belt Size" },
  { id: 'systems', label: 'US vs. UK vs. EU Belt Sizes' },
  { id: 'convert', label: 'How to Convert Belt Sizes' },
  { id: 'choose', label: 'How to Choose the Right Belt Length' },
  { id: 'extra', label: 'How Much Extra Length Should a Belt Have?' },
  { id: 'types', label: 'Types of Belts' },
  { id: 'mistakes', label: 'Common Belt Sizing Mistakes' },
  { id: 'how-use', label: 'How to Use the Belt Size Calculator' },
  { id: 'limits', label: 'Limitations of Belt Size Calculators' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'belt-faq', label: 'Frequently Asked Questions' },
];

export const BELT_SIZE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a belt size calculator?',
    answer:
      'A tool that estimates a recommended nominal belt size from waist circumference, clothing size, an existing belt measurement, or a known numerical or letter size — using documented chart conventions, not a single universal brand standard.',
  },
  {
    question: 'How do I calculate my belt size?',
    answer:
      'Measure where you wear the belt, or use pants/dress labels or an existing belt fastening-to-hole length, then match that value to a chart. For labeled men’s pants waist in inches, a common heuristic is belt ≈ pants + 2 inches.',
  },
  {
    question: 'How do I know what belt size to buy?',
    answer:
      'Prefer measuring at the belt position or measuring a belt you already like from buckle fastening point to the hole you use. Then check the brand’s chart before purchasing.',
  },
  {
    question: 'Is belt size the same as waist size?',
    answer:
      'Not always. Nominal belt size often tracks a labeled pants waist plus a small allowance, while a body-measured circumference may already be the wearing position and should not always get an automatic +2 inches.',
  },
  {
    question: 'What belt size should I buy for a 30-inch waist?',
    answer:
      'If 30 in is a measured belt-wearing circumference, start near a 30 in nominal belt on the chart. If 30 in is a labeled pants waist, a conventional estimate is about 32 in. Brands still vary.',
  },
  {
    question: 'What belt size should I buy for a 32-inch pants size?',
    answer:
      'A common rule of thumb is 34 in (32 + 2). Confirm with the manufacturer chart and preferred hole position.',
  },
  {
    question: 'What belt size should I buy for a 34-inch pants size?',
    answer:
      'A conventional estimate is 36 in. Rise, fabric thickness, and brand grading can shift the best pick.',
  },
  {
    question: 'What belt size should I buy for a 36-inch waist?',
    answer:
      'For a measured 36 in wearing circumference, look near a 36 in belt. For a 36 in pants label, many shoppers start around 38 in.',
  },
  {
    question: 'What is a size 32 belt in centimeters?',
    answer: '32 × 2.54 = 81.28 cm (exact conversion of the inch label).',
  },
  {
    question: 'What is a size 34 belt in centimeters?',
    answer: '34 × 2.54 = 86.36 cm.',
  },
  {
    question: 'How do I convert belt size from inches to centimeters?',
    answer: 'Multiply inches by 2.54. Example: 36 in → 91.44 cm.',
  },
  {
    question: 'How do I measure an existing belt?',
    answer:
      'Measure from the buckle’s fastening point or prong to the hole you normally use — not the full tip-to-tip strap length.',
  },
  {
    question: 'Do I measure a belt from the buckle or the end?',
    answer:
      'From the fastening point at the buckle to the used hole. Measuring from the tip overstates size relative to most brand labels.',
  },
  {
    question: 'What is a nominal belt size?',
    answer:
      'The size printed or marketed by the brand, often matching fastening-point-to-middle-hole length in inches or centimeters — conventions differ by maker.',
  },
  {
    question: 'How much longer should my belt be than my waist?',
    answer:
      'Strap length beyond the fastening hole is not the same as the +2 in pants-label heuristic. You usually want spare holes on either side of your preferred hole.',
  },
  {
    question: 'What is the difference between belt size and pants size?',
    answer:
      'Pants size is a garment label. Belt size is typically the brand’s nominal length. Many inch charts suggest belt ≈ pants waist + about 2 inches for men’s trousers.',
  },
  {
    question: "How do women's belt sizes work?",
    answer:
      'Women’s belts may use inches, centimeters, or letter sizes (XS–XL). Dress numbers map only approximately to waist bands — always check brand charts.',
  },
  {
    question: "How do men's belt sizes work?",
    answer:
      'Men’s belts are often sold in even inch increments and letter sizes. Pants waist labels commonly guide a +2 in estimate.',
  },
  {
    question: "How do I convert women's dress size to belt size?",
    answer:
      'Use a documented dress→waist→belt chart for the sizing system (US, UK, EU, International). Results are approximate ranges, not exact one-to-one sizes.',
  },
  {
    question: "How do I convert men's pants size to belt size?",
    answer:
      'For inch pants labels, B ≈ P + 2 is a common heuristic. Round to the nearest chart size and verify on the brand’s site.',
  },
  {
    question: 'What is a medium belt size?',
    answer:
      'On this calculator’s illustrative men’s chart, M often aligns near 34 in; women’s M near 32 in. Letter bands are not universal.',
  },
  {
    question: 'What is a large belt size?',
    answer:
      'Illustratively, men’s L may span about 36–38 in and women’s L about 34 in on the configured chart — brands differ.',
  },
  {
    question: 'What is an extra-large belt size?',
    answer:
      'XL and larger letter sizes map to higher inch/cm bands on each chart. Confirm the brand’s letter-to-inch table.',
  },
  {
    question: 'Are US and European belt sizes the same?',
    answer:
      'No. Inch labels, centimeter labels, and letter sizes follow different merchandising conventions. Convert length exactly; map clothing systems with charts.',
  },
  {
    question: 'What is an 85 cm belt in inches?',
    answer: '85 ÷ 2.54 ≈ 33.46 in.',
  },
  {
    question: 'What is a 90 cm belt in inches?',
    answer: '90 ÷ 2.54 ≈ 35.43 in.',
  },
  {
    question: 'What is a 100 cm belt in inches?',
    answer: '100 ÷ 2.54 ≈ 39.37 in.',
  },
  {
    question: 'Should I size up or down when buying a belt?',
    answer:
      'Prefer a size that leaves holes on both sides of your usual fastening. If between sizes, many shoppers choose the larger belt for clothing layers.',
  },
  {
    question: 'How tight should a belt fit?',
    answer:
      'Comfortable enough to hold trousers without digging in. Preferred hole should not be the first or last if you can avoid it.',
  },
  {
    question: 'Which belt hole should I use?',
    answer:
      'Ideally a middle hole so you can loosen or tighten with clothing changes. Measure to that hole when sizing from an existing belt.',
  },
  {
    question: 'How many holes does a standard belt have?',
    answer:
      'Often five, spaced about an inch apart, but designs vary widely.',
  },
  {
    question: 'Can I use a belt-size chart for any brand?',
    answer:
      'Use charts as a starting point only. Always verify against the specific brand’s size guide.',
  },
  {
    question: 'Are leather and fabric belts sized differently?',
    answer:
      'Materials stretch and buckle styles differ, so the same nominal size can feel different. Measure fastening-to-hole when possible.',
  },
  {
    question: 'How do adjustable belts work?',
    answer:
      'Many use micro-adjust tracks or slides instead of fixed holes. Still compare usable fastening length to your wearing circumference.',
  },
  {
    question: 'How accurate is a belt size calculator?',
    answer:
      'Accuracy is limited by chart assumptions and brand grading. Exact unit conversion is precise; clothing-size mappings are approximate.',
  },
];
