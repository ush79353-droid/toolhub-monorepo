import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HAT_SIZE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Hat Size Calculator' },
  { id: 'what', label: 'What Is a Hat Size Calculator?' },
  { id: 'how-calc', label: 'How to Calculate Your Hat Size' },
  { id: 'measure', label: 'How to Measure Head Circumference' },
  { id: 'how-use', label: 'How to Use the Hat Size Calculator' },
  { id: 'adult-chart', label: 'Adult Hat Size Chart' },
  { id: 'child-chart', label: "Children's Hat Size Chart" },
  { id: 'intl', label: 'Understanding International Hat Sizes' },
  { id: 'us', label: 'US Hat Size Conversion' },
  { id: 'uk', label: 'UK Hat Size Conversion' },
  { id: 'eu', label: 'European Hat Sizes' },
  { id: 'units', label: 'Hat Size in Inches vs. Centimeters' },
  { id: 'convert', label: 'How to Convert Head Circumference to Hat Size' },
  { id: 'choose', label: 'How to Choose the Right Hat Size' },
  { id: 'between', label: 'What to Do If You Are Between Hat Sizes' },
  { id: 'fit', label: 'How Should a Hat Fit?' },
  { id: 'tight', label: 'How Tight Should a Hat Be?' },
  { id: 'no-tape', label: 'How to Measure Hat Size Without a Measuring Tape' },
  { id: 'string', label: 'How to Measure Hat Size Using String' },
  { id: 'baseball', label: 'How to Measure Your Head for a Baseball Cap' },
  { id: 'fedora', label: 'How to Measure Your Head for a Fedora' },
  { id: 'cowboy', label: 'How to Measure Your Head for a Cowboy Hat' },
  { id: 'bucket', label: 'How to Measure Your Head for a Bucket Hat' },
  { id: 'kids', label: 'How to Measure Hat Size for Children' },
  { id: 'mistakes', label: 'Common Hat Sizing Mistakes' },
  { id: 'material', label: 'How Hat Material Affects Fit' },
  { id: 'adjustable', label: 'Adjustable vs. Fitted Hats' },
  { id: 'shape', label: 'How to Choose a Hat for Different Head Shapes' },
  { id: 'brands', label: 'Why Hat Sizes Differ Between Brands' },
  { id: 'online', label: 'Tips for Buying Hats Online' },
  { id: 'limits', label: 'Hat Size Calculator Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'hat-faq', label: 'Frequently Asked Questions' },
];

export const HAT_SIZE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate my hat size?',
    answer:
      'Measure head circumference and match it to the adult or child chart. This calculator does that automatically.',
  },
  {
    question: 'How do I measure my head for a hat?',
    answer:
      'Wrap a soft tape above the eyebrows and ears, around the fullest part of the head, snug but not tight.',
  },
  {
    question: 'What hat size is 23 inches?',
    answer:
      'About 58.4 cm — near adult L (chart 58–59 cm). Between sizes often recommend the larger row.',
  },
  {
    question: 'What hat size is 22 inches?',
    answer: 'About 55.9 cm — near adult M (56 cm chart: US 7 / UK 6⅞).',
  },
  {
    question: 'What hat size is 58 cm?',
    answer: 'Adult international L, US 7¼, UK 7⅛, EU 58 on this chart.',
  },
  {
    question: 'What hat size is 60 cm?',
    answer: 'Adult international XL, US 7½, UK 7⅜, EU 60.',
  },
  {
    question: 'What is a size 7 hat in centimeters?',
    answer: 'US 7 maps to about 56 cm on this adult chart.',
  },
  {
    question: 'What is a size 7¼ hat in centimeters?',
    answer: 'About 58 cm on this adult chart.',
  },
  {
    question: 'What is the difference between US and UK hat sizes?',
    answer:
      'UK sizes are typically about ⅛ smaller than the paired US size on common charts.',
  },
  {
    question: 'How do European hat sizes work?',
    answer: 'EU sizes usually match head circumference in centimeters.',
  },
  {
    question: 'What is an international hat size?',
    answer: 'Letter sizes such as XS–XXXL mapped from circumference bands.',
  },
  {
    question: 'What does XS mean in hat sizes?',
    answer: 'Extra small — about 52–53 cm on this adult chart.',
  },
  {
    question: 'What does S mean in hat sizes?',
    answer: 'Small — about 54–55 cm.',
  },
  {
    question: 'What does M mean in hat sizes?',
    answer: 'Medium — about 56–57 cm.',
  },
  {
    question: 'What does L mean in hat sizes?',
    answer: 'Large — about 58–59 cm.',
  },
  {
    question: 'What does XL mean in hat sizes?',
    answer: 'Extra large — about 60–61 cm.',
  },
  {
    question: 'What should I do if my head circumference falls between sizes?',
    answer:
      'This tool recommends the next larger chart size. Prefer adjustable hats when unsure.',
  },
  {
    question: 'Should I choose a larger or smaller hat?',
    answer:
      'When between sizes, larger is usually safer — especially for structured/fitted styles.',
  },
  {
    question: 'How tight should a hat fit?',
    answer:
      'Secure without pressure marks or headaches; it should not slide freely.',
  },
  {
    question: 'How do I know if a hat is too small?',
    answer: 'Pain, red marks, or difficulty seating the hat level.',
  },
  {
    question: 'How do I know if a hat is too big?',
    answer: 'It slips, tilts easily, or leaves a large gap at the temples.',
  },
  {
    question: 'How can I measure my head without a tape measure?',
    answer: 'Use non-stretch string, mark the overlap, then measure the string.',
  },
  {
    question: 'Are baseball cap sizes different from hat sizes?',
    answer:
      'Fitted caps often use the same circumference logic; adjustables are more forgiving.',
  },
  {
    question: 'Are fitted hat sizes universal?',
    answer: 'No — brands and crown shapes differ.',
  },
  {
    question: 'Are cowboy hat sizes different?',
    answer: 'Often use the same circumference basis; check the maker chart.',
  },
  {
    question: 'How do I measure for a bucket hat?',
    answer: 'Same head circumference method; many bucket hats are one-size/adjustable.',
  },
  {
    question: "How do I measure a child's head for a hat?",
    answer:
      'Use circumference; age bands are only approximate guides.',
  },
  {
    question: 'What is the average adult hat size?',
    answer: 'Many adults fall near M–L (about 56–59 cm), but averages vary.',
  },
  {
    question: 'Can I convert hat size from inches to centimeters?',
    answer: 'Yes — multiply inches by 2.54 (or use the unit switcher).',
  },
  {
    question: 'Can I convert European hat size to US size?',
    answer: 'Use the chart: EU ≈ cm, then read the paired US fraction.',
  },
  {
    question: 'What is the difference between hat circumference and hat diameter?',
    answer:
      'Circumference is the head measurement used for sizing; diameter is circumference/π (not the retail size itself).',
  },
  {
    question: 'Do hat sizes vary between brands?',
    answer: 'Yes — always confirm with the product chart.',
  },
  {
    question: 'Does hair thickness affect hat fit?',
    answer: 'Yes — thick hair or styles can change effective fit.',
  },
  {
    question: 'Can a hat stretch over time?',
    answer: 'Some materials ease slightly; structured hats stretch less.',
  },
  {
    question: 'How do I find my fitted cap size?',
    answer: 'Measure circumference and match US fractions on the adult chart.',
  },
  {
    question: "What is the best way to measure a baby's hat size?",
    answer: 'Soft tape around the widest part; compare to the child chart.',
  },
  {
    question: 'How much room should a hat have?',
    answer: 'Comfortable snugness — usually a finger under the band at most.',
  },
  {
    question: 'Can I use a string to measure hat circumference?',
    answer: 'Yes, if the string does not stretch.',
  },
  {
    question: 'Is a size 7 hat considered medium?',
    answer: 'On this chart, US 7 pairs with international M (56 cm).',
  },
  {
    question: 'How accurate is the Hat Size Calculator?',
    answer:
      'Accurate to the documented charts. Real fit still depends on brand and style.',
  },
];
