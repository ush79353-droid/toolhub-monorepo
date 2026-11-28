import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BAG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Bag Calculator' },
  { id: 'what', label: 'What Is a Bag Calculator?' },
  { id: 'how-much', label: 'How Much Fabric for a Tote?' },
  { id: 'measure', label: 'How to Measure a Tote Bag' },
  { id: 'formulas', label: 'Bag Measurement Formulas' },
  { id: 'flat', label: 'Fabric for a Flat Tote' },
  { id: 'boxed', label: 'Fabric for Boxed Corners' },
  { id: 'what-boxed', label: 'What Are Boxed Corners?' },
  { id: 'width-depth', label: 'Width vs Depth' },
  { id: 'seam', label: 'What Is Seam Allowance?' },
  { id: 'hem', label: 'Top Hem Allowance' },
  { id: 'area', label: 'How to Calculate Fabric Area' },
  { id: 'types', label: 'Types of Tote Bags' },
  { id: 'fabrics', label: 'Fabric Types' },
  { id: 'choose', label: 'How to Choose Fabric' },
  { id: 'layout', label: 'Cutting Layout' },
  { id: 'shrink', label: 'Shrinkage and Waste' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'how-use', label: 'How to Use' },
  { id: 'example', label: 'Calculator Example' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bag-faq', label: 'Frequently Asked Questions' },
];

export const BAG_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a bag calculator?',
    answer:
      'A tool that estimates the rectangular fabric cut needed for a tote bag from finished height, width, depth, and sewing allowances.',
  },
  {
    question: 'How do I calculate fabric needed for a tote bag?',
    answer:
      'For this folded-bottom model: flat Fw=W+2S and Fh=2H+2T; boxed Fw=W+D+2S and Fh=2H+D+2T.',
  },
  {
    question: 'How do I measure a tote bag?',
    answer:
      'Height is vertical finished size, width across the front, depth front-to-back at the base or gusset.',
  },
  {
    question: 'What measurements are needed to make a bag?',
    answer:
      'At minimum finished height and width; depth if using boxed corners; plus seam and hem allowances for cutting size.',
  },
  {
    question: 'How do I calculate tote bag height?',
    answer:
      'Measure from the finished base to the top edge (excluding handles). Cutting height uses 2H plus hems (and depth if boxed).',
  },
  {
    question: 'How do I calculate tote bag width?',
    answer:
      'Measure the finished front width. Cutting width adds seam allowances (and depth if boxed).',
  },
  {
    question: 'What is bag depth?',
    answer:
      'The finished front-to-back thickness of the bag, often formed by boxed corners or a gusset.',
  },
  {
    question: 'What are boxed corners?',
    answer:
      'A sewing technique that squares the bottom by folding and stitching corner triangles, creating a defined base depth.',
  },
  {
    question: 'How do boxed corners change fabric requirements?',
    answer:
      'In this model they add depth D into both fabric width and height compared with a flat tote.',
  },
  {
    question: 'How much fabric do I need for a flat tote bag?',
    answer:
      'Example: 40×35 cm with 1 cm seams and 2 cm hems → about 37×84 cm (one rectangle).',
  },
  {
    question: 'How much fabric do I need for a boxed-bottom tote?',
    answer:
      'Example: 40×35×10 cm with the same allowances → about 47×94 cm.',
  },
  {
    question: 'What is the formula for tote bag fabric width?',
    answer: 'Flat: W+2S. Boxed: W+D+2S.',
  },
  {
    question: 'What is the formula for tote bag fabric height?',
    answer: 'Flat: 2H+2T. Boxed: 2H+D+2T.',
  },
  {
    question: 'How do I calculate fabric area?',
    answer:
      'A = fabric width × fabric height. Convert with area factors (not linear ones).',
  },
  {
    question: 'What is seam allowance?',
    answer:
      'Extra fabric beyond the finished edge for stitching. This tool uses a side seam allowance per side.',
  },
  {
    question: 'How much seam allowance should I use?',
    answer:
      'Common sewing projects use about 1 cm (⅜–½ in), but follow your pattern or preference.',
  },
  {
    question: 'What is top hem allowance?',
    answer:
      'Extra fabric at the top opening for folding and finishing the rim.',
  },
  {
    question: 'Does the calculator include seam allowances?',
    answer:
      'Yes by default (1 cm sides, 2 cm top hems). You can set them to zero in Advanced settings.',
  },
  {
    question: 'Can I calculate fabric without seam allowances?',
    answer: 'Yes — set seam and hem allowances to 0.',
  },
  {
    question: 'Can I make a tote bag with one piece of fabric?',
    answer:
      'Yes — this calculator models a single folded rectangle with side seams.',
  },
  {
    question: 'Can I make a tote bag with two fabric panels?',
    answer:
      'Yes, but that is a different cut plan and is not what these formulas describe.',
  },
  {
    question: 'What is the difference between a flat tote and a gusseted tote?',
    answer:
      'A flat tote has little or no base depth; gusseted/boxed styles stand open with depth.',
  },
  {
    question: 'What is the difference between finished size and cutting size?',
    answer:
      'Finished size is after sewing; cutting size includes folds, hems, seams, and boxed-corner material.',
  },
  {
    question: 'How do I calculate fabric for a lined tote?',
    answer:
      'Usually cut a second piece (or more) for lining — this tool does not auto-add lining.',
  },
  {
    question: 'Does the calculator include handles?',
    answer: 'No. Handles, straps, and webbing are separate.',
  },
  {
    question: 'How much extra fabric should I buy?',
    answer:
      'Allow for shrinkage, matching, mistakes, and roll width — often a margin beyond the rectangle area.',
  },
  {
    question: 'How does fabric shrinkage affect bag size?',
    answer:
      'Pre-wash when appropriate; otherwise finished size may shrink after washing.',
  },
  {
    question: 'Can I use inches instead of centimeters?',
    answer: 'Yes — every dimension field supports mm, cm, m, in, and ft.',
  },
  {
    question: 'How do I convert centimeters to inches?',
    answer: 'Divide cm by 2.54 (or use the unit selector, which preserves physical length).',
  },
  {
    question: 'Can I use canvas fabric for tote bags?',
    answer: 'Yes — canvas is a common sturdy choice for reusable totes.',
  },
  {
    question: 'What fabric is best for reusable shopping bags?',
    answer:
      'Durable weaves such as canvas, heavier cotton, or sturdy synthetics — match weight to expected load.',
  },
  {
    question: 'How do I calculate material for multiple tote bags?',
    answer:
      'Multiply one bag’s rectangle by quantity, then plan layout on the fabric width to find purchase length.',
  },
  {
    question: 'Does fabric width affect cutting layout?',
    answer:
      'Yes — usable bolt width determines how you orient the rectangle and how much yardage to buy.',
  },
  {
    question: 'Can this calculator estimate fabric cost?',
    answer: 'No — it estimates cut size and area only, not price.',
  },
  {
    question: 'How accurate is the Bag Calculator?',
    answer:
      'Exact for the documented folded-bottom formulas and allowances you enter. Other constructions need different math.',
  },
];
