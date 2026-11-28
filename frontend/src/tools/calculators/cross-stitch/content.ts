import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CROSS_STITCH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Cross-Stitch Calculator' },
  { id: 'what-xs', label: 'What Is Cross-Stitch?' },
  { id: 'what-calc', label: 'What Is a Cross-Stitch Calculator?' },
  { id: 'how-works', label: 'How Does a Cross-Stitch Calculator Work?' },
  { id: 'fabric-count', label: 'What Is Cross-Stitch Fabric Count?' },
  { id: 'aida-even', label: 'Aida vs Evenweave' },
  { id: 'count-vs-stitch', label: 'Fabric Count vs Stitch Count' },
  { id: 'calc-size', label: 'How to Calculate Cross-Stitch Size' },
  { id: 'width', label: 'Finished Pattern Width' },
  { id: 'height', label: 'Finished Pattern Height' },
  { id: 'fabric-size', label: 'Required Fabric Size' },
  { id: 'extra', label: 'How Much Extra Fabric?' },
  { id: 'measure', label: 'How to Measure Cross-Stitch Fabric' },
  { id: 'formula', label: 'Cross-Stitch Size Formula' },
  { id: 'to-in', label: 'Stitches to Inches' },
  { id: 'to-cm', label: 'Stitches to Centimeters' },
  { id: 'density', label: 'How to Calculate Stitch Density' },
  { id: 'over', label: 'Over One vs Over Two' },
  { id: '14', label: 'What Is 14-Count Aida?' },
  { id: '16', label: 'What Is 16-Count Aida?' },
  { id: '18', label: 'What Is 18-Count Aida?' },
  { id: '28', label: 'What Is 28-Count Evenweave?' },
  { id: 'needles', label: 'Cross-Stitch Needle Size Chart' },
  { id: 'choose-needle', label: 'How to Choose the Correct Needle' },
  { id: 'floss', label: 'How to Estimate Embroidery Floss' },
  { id: 'stitch-count', label: 'How Many Cross-Stitches Are in a Pattern?' },
  { id: 'choose-fabric', label: 'How to Choose Fabric' },
  { id: 'mistakes', label: 'Common Measurement Mistakes' },
  { id: 'example', label: 'Worked Example' },
  { id: 'compare', label: 'Fabric Size Comparison' },
  { id: 'tips', label: 'Tips for Preparing Fabric' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'xs-faq', label: 'Frequently Asked Questions' },
];

export const CROSS_STITCH_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate cross-stitch size?',
    answer:
      'Divide stitch width and height by effective stitches per inch (fabric count ÷ stitch-over), then convert inches to cm if needed.',
  },
  {
    question: 'How do I calculate cross-stitch fabric requirements?',
    answer:
      'Add twice the per-side margin to finished width and height: Fw = W+2A, Fh = H+2A.',
  },
  {
    question: 'What is cross-stitch fabric count?',
    answer:
      'How many fabric threads or Aida squares fall in one inch — higher count means finer fabric and smaller stitches.',
  },
  {
    question: 'What is the difference between 14-count and 16-count Aida?',
    answer:
      '16-count has more squares per inch, so the same chart finishes smaller than on 14-count.',
  },
  {
    question: 'What is the difference between 14-count and 18-count Aida?',
    answer:
      '18-count is finer still — about 18 stitches per inch when stitched over one square.',
  },
  {
    question: 'How many stitches are in one inch of 14-count Aida?',
    answer: 'Typically 14 when stitching over one Aida square.',
  },
  {
    question: 'How many stitches are in one centimeter of 14-count Aida?',
    answer: 'About 14/2.54 ≈ 5.51 stitches per centimeter.',
  },
  {
    question: 'How do I convert stitches to inches?',
    answer: 'Inches = stitches ÷ stitches-per-inch.',
  },
  {
    question: 'How do I convert stitches to centimeters?',
    answer: 'Compute inches first, then × 2.54 — or use this calculator’s unit display.',
  },
  {
    question: 'How do I calculate the width of a cross-stitch design?',
    answer: 'W = pattern width stitches ÷ effective density D.',
  },
  {
    question: 'How do I calculate the height of a cross-stitch design?',
    answer: 'H = pattern height stitches ÷ D.',
  },
  {
    question: 'How much extra fabric should I leave around a cross-stitch pattern?',
    answer:
      'Often 5–10 cm (2–4 in) per side for framing; this tool defaults to 8 cm but you can change it.',
  },
  {
    question: 'How do I calculate the total fabric size?',
    answer: 'Finished size plus 2 × margin on each axis.',
  },
  {
    question: 'What is the difference between Aida and linen?',
    answer:
      'Aida has obvious square holes; linen/evenweave is woven threads you often stitch over two.',
  },
  {
    question: 'What is evenweave fabric?',
    answer:
      'Fabric with similar warp/weft thread counts, commonly stitched over two threads.',
  },
  {
    question: 'What does stitching over two threads mean?',
    answer:
      'Each chart stitch covers two fabric threads, so D = count/2 (e.g. 28-count → 14 spi).',
  },
  {
    question: 'Can I stitch over one thread on evenweave?',
    answer:
      'Yes, but it creates finer stitches; adjust stitch-over to 1 in the calculator.',
  },
  {
    question: 'What is the effective stitch count of 28-count evenweave over two?',
    answer: '14 stitches per inch.',
  },
  {
    question: 'What needle should I use for 14-count Aida?',
    answer: 'A common starting point is tapestry size 24.',
  },
  {
    question: 'What needle should I use for 16-count Aida?',
    answer: 'Often size 24–26.',
  },
  {
    question: 'What needle should I use for 18-count Aida?',
    answer: 'Often size 26.',
  },
  {
    question: 'What is the best needle size for cross-stitch?',
    answer:
      'There is no single best — match needle to fabric openings, strand count, and comfort.',
  },
  {
    question: 'How many strands of embroidery floss should I use?',
    answer:
      'Commonly 2 on 14-count Aida; adjust for coverage preference and fabric.',
  },
  {
    question: 'How do I calculate total stitch count?',
    answer:
      'Chart width × height gives positions. Actual full crosses may be fewer if the design has blanks.',
  },
  {
    question: 'How do I estimate the number of stitches in a pattern?',
    answer:
      'Use coverage % × positions, or sum color keys from the chart when available.',
  },
  {
    question: 'How do I calculate how much embroidery floss I need?',
    answer:
      'Estimate crosses × strand length per cross × working strands, add waste, then divide by available length per skein.',
  },
  {
    question: 'How many stitches can one skein of embroidery floss make?',
    answer:
      'It depends on skein length, strands used, and stitch size — use the optional floss estimator with your assumptions.',
  },
  {
    question: 'How do I estimate floss requirements for a large project?',
    answer:
      'Use coverage and waste factors, then buy extra of key colors — estimates are not color-accurate without a chart breakdown.',
  },
  {
    question: 'Does higher fabric count make the design smaller?',
    answer: 'Yes, for the same stitch count and stitch-over.',
  },
  {
    question: 'What is the easiest fabric count for beginners?',
    answer: 'Many beginners start on 14-count Aida.',
  },
  {
    question: 'How do I choose a fabric count for a cross-stitch pattern?',
    answer:
      'Match the designer’s recommendation, or pick a count that yields a finished size you like.',
  },
  {
    question: 'Can I use this calculator for needlepoint?',
    answer:
      'Mesh count sizing is similar in spirit, but canvas and stitch types differ — treat results as a rough guide.',
  },
  {
    question: 'Can I use this calculator for blackwork?',
    answer:
      'Yes for fabric/chart sizing when working on counted fabric; thread use differs.',
  },
  {
    question: 'Can I use this calculator for embroidery?',
    answer:
      'Surface embroidery often isn’t counted the same way — use this mainly for counted designs.',
  },
  {
    question: 'How accurate is the cross-stitch calculator?',
    answer:
      'Geometry is exact for the inputs. Fabric tension and finishing can shift real sizes slightly; floss estimates are approximate.',
  },
];
