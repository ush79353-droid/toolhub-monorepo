import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BRA_SIZE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Bra Size Calculator' },
  { id: 'what', label: 'What Is a Bra Size Calculator?' },
  { id: 'how-works', label: 'How Does a Bra Size Calculator Work?' },
  { id: 'measure-under', label: 'How to Measure Your Underbust' },
  { id: 'measure-bust', label: 'How to Measure Your Bust' },
  { id: 'band', label: 'How to Calculate Bra Band Size' },
  { id: 'cup', label: 'How to Calculate Bra Cup Size' },
  { id: 'letters', label: 'Understanding Bra Size Letters' },
  { id: 'find', label: 'How to Find Your Correct Bra Size' },
  { id: 'charts', label: 'Bra Size Charts by Country' },
  { id: 'us-chart', label: 'US Bra Size Chart' },
  { id: 'uk-chart', label: 'UK Bra Size Chart' },
  { id: 'eu-chart', label: 'European Bra Size Chart' },
  { id: 'au-chart', label: 'Australian Bra Size Chart' },
  { id: 'fr-chart', label: 'French Bra Size Chart' },
  { id: 'convert', label: 'International Bra Size Conversion' },
  { id: 'sister', label: 'What Are Sister Sizes?' },
  { id: 'sister-calc', label: 'How to Calculate Sister Sizes' },
  { id: 'check-fit', label: 'How to Check Whether Your Bra Fits' },
  { id: 'too-small', label: 'Signs Your Bra Is Too Small' },
  { id: 'too-large', label: 'Signs Your Bra Is Too Large' },
  { id: 'band-fit', label: 'How to Check Bra Band Fit' },
  { id: 'cup-fit', label: 'How to Check Bra Cup Fit' },
  { id: 'straps', label: 'How to Adjust Bra Straps' },
  { id: 'styles', label: 'Choosing the Right Bra Style' },
  { id: 'brands', label: 'Why Bra Sizes Differ Between Brands' },
  { id: 'mistakes', label: 'Common Bra Sizing Mistakes' },
  { id: 'limits', label: 'Bra Size Calculator Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bra-faq', label: 'Frequently Asked Questions' },
];

export const BRA_SIZE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate my bra size?',
    answer:
      'Measure underbust and fullest bust, choose a sizing region, then map band and cup with that system’s rules. This tool does that with documented heuristics.',
  },
  {
    question: 'What is my bra size?',
    answer:
      'An estimate combining a band label and cup letter for a chosen market (for example 34C US). Always verify with brand charts and a fit check.',
  },
  {
    question: 'How do I measure my bust?',
    answer:
      'Wrap a soft tape around the fullest part of the bust, level with the floor, without heavy compression.',
  },
  {
    question: 'How do I measure my underbust?',
    answer:
      'Measure snugly around the rib cage directly under the bust, keeping the tape level.',
  },
  {
    question: 'Should I measure in centimeters or inches?',
    answer:
      'Either works. This calculator converts internally (1 in = 2.54 cm) and preserves physical length when you switch units.',
  },
  {
    question: 'What is a bra band size?',
    answer:
      'The number part of a bra size (32, 34, 75, 12…). It relates to underbust circumference via regional rounding rules.',
  },
  {
    question: 'What is a bra cup size?',
    answer:
      'The letter (or double letter) describing cup volume relative to the band in that sizing system.',
  },
  {
    question: 'How are bra cup sizes calculated?',
    answer:
      'Typically from the difference between bust and a band reference. Steps are about one inch (US/UK) or about two centimeters (many metric systems) per cup step in this model.',
  },
  {
    question: 'What does 34C mean?',
    answer:
      'In US/UK labeling, band 34 with cup C — not a universal volume across every brand.',
  },
  {
    question: 'What does 32D mean?',
    answer:
      'Band 32 with cup D. It can be a sister size to 34C in conventional US/UK sister-size logic.',
  },
  {
    question: 'What is the difference between 34B and 34C?',
    answer:
      'Same band; C is roughly one cup step fuller than B relative to that band in the same system.',
  },
  {
    question: 'Is 32DD the same as 34D?',
    answer:
      'They are common sister sizes aiming at similar cup volume with different bands — not identical garments.',
  },
  {
    question: 'What are sister bra sizes?',
    answer:
      'Nearby band/cup pairs that trade one band step for one cup step to keep approximate cup volume.',
  },
  {
    question: 'How do I find my sister size?',
    answer:
      'From a primary size: smaller band + one cup up, or larger band + one cup down, using that region’s cup ladder.',
  },
  {
    question: 'How do I know whether my band is too tight?',
    answer:
      'Painful pressure, inability to breathe comfortably, or red marks that persist may mean trying a larger band (often with a sister cup).',
  },
  {
    question: 'How do I know whether my bra cups are too small?',
    answer:
      'Persistent overflow, underwire sitting on tissue, or a gore that cannot settle may suggest a larger cup or different shape.',
  },
  {
    question: 'Why does my bra band ride up?',
    answer:
      'Often the band is too loose relative to the cups, or the bra has stretched — try a firmer band or a sister size.',
  },
  {
    question: 'Why do my bra straps slip?',
    answer:
      'Strap length, angle, or band support can be off; adjust straps and ensure the band carries most support.',
  },
  {
    question: 'Why do my bra straps dig into my shoulders?',
    answer:
      'Straps may be overtight because the band is too loose — tighten the band fit (or try a sister size) rather than relying on straps alone.',
  },
  {
    question: 'Why do my bra cups gape?',
    answer:
      'Cups may be too large, the wrong shape, or the band may be riding incorrectly. Shape mismatch is common.',
  },
  {
    question: 'Why does my underwire feel uncomfortable?',
    answer:
      'Wire width/shape may not match your root, or size may be off. Different styles fit differently — this is not a medical diagnosis.',
  },
  {
    question: 'Does cup size change with band size?',
    answer:
      'Yes in labeling: the same letter on a different band is not the same volume. Sister sizes adjust the letter when the band changes.',
  },
  {
    question: 'Are US and UK bra sizes the same?',
    answer:
      'Bands often match numerically early on; cup letters diverge after certain sizes (for example US DDD vs UK E).',
  },
  {
    question: 'How do I convert US bra sizes to UK sizes?',
    answer:
      'Use a conversion table for cup letters after D while keeping the inch band when it matches. This calculator shows approximate equivalents.',
  },
  {
    question: 'How do I convert US bra sizes to EU sizes?',
    answer:
      'Map the US inch band to the EU 5 cm ladder (for example 34 → 75) and convert cup steps approximately.',
  },
  {
    question: 'What is an EU 75C in US sizing?',
    answer:
      'Often near US 34C on illustrative charts — confirm with brand-specific guides.',
  },
  {
    question: 'What is the difference between European and American sizes?',
    answer:
      'Different band numbering (cm-style vs inch-style) and sometimes different cup letter progressions.',
  },
  {
    question: 'Do all bra brands use the same size chart?',
    answer:
      'No. Construction, grading, and letter systems vary — always check the seller’s chart.',
  },
  {
    question: 'How accurate is an online bra size calculator?',
    answer:
      'It can estimate a starting size from measurements. Final fit depends on shape, style, and brand.',
  },
  {
    question: 'Can I calculate my bra size without a measuring tape?',
    answer:
      'A soft tape is strongly preferred. String + ruler is a rough backup only.',
  },
  {
    question: 'Should I wear a bra while measuring?',
    answer:
      'Many fitters prefer a lightly lined or unlined bra, or bare for underbust — be consistent and avoid heavily padded cups that inflate the bust measure.',
  },
  {
    question: 'How frequently should I measure my bra size?',
    answer:
      'Remeasure when fit changes — weight shifts, life stages, training, or stretched bras.',
  },
  {
    question: 'Can bra size change over time?',
    answer: 'Yes. Remeasure periodically and when bras stop fitting as they used to.',
  },
  {
    question: 'What if my measurements fall between sizes?',
    answer:
      'Try the closer primary size and its sister sizes; prioritize comfort and brand charts.',
  },
  {
    question: 'What if one breast is larger than the other?',
    answer:
      'Fit the larger side and use adjusters, inserts, or asymmetric styles as needed — common and normal.',
  },
  {
    question: 'What is the plus-four bra sizing method?',
    answer:
      'A traditional US/UK approach that adds about four inches to underbust before choosing a band. This calculator offers it as an explicit optional method because it differs from modern nearest-even approaches.',
  },
  {
    question: 'Which bra size should I try first?',
    answer:
      'Start with the calculated size for your region, then try sister sizes and brand chart recommendations.',
  },
  {
    question: 'How should a properly fitting bra feel?',
    answer:
      'Supportive band, comfortable cups without painful pressure, straps that stay put without digging, and all-day comfort for your activity.',
  },
  {
    question: 'Do sports bras use standard cup sizes?',
    answer:
      'Some do; many use S/M/L or proprietary charts. Do not assume lingerie letters match sports bras.',
  },
  {
    question: 'Can I use this calculator for bikini tops?',
    answer:
      'It can suggest a starting lingerie-style size, but swim brands often grade differently — check each brand’s guide.',
  },
];
