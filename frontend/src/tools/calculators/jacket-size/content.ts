import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const JACKET_SIZE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Jacket Size Calculator' },
  { id: 'what', label: 'What Is a Jacket Size Calculator?' },
  { id: 'how', label: 'How Does a Jacket Size Calculator Work?' },
  { id: 'use', label: 'How to Use the Jacket Size Calculator' },
  { id: 'measure', label: 'How to Measure Jacket Size' },
  { id: 'chest', label: 'How to Measure Your Chest' },
  { id: 'height', label: 'How to Measure Your Height' },
  { id: 'hips', label: 'How to Measure Your Hips' },
  { id: 'mens', label: "Men's Jacket Size Chart" },
  { id: 'womens', label: "Women's Jacket Size Chart" },
  { id: 'eu', label: 'European Jacket Size Chart' },
  { id: 'us', label: 'US Jacket Size Chart' },
  { id: 'uk', label: 'UK Jacket Size Chart' },
  { id: 'intl', label: 'International Jacket Size Conversion' },
  { id: 'us-eu', label: 'How to Convert US Jacket Sizes to EU Sizes' },
  { id: 'uk-us', label: 'How to Convert UK Jacket Sizes to US Sizes' },
  { id: 'by-chest', label: 'Jacket Size Based on Chest Measurement' },
  { id: 'by-height', label: 'Jacket Size Based on Height' },
  { id: 'length', label: 'What Is Jacket Length Classification?' },
  { id: 'srl', label: 'Short vs. Regular vs. Long Jackets' },
  { id: 'choose-fit', label: 'How to Choose the Right Jacket Fit' },
  { id: 'fit-types', label: 'Slim Fit vs. Regular Fit vs. Relaxed Fit' },
  { id: 'room', label: 'How Much Room Should a Jacket Have?' },
  { id: 'vs-shirt', label: 'Jacket Size vs. Shirt Size' },
  { id: 'vs-coat', label: 'Jacket Size vs. Coat Size' },
  { id: 'suit', label: 'How to Measure a Suit Jacket' },
  { id: 'casual', label: 'How to Measure a Casual Jacket' },
  { id: 'existing', label: 'How to Measure an Existing Jacket' },
  { id: 'online', label: 'How to Find Your Jacket Size Without Trying It On' },
  { id: 'mistakes', label: 'Common Jacket Sizing Mistakes' },
  { id: 'buy', label: 'Tips for Buying Jackets Online' },
  { id: 'between', label: 'What to Do When Between Jacket Sizes' },
  { id: 'brands', label: 'Jacket Sizing Differences Between Brands' },
  { id: 'limits', label: 'Jacket Size Calculator Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'jacket-faq', label: 'Frequently Asked Questions' },
];

export const JACKET_SIZE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I figure out what jacket size fits me best?',
    answer:
      'Measure chest circumference (and height for length), then match this calculator’s chart — and confirm with the brand guide.',
  },
  {
    question: 'How do I calculate my jacket size?',
    answer:
      'Normalize chest to cm, find the chart band, and read US/UK, EU, and international equivalents.',
  },
  {
    question: 'How do I measure my chest for a jacket?',
    answer:
      'Wrap a tape around the fullest part of the chest, level across the back, snug but not tight.',
  },
  {
    question: 'How do I measure my height for jacket sizing?',
    answer:
      'Stand barefoot against a wall and measure floor to crown — used here for short/regular/long.',
  },
  {
    question: 'What jacket size am I?',
    answer:
      'Enter your measurements; for example 100 cm chest on the men’s chart → US/UK 40 · EU 50 · M.',
  },
  {
    question: 'What does size 42 mean in US men\'s jacket sizing?',
    answer: 'About 104–109 cm chest on this men’s chart (EU 52 / Int M).',
  },
  {
    question: 'What does size 40 mean in jacket sizing?',
    answer: 'Men’s US/UK 40 ≈ 99–104 cm chest · EU 50 · Int M on this chart.',
  },
  {
    question: 'What size does M correspond to for women\'s jackets?',
    answer: 'On this chart, women’s M spans US 8–10 / EU 40–42 depending on bust band.',
  },
  {
    question: 'What jacket size should I buy for my height?',
    answer:
      'Height mainly chooses short/regular/long; chest still sets the numerical size.',
  },
  {
    question: 'How do I find my European jacket size?',
    answer: 'Use the EU column paired with your chest band on the selected chart.',
  },
  {
    question: 'How do I convert US jacket sizes to EU sizes?',
    answer: 'Use the chart pairs (e.g. men’s US 40 → EU 50) — not a universal formula.',
  },
  {
    question: 'Are UK and US jacket sizes the same?',
    answer: 'On this men’s suit-style chart they share numerical labels; women’s UK differs from US.',
  },
  {
    question: 'How do women\'s jacket sizes differ from men\'s?',
    answer:
      'Separate bust-based charts with different US/UK/EU ladders — do not reuse men’s formulas.',
  },
  {
    question: 'What is the difference between jacket size and chest size?',
    answer:
      'Chest size is your body circumference; jacket size is the chart label mapped from that range.',
  },
  {
    question: 'What is the difference between jacket size and suit size?',
    answer:
      'Suit jackets often use the same chest numbers; trousers and drop are separate.',
  },
  {
    question: 'How do I measure a jacket that already fits?',
    answer:
      'Lay flat and measure across the chest, then ×2 for garment circumference — body charts still differ from garment specs.',
  },
  {
    question: 'Should I size up when buying a jacket?',
    answer:
      'Only for layering or if between sizes; fit preference here is advisory, not an auto size bump.',
  },
  {
    question: 'What should I do if I am between jacket sizes?',
    answer:
      'This tool lists nearby sizes — smaller for closer fit, larger for movement/layering.',
  },
  {
    question: 'What is a regular-fit jacket?',
    answer: 'Standard ease between slim and relaxed — the default starting point.',
  },
  {
    question: 'What is a slim-fit jacket?',
    answer: 'Closer cut with less ease — check shoulders carefully.',
  },
  {
    question: 'What is a relaxed-fit jacket?',
    answer: 'More room for movement and layers — common in casual/outerwear.',
  },
  {
    question: 'What does short, regular, and long mean in jacket sizes?',
    answer:
      'Length grades by height bands (illustrative thresholds in this calculator).',
  },
  {
    question: 'How should a jacket fit around the shoulders?',
    answer: 'Seam should sit at the shoulder edge without collapsing or hanging off.',
  },
  {
    question: 'How much room should a jacket have around the chest?',
    answer: 'Enough to button/zip without pulling; exact ease is brand-specific.',
  },
  {
    question: 'How do I know if my jacket is too small?',
    answer: 'Pulling across the chest, strained buttons, or restricted arm lift.',
  },
  {
    question: 'How do I know if my jacket is too large?',
    answer: 'Shoulders droop, excess fabric folds, or sleeves hang past the wrist.',
  },
  {
    question: 'Is jacket size the same as shirt size?',
    answer: 'No — shirts use neck/sleeve conventions; jackets use chest bands.',
  },
  {
    question: 'Is jacket size the same as coat size?',
    answer: 'Often related, but coats may size up for layering — check the coat chart.',
  },
  {
    question: 'How do I find my suit jacket size?',
    answer: 'Use the men’s chart with chest circumference; add length from height.',
  },
  {
    question: 'What is the most accurate way to measure jacket size?',
    answer: 'Soft tape on the body for chest (and height), then brand try-on or returns.',
  },
  {
    question: 'Can I measure jacket size without a measuring tape?',
    answer: 'Use non-stretch string, then measure the string — less precise.',
  },
  {
    question: 'How accurate are online jacket size calculators?',
    answer:
      'Accurate to their charts only. Real fit still depends on brand and cut.',
  },
  {
    question: 'Do jacket sizes vary by manufacturer?',
    answer: 'Yes — always verify the product size guide.',
  },
  {
    question: 'Should I measure with or without clothes?',
    answer: 'Lightweight base layers; avoid bulky jackets over the tape.',
  },
  {
    question: 'What is the difference between body measurements and garment measurements?',
    answer:
      'Body = you; garment = finished piece including ease — do not mix them blindly.',
  },
  {
    question: 'How do I choose a jacket for layering?',
    answer: 'Prefer the larger of two near sizes or a relaxed/outerwear cut.',
  },
  {
    question: 'How do I measure hip circumference for a long jacket?',
    answer: 'Around the fullest hip; useful when coats skim the hip line.',
  },
  {
    question: 'Can my chest and hip measurements suggest different jacket sizes?',
    answer:
      'Yes — this tool warns on women’s charts when hips map to another size.',
  },
  {
    question: 'What size jacket should I choose for an oversized fit?',
    answer:
      'Start from the chart size, then intentionally size up per the brand’s oversized guide.',
  },
  {
    question: 'Why do jacket sizing charts differ between countries?',
    answer:
      'Different labeling ladders and ease conventions — conversions are approximate.',
  },
];
