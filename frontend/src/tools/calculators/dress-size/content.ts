import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DRESS_SIZE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Dress Size Calculator' },
  { id: 'what-calc', label: 'What Is a Dress Size Calculator?' },
  { id: 'how-calc', label: 'How to Calculate Your Dress Size' },
  { id: 'what-meas', label: 'What Measurements Are Needed?' },
  { id: 'bust', label: 'How to Measure Your Bust' },
  { id: 'waist', label: 'How to Measure Your Waist' },
  { id: 'hips', label: 'How to Measure Your Hips' },
  { id: 'chart', label: "Women's Dress Size Chart" },
  { id: 'us', label: 'US Dress Size Chart' },
  { id: 'uk', label: 'UK Dress Size Chart' },
  { id: 'eu', label: 'European Dress Size Chart' },
  { id: 'int', label: 'International Dress Size Chart' },
  { id: 'convert', label: 'How to Convert Dress Sizes Between Countries' },
  { id: 'find', label: 'How to Find Your Dress Size Using Measurements' },
  { id: 'mixed', label: 'When Bust, Waist, and Hip Sizes Differ' },
  { id: 'body-vs-garment', label: 'Body vs Garment Measurements' },
  { id: 'stretch', label: 'How Fabric Stretch Affects Dress Size' },
  { id: 'style', label: 'How Dress Style Affects Fit' },
  { id: 'online', label: 'Choosing a Dress Size When Shopping Online' },
  { id: 'solo', label: 'How to Measure Yourself Without Assistance' },
  { id: 'mistakes', label: 'Common Dress Sizing Mistakes' },
  { id: 'between', label: 'How to Choose Between Two Dress Sizes' },
  { id: 'petite', label: 'Petite, Tall, and Regular Dress Sizes' },
  { id: 'plus', label: 'Understanding Plus-Size Dress Charts' },
  { id: 'brand', label: 'How to Read a Brand-Specific Size Chart' },
  { id: 'examples', label: 'Dress Size Calculation Examples' },
  { id: 'tips', label: 'Practical Tips for Choosing a Comfortable Dress' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ds-faq', label: 'Frequently Asked Questions' },
];

export const DRESS_SIZE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate my dress size?',
    answer:
      'Measure bust, waist, and hips, then find the smallest chart size whose maximums accommodate all three. This tool uses an illustrative chart — brands vary.',
  },
  {
    question: 'How do I know what dress size I am?',
    answer:
      'Compare body measurements to a size chart, then confirm with the brand’s garment measurements.',
  },
  {
    question: 'What measurements do I need for dress sizing?',
    answer: 'Usually bust, waist, and hip circumference.',
  },
  {
    question: 'How do I measure my bust?',
    answer:
      'Wrap a soft tape around the fullest part of the bust, level and snug but not tight.',
  },
  {
    question: 'How do I measure my waist?',
    answer:
      'Measure the natural waist — often the narrowest torso point — without sucking in.',
  },
  {
    question: 'How do I measure my hips?',
    answer:
      'Measure around the fullest part of the hips and seat with feet together.',
  },
  {
    question: 'What is the difference between bust and chest measurements?',
    answer:
      'Bust usually means fullest bust circumference for women’s sizing; chest can mean a higher or flatter measure depending on the chart.',
  },
  {
    question: 'How do I convert US dress sizes to UK sizes?',
    answer:
      'Use matching rows on a conversion chart — do not add a fixed number to every size. This tool reads UK from the same chart entry as US.',
  },
  {
    question: 'How do I convert UK dress sizes to EU sizes?',
    answer: 'Read the EU column for the same chart row as the UK size.',
  },
  {
    question: 'How do I convert European dress sizes to US sizes?',
    answer: 'Use the paired US label on the same chart entry — not a universal formula.',
  },
  {
    question: 'What is an international dress size?',
    answer:
      'A letter size (XS–3XL here) paired with numeric charts. Letter bands are not standardized across brands.',
  },
  {
    question: 'What does XS mean in dress sizing?',
    answer: 'Extra small — on this chart it spans US 2–4 ranges.',
  },
  {
    question: 'What does S mean in dress sizing?',
    answer: 'Small — on this chart it spans US 6–8 ranges.',
  },
  {
    question: 'What does M mean in dress sizing?',
    answer: 'Medium — on this chart it spans US 10–12 ranges.',
  },
  {
    question: 'What does L mean in dress sizing?',
    answer: 'Large — on this chart it spans US 14–16 ranges.',
  },
  {
    question: 'What does XL mean in dress sizing?',
    answer: 'Extra large — on this chart it spans US 18–20 ranges.',
  },
  {
    question: 'What does XXL mean in dress sizing?',
    answer: 'Double extra large — on this chart aligned with US 22.',
  },
  {
    question: 'What is a US size 8 in UK sizing?',
    answer: 'On this chart, US 8 pairs with UK 12.',
  },
  {
    question: 'What is a US size 10 in European sizing?',
    answer: 'On this chart, US 10 pairs with EU 42.',
  },
  {
    question: 'What is a UK size 12 in US sizing?',
    answer: 'On this chart, UK 12 pairs with US 8.',
  },
  {
    question: 'Is a US size 2 equivalent to a UK size 6?',
    answer: 'On this illustrative chart, yes. Other brands may differ.',
  },
  {
    question: 'What if my bust and hip measurements indicate different sizes?',
    answer:
      'For a fitted dress, start with the larger size that fits all three maxes; consider stretch, cut, or alterations.',
  },
  {
    question: 'Should I choose a larger dress size if I am between sizes?',
    answer:
      'Often yes for non-stretch fabrics; check ease and return policies.',
  },
  {
    question: 'How accurate is an online dress size calculator?',
    answer:
      'Only as accurate as its chart and your measurements. Brand charts can differ by several centimeters.',
  },
  {
    question: 'Why do dress sizes vary by brand?',
    answer:
      'Vanity sizing, different grade rules, and intended ease change numeric labels.',
  },
  {
    question: 'Are dress sizes the same as body measurements?',
    answer:
      'No — sizes label ranges. Garments also include design ease beyond body size.',
  },
  {
    question: 'How does stretch fabric affect dress size?',
    answer:
      'Stretch can allow a closer chart size; still verify garment measurements.',
  },
  {
    question: 'How should I measure myself for a fitted dress?',
    answer: 'Measure carefully at bust, waist, and hips; prefer the larger chart size if mixed.',
  },
  {
    question: 'How should I measure myself for a loose dress?',
    answer:
      'Same body measures; then prioritize garment ease or a relaxed silhouette over sizing down.',
  },
  {
    question: 'Can I calculate dress size using only waist measurement?',
    answer: 'Not reliably for dresses — bust and hips usually matter too.',
  },
  {
    question: 'Can I calculate dress size using only bust measurement?',
    answer: 'Incomplete for most dresses — use all three when possible.',
  },
  {
    question: 'Are dress sizes standardized internationally?',
    answer: 'No. Always check the brand chart.',
  },
  {
    question: 'How do petite dress sizes work?',
    answer:
      'Petite usually shortens length proportions; circumference may match regular sizes.',
  },
  {
    question: 'How do tall dress sizes work?',
    answer:
      'Tall often lengthens torso and hem; circumference charts may still match regular.',
  },
  {
    question: 'How do plus-size dress charts work?',
    answer:
      'They extend larger circumference ranges — this chart goes to US 24 / 3XL as an illustrative ceiling.',
  },
  {
    question: 'What is the most reliable way to choose a dress size online?',
    answer:
      'Measure yourself, compare to the brand’s garment chart, read reviews for fit, and check return options.',
  },
];
