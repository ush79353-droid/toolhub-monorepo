import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GLOVE_SIZE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Glove Size Calculator' },
  { id: 'what', label: 'What Is a Glove Size Calculator?' },
  { id: 'how', label: 'How Does the Glove Size Calculator Work?' },
  { id: 'measure-size', label: 'How to Measure Glove Size' },
  { id: 'circ', label: 'How to Measure Hand Circumference' },
  { id: 'where', label: 'Where Should You Measure Your Hand?' },
  { id: 'no-tape', label: 'How to Measure Without a Measuring Tape' },
  { id: 'determine', label: 'How to Determine Your Glove Size' },
  { id: 'men', label: "Men's Glove Size Chart" },
  { id: 'women', label: "Women's Glove Size Chart" },
  { id: 'numeric', label: 'Understanding Numeric Glove Sizes' },
  { id: 'alpha', label: 'Understanding XS–XXL' },
  { id: 'convert', label: 'How to Convert Circumference Into Glove Size' },
  { id: 'units', label: 'Glove Sizes in Inches and Centimeters' },
  { id: 'reverse', label: 'How to Convert Glove Size to Hand Measurement' },
  { id: 'fit', label: 'How to Choose the Correct Glove Fit' },
  { id: 'tight', label: 'How Tight Should Gloves Fit?' },
  { id: 'between', label: 'Should You Size Up or Down Between Sizes?' },
  { id: 'material', label: 'Does Glove Material Affect Sizing?' },
  { id: 'leather', label: 'Leather Glove Sizing' },
  { id: 'winter', label: 'Winter Glove Sizing' },
  { id: 'work', label: 'Work Glove Sizing' },
  { id: 'moto', label: 'Motorcycle Glove Sizing' },
  { id: 'cycle', label: 'Cycling Glove Sizing' },
  { id: 'disp', label: 'Disposable Glove Sizing' },
  { id: 'sports', label: 'Sports Glove Sizing' },
  { id: 'kids', label: "Children's Glove Sizing" },
  { id: 'mistakes', label: 'Common Glove Measurement Mistakes' },
  { id: 'brands', label: 'Why Glove Sizes Differ Between Brands' },
  { id: 'online', label: 'Tips for Buying Gloves Online' },
  { id: 'limits', label: 'Glove Size Calculator Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gs-faq', label: 'Frequently Asked Questions' },
];

export const GLOVE_SIZE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I measure my glove size?',
    answer:
      'Measure palm circumference below the knuckles (no thumb), convert to cm if needed, then match a size chart for the product type.',
  },
  {
    question: 'What is my glove size?',
    answer:
      'It depends on your circumference and the brand chart. This tool gives an illustrative estimate.',
  },
  {
    question: 'How do I measure hand circumference?',
    answer:
      'Wrap a soft tape around the widest part of the palm below the knuckles, excluding the thumb.',
  },
  {
    question: 'What is the average glove size?',
    answer:
      'Averages vary by population. Many adults fall near M–L on retail charts — measure rather than assume.',
  },
  {
    question: 'What does size 7 mean in gloves?',
    answer:
      'On this chart, numeric 7 pairs with men/unisex XS or women M — brands differ.',
  },
  {
    question: 'What does size 8 mean in gloves?',
    answer: 'On this chart, numeric 8 pairs with men/unisex S or women XL.',
  },
  {
    question: 'What does size 9 mean in gloves?',
    answer: 'On this chart, numeric 9 pairs with men/unisex M.',
  },
  {
    question: 'What is a medium glove size?',
    answer:
      'Letter M on the selected chart — men/unisex M is about 21–23 cm here; women M is about 18–19.5 cm.',
  },
  {
    question: 'What is a large glove size?',
    answer:
      'Letter L — men/unisex L ≈ 23–25 cm; women L ≈ 19.5–21 cm on this chart.',
  },
  {
    question: 'What is the difference between men\'s and women\'s glove sizes?',
    answer:
      'Charts use different circumference ranges for the same letter. Style selects a convention, not a requirement.',
  },
  {
    question: 'How do I convert inches to glove size?',
    answer: 'Convert inches to cm (×2.54), then look up the chart.',
  },
  {
    question: 'How do I convert centimeters to glove size?',
    answer: 'Match centimeters directly to the chart ranges.',
  },
  {
    question: 'How do I choose a glove size without measuring tape?',
    answer:
      'Use a string around the palm, mark it, then measure the string with a ruler.',
  },
  {
    question: 'Should gloves fit tightly or loosely?',
    answer:
      'Depends on use: dress leather may be snug; winter/work gloves often need more room and mobility.',
  },
  {
    question: 'Should I size up if I am between sizes?',
    answer:
      'Often yes for insulated or layered gloves; check material stretch and brand advice.',
  },
  {
    question: 'Do leather gloves stretch?',
    answer: 'Many leather gloves soften and stretch slightly with wear.',
  },
  {
    question: 'How should winter gloves fit?',
    answer:
      'Allow room for insulation and circulation — follow the brand winter chart when available.',
  },
  {
    question: 'How should work gloves fit?',
    answer:
      'Secure enough for grip and safety without restricting blood flow — follow PPE manufacturer charts.',
  },
  {
    question: 'How should motorcycle gloves fit?',
    answer:
      'Snug for control with full finger coverage — use the bike-glove brand chart.',
  },
  {
    question: 'How should cycling gloves fit?',
    answer: 'Close for pad placement and bar feel; stretch fabrics are common.',
  },
  {
    question: 'How do I measure my dominant hand?',
    answer: 'Use the same palm-circumference method on the hand you write with.',
  },
  {
    question: 'Should I measure both hands?',
    answer: 'Yes if they differ — size for the larger hand.',
  },
  {
    question: 'Does finger length affect glove size?',
    answer:
      'Circumference charts ignore finger length; some brands publish separate finger measures.',
  },
  {
    question: 'Does palm width affect glove size?',
    answer: 'Palm circumference is the usual proxy for width in alpha charts.',
  },
  {
    question: 'Are glove sizes universal?',
    answer: 'No — always check the product chart.',
  },
  {
    question: 'Why do glove sizes vary by manufacturer?',
    answer: 'Different lasts, ease, materials, and grading rules.',
  },
  {
    question: 'What glove size should I buy online?',
    answer:
      'Measure, compare the seller chart, read fit reviews, and check returns.',
  },
  {
    question: 'How do I measure glove size for women?',
    answer: 'Same measurement method; use the women\'s chart when shopping that line.',
  },
  {
    question: 'How do I measure glove size for men?',
    answer: 'Same method; use the men/unisex chart when that is the product chart.',
  },
  {
    question: 'Can I use hand circumference to find glove size?',
    answer: 'Yes — it is the most common body measure for glove charts.',
  },
  {
    question: 'What if my hand measurement falls between two sizes?',
    answer:
      'Check brand guidance; consider material stretch and whether you need room for liners.',
  },
  {
    question: 'Can I convert glove size to inches?',
    answer: 'Yes via the chart range converted with 1 in = 2.54 cm.',
  },
  {
    question: 'Can I convert glove size to centimeters?',
    answer: 'Yes — reverse lookup shows the chart min/max in cm.',
  },
  {
    question: 'How accurate is a glove size calculator?',
    answer:
      'Only as accurate as its chart and your measurement. Brand charts can differ.',
  },
  {
    question: 'Are disposable glove sizes the same as winter glove sizes?',
    answer: 'Often not — disposable medical gloves use their own charts.',
  },
  {
    question: 'How do I choose gloves for protective work?',
    answer:
      'Follow the PPE manufacturer sizing and safety instructions — do not rely only on a generic chart.',
  },
];
