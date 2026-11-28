import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BIKINI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Bikini Calculator' },
  { id: 'what', label: 'What Is a Bikini Calculator?' },
  { id: 'how-works', label: 'How Does the Bikini Calculator Work?' },
  { id: 'measure', label: 'How to Measure Your Body for a Bikini' },
  { id: 'categories', label: 'Understanding Body Shape Categories' },
  { id: 'hourglass', label: 'What Is an Hourglass Body Shape?' },
  { id: 'hourglass-styles', label: 'Best Bikinis for an Hourglass Shape' },
  { id: 'top-hourglass', label: 'Best Bikinis for a Top Hourglass Shape' },
  { id: 'bottom-hourglass', label: 'Best Bikinis for a Bottom Hourglass Shape' },
  { id: 'spoon', label: 'Best Bikinis for a Spoon Shape' },
  { id: 'triangle', label: 'Best Bikinis for a Triangle Shape' },
  { id: 'inverted', label: 'Best Bikinis for an Inverted Triangle Shape' },
  { id: 'rectangle', label: 'Best Bikinis for a Rectangle Shape' },
  { id: 'tops', label: 'Bikini Tops Explained' },
  { id: 'bottoms', label: 'Bikini Bottoms Explained' },
  { id: 'coverage', label: 'How to Choose Bikini Coverage' },
  { id: 'support', label: 'How to Choose a Supportive Bikini Top' },
  { id: 'choose-bottoms', label: 'How to Choose Bikini Bottoms' },
  { id: 'shape-vs-size', label: 'Body Shape vs. Bikini Size' },
  { id: 'find-size', label: 'How to Find Your Bikini Size' },
  { id: 'fit-problems', label: 'Common Bikini Fit Problems' },
  { id: 'how-use', label: 'How to Use the Bikini Calculator' },
  { id: 'limits', label: 'Bikini Calculator Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bikini-faq', label: 'Frequently Asked Questions' },
];

export const BIKINI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a bikini calculator?',
    answer:
      'A tool that uses bust, waist, high-hip, and hip circumferences to estimate a proportion category and suggest optional bikini styles — not a medical or beauty assessment.',
  },
  {
    question: 'How does a bikini calculator work?',
    answer:
      'It converts measurements to centimeters, computes ratios and differences, then applies documented heuristic rules to classify proportions and rank style ideas.',
  },
  {
    question: 'How do I find my body shape?',
    answer:
      'Measure the four landmarks carefully, enter them here, and read the heuristic category. Overlapping traits are common — treat the result as a starting point.',
  },
  {
    question: 'How do I measure my bust?',
    answer:
      'Wrap a soft tape around the fullest part of the bust, parallel to the floor, without compressing the tissue.',
  },
  {
    question: 'How do I measure my waist?',
    answer:
      'Measure the natural waist — usually the narrowest torso point — keeping the tape level and snug but not tight.',
  },
  {
    question: 'How do I measure my hips?',
    answer:
      'Measure around the fullest part of the hips and buttocks with feet together and the tape level.',
  },
  {
    question: 'What is a high-hip measurement?',
    answer:
      'A circumference below the waist and above the fullest hip. It helps distinguish some proportion cues such as spoon-like patterns in this model.',
  },
  {
    question: 'Why are four measurements required?',
    answer:
      'Bust, waist, high hip, and full hip together support ratio and difference checks that a single measurement cannot.',
  },
  {
    question: 'What is an hourglass body shape?',
    answer:
      'In this calculator: bust and hip relatively similar with a more defined waist under documented thresholds.',
  },
  {
    question: 'What is a top hourglass shape?',
    answer:
      'Bust reads larger than hips while the waist remains comparatively defined in the heuristic model.',
  },
  {
    question: 'What is a bottom hourglass shape?',
    answer:
      'Hips read larger than bust with a comparatively defined waist — sometimes called pear proportions in styling guides.',
  },
  {
    question: 'What is a spoon body shape?',
    answer:
      'A hip-dominant pattern where the high-hip sits relatively close to the fullest hip under this tool’s spoon rule.',
  },
  {
    question: 'What is a triangle body shape?',
    answer:
      'Hips noticeably fuller than bust without meeting the spoon high-hip cue (or with less waist definition than the hourglass family).',
  },
  {
    question: 'What is an inverted triangle shape?',
    answer:
      'Bust circumference larger than hip circumference here — an imperfect proxy for upper-body width, not true shoulder span.',
  },
  {
    question: 'What is a rectangle body shape?',
    answer:
      'Bust and hip relatively close with a less distinctly defined waist relative to those measurements.',
  },
  {
    question: 'Can I have characteristics of more than one body shape?',
    answer:
      'Yes. Categories overlap. This tool returns mixed proportions when no single rule fits confidently.',
  },
  {
    question: 'Which bikini styles suit an hourglass shape?',
    answer:
      'Many styles can work. Halter, underwire, balconette, and adjustable triangles are common optional tops; high-waisted, classic, high-leg, and tie-side bottoms are frequent picks.',
  },
  {
    question: 'What bikini styles provide more bust support?',
    answer:
      'Underwire, wide straps, secure bands, and sport-style tops generally offer more support than minimal triangle ties.',
  },
  {
    question: 'Which bikini bottoms offer full coverage?',
    answer:
      'High-waisted briefs, boyshorts, and wider-side designs typically cover more than minimal tie-sides.',
  },
  {
    question: 'What are high-waisted bikini bottoms?',
    answer:
      'Bottoms whose rise sits at or above the natural waist, often preferred for coverage and midriff comfort.',
  },
  {
    question: 'What are high-leg bikini bottoms?',
    answer:
      'Cuts that rise higher on the thigh, which can feel freer for movement and change the visual leg line.',
  },
  {
    question: 'What is a bandeau bikini?',
    answer:
      'A strapless or minimally strapped top that wraps the bust; removable straps improve security for swimming.',
  },
  {
    question: 'What is a halter bikini?',
    answer:
      'A top that ties or fastens behind the neck, often providing adjustable lift.',
  },
  {
    question: 'How should a bikini top fit?',
    answer:
      'The band should stay level and secure; cups or triangles should cover as you prefer without digging or gaping. Brand charts matter.',
  },
  {
    question: 'How should bikini bottoms fit?',
    answer:
      'Comfortable through the hips without constant adjusting — coverage is personal preference, not a rule.',
  },
  {
    question: 'Can the calculator determine my bikini size?',
    answer:
      'No. It estimates proportions and style ideas. Use each brand’s size chart for garment size.',
  },
  {
    question: 'Is body shape the same as clothing size?',
    answer:
      'No. Shape describes relative proportions; size is a brand-specific label for garment dimensions.',
  },
  {
    question: 'Are bikini sizes the same across brands?',
    answer:
      'No. Construction and grading vary widely — always check the seller’s chart.',
  },
  {
    question: 'How do I choose bikini coverage?',
    answer:
      'Match activity, comfort, and personal preference. Optional coverage filters in this tool only reorder suggestions.',
  },
  {
    question: 'Which bikini style is good for swimming?',
    answer:
      'Secure bands, reliable straps, and bottoms that stay put — often sport or structured styles.',
  },
  {
    question: 'Which bikini styles are suitable for water sports?',
    answer:
      'Higher support tops and fuller or secure bottoms reduce ride-up and strap slip during movement.',
  },
  {
    question: 'Are adjustable bikini straps better?',
    answer:
      'Adjustability helps many people fine-tune fit; “better” depends on activity and preference.',
  },
  {
    question: 'Can I mix different bikini top and bottom sizes?',
    answer:
      'Yes — mix-and-match separates are common when bust and hip need different sizes.',
  },
  {
    question: 'What if my measurements fall between body-shape categories?',
    answer:
      'That is normal. Use mixed/overlapping results and prioritize comfort, support, and brand fit.',
  },
  {
    question: 'How accurate is a bikini calculator?',
    answer:
      'Ratios are exact for the numbers you enter; categories are approximate heuristics. Brand fit remains separate.',
  },
  {
    question: 'Can body proportions change over time?',
    answer:
      'Yes — training, life stages, and posture can shift circumferences. Remeasure when your fit changes.',
  },
  {
    question: 'Do I need to follow the recommended styles?',
    answer:
      'No. Recommendations are optional ideas. Wear what feels comfortable and suits your style.',
  },
  {
    question: 'What matters most when choosing a bikini?',
    answer:
      'Comfort, support for your activity, coverage you prefer, and a brand size that fits — more than any shape label.',
  },
];
