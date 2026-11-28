import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HEX_QUILT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Hexagon Quilt Calculator' },
  { id: 'what', label: 'What Is a Hexagon Quilt Calculator?' },
  { id: 'how', label: 'How Does a Hexagon Quilt Calculator Work?' },
  { id: 'count', label: 'How to Calculate the Number of Hexagons for a Quilt' },
  { id: 'layouts', label: 'Understanding Hexagon Quilt Layouts' },
  { id: 'measure', label: 'How to Measure a Hexagon for Quilting' },
  { id: 'side-vs-width', label: 'Hexagon Side Length vs. Width' },
  { id: 'geometry', label: 'Hexagon Geometry Explained' },
  { id: 'area', label: 'How to Calculate Hexagon Area' },
  { id: 'columns', label: 'How to Calculate Hexagonal Columns' },
  { id: 'rows', label: 'How to Calculate Hexagonal Rows' },
  { id: 'how-many', label: 'How Many Hexagons Do I Need for a Quilt?' },
  { id: 'half', label: 'What Is a Half Hexagon?' },
  { id: 'cut-half', label: 'How to Cut Half Hexagons' },
  { id: 'straight', label: 'How to Use Half Hexagons for Straight Quilt Edges' },
  { id: 'actual', label: 'How to Calculate the Actual Size of a Hexagon Quilt' },
  { id: 'chart', label: 'Hexagon Quilt Size Chart' },
  { id: 'fabric', label: 'How Much Fabric Do I Need for a Hexagon Quilt?' },
  { id: 'yardage', label: 'How to Calculate Fabric Yardage' },
  { id: 'seam', label: 'How Seam Allowance Affects Hexagon Cutting' },
  { id: 'template', label: 'How to Make Hexagon Cutting Templates' },
  { id: 'epp', label: 'English Paper Piecing vs. Machine-Pieced Hexagons' },
  { id: 'arrange', label: 'How to Arrange Hexagons in Rows' },
  { id: 'sew', label: 'How to Sew Hexagons Together' },
  { id: 'assemble', label: 'How to Assemble a Hexagon Quilt Top' },
  { id: 'borders', label: 'How to Create Straight Quilt Borders' },
  { id: 'examples', label: 'Hexagon Quilt Layout Examples' },
  { id: 'sizes', label: 'Common Hexagon Quilt Sizes' },
  { id: 'beginner', label: 'Tips for Beginner Hexagon Quilters' },
  { id: 'mistakes', label: 'Common Hexagon Quilting Mistakes' },
  { id: 'waste', label: 'How to Reduce Fabric Waste' },
  { id: 'limits', label: 'Hexagon Quilt Calculator Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'hex-faq', label: 'Frequently Asked Questions' },
];

export const HEX_QUILT_FAQS: readonly FAQItem[] = [
  {
    question: 'How many hexagons do I need for a quilt?',
    answer:
      'Enter desired width, length, and finished hexagon side length. This tool returns columns, rows, full hexagons, and half hexagons for a flat-top staggered layout.',
  },
  {
    question: 'How do I calculate hexagons for a quilt?',
    answer:
      'Use column spacing 1.5×side and row spacing √3×side, then count full cells plus edge halves — do not only divide quilt area by hex area.',
  },
  {
    question: 'How many hexagons do I need for a 90-inch by 90-inch quilt?',
    answer:
      'Convert to the same units as your hexagon side and run the calculator — counts depend on hexagon size.',
  },
  {
    question: 'How much fabric do I need for a hexagon quilt?',
    answer:
      'Enable fabric estimate: equivalent hexagons × cutting-template area × (1 + waste%), then divide by fabric width.',
  },
  {
    question: 'How do I measure a hexagon for quilting?',
    answer:
      'Usually finished side length. Point-to-point = 2s; flat-to-flat = √3 s.',
  },
  {
    question: 'How do I calculate the area of a hexagon?',
    answer: 'A = (3√3/2) s².',
  },
  {
    question: 'What is a half hexagon?',
    answer:
      'A piece cut from a regular hexagon along a symmetry line — used here for straight quilt edges.',
  },
  {
    question: 'How do I cut a half hexagon?',
    answer:
      'Cut a finished hexagon through opposite flats (horizontal half) or through opposite vertices (vertical half), matching your edge.',
  },
  {
    question: 'How do I arrange hexagons in rows?',
    answer:
      'This calculator uses flat-top hexagons in staggered columns (odd columns offset by half a flat-to-flat height).',
  },
  {
    question: 'How do I calculate the number of hexagon columns?',
    answer:
      'Increase columns until actual width 2s+(cols−1)×1.5s covers the desired width.',
  },
  {
    question: 'How do I calculate the number of hexagon rows?',
    answer:
      'rows = ceil(desired length / (√3 s)), then actual length adds H/2 when columns > 1 for stagger.',
  },
  {
    question: 'How do I make a hexagon quilt layout?',
    answer:
      'Choose hex size, compute columns/rows, cut full and half pieces, sew in staggered columns.',
  },
  {
    question: 'What is the best size hexagon for quilting?',
    answer:
      'Common finished sides are about 1–2 in for EPP; larger for faster tops. Pick what matches your pattern.',
  },
  {
    question: 'How many hexagons are needed for a baby quilt?',
    answer: 'Depends on finished size and hex side — enter baby dimensions here.',
  },
  {
    question: 'How many hexagons are needed for a lap quilt?',
    answer: 'Same method — use your lap width/length and hex size.',
  },
  {
    question: 'How many hexagons are needed for a queen-size quilt?',
    answer: 'Enter queen finished top dimensions and hex size for exact counts.',
  },
  {
    question: 'How many hexagons are needed for a king-size quilt?',
    answer: 'Enter king dimensions; expect many pieces with small hexes.',
  },
  {
    question: 'How do I calculate fabric yardage for hexagon quilting?',
    answer:
      'Use cutting-side area × equivalent hexagons × waste factor ÷ fabric width.',
  },
  {
    question: 'How much seam allowance should I use for hexagons?',
    answer: 'Often ¼ in; EPP may use less visible turn-under — set it in advanced.',
  },
  {
    question: 'How do I sew hexagons together?',
    answer:
      'Match sides, sew Y-seams or whipstitch EPP papers, press carefully.',
  },
  {
    question: 'Can I machine-sew a hexagon quilt?',
    answer: 'Yes — many quilters machine-piece hexagons with careful Y-seams.',
  },
  {
    question: 'What is English paper piecing?',
    answer:
      'Basting fabric over paper hex templates and hand-sewing sides together.',
  },
  {
    question: 'How do I make a hexagon cutting template?',
    answer:
      'Use finished side or convert to cutting side with seam offset (s + 2a/√3).',
  },
  {
    question: 'How do I create straight edges on a hexagon quilt?',
    answer:
      'Add vertical and/or horizontal half hexagons at the boundaries, as counted here.',
  },
  {
    question: 'What is the difference between full and half hexagons?',
    answer:
      'Full pieces are complete regular hexagons; halves are cut on a symmetry line for edges.',
  },
  {
    question: 'How do I calculate the finished quilt size?',
    answer:
      'Actual width/length come from the discrete column/row layout — shown as “actual size of quilt top.”',
  },
  {
    question: 'What is the width of a regular hexagon?',
    answer: 'Point-to-point width = 2s.',
  },
  {
    question: 'What is the height of a regular hexagon?',
    answer: 'Flat-to-flat height = √3 s.',
  },
  {
    question: 'How many hexagons fit in one square meter?',
    answer:
      'Roughly 1 / A with A=(3√3/2)s², but quilts need staggered layout counts, not area packing alone.',
  },
  {
    question: 'How many hexagons fit in one square yard?',
    answer: 'Same caveat — use layout geometry for quilt planning.',
  },
  {
    question: 'How do I calculate the number of hexagons from fabric width?',
    answer:
      'Fabric width affects yardage after piece counts are known — not the layout itself.',
  },
  {
    question: 'How do I prevent fabric waste when cutting hexagons?',
    answer:
      'Nest templates, match grain intentionally, and tune the waste % to your cutting style.',
  },
  {
    question: 'How do I arrange staggered hexagon columns?',
    answer:
      'Offset every other column by half the flat-to-flat height (flat-top convention).',
  },
  {
    question: 'How do I calculate the perimeter of a hexagon?',
    answer: 'Perimeter = 6s.',
  },
  {
    question: 'Do seam allowances change the finished quilt size?',
    answer:
      'No — finished layout uses finished side length. Seam allowance changes cutting templates only.',
  },
  {
    question: 'What is the easiest way to make a hexagon quilt?',
    answer:
      'Start with larger hexes or EPP kits; use half hexes for straight edges.',
  },
  {
    question: 'How long does it take to make a hexagon quilt?',
    answer: 'Highly variable — piece count is the main driver.',
  },
  {
    question: 'How many half hexagons do I need for straight edges?',
    answer:
      'This layout uses 2×rows vertical halves plus horizontal halves for stagger fill when columns > 1.',
  },
  {
    question: 'Can I use different-sized hexagons in one quilt?',
    answer:
      'Not modeled here — this calculator assumes one regular finished side length.',
  },
  {
    question: 'How accurate is the Hexagon Quilt Calculator?',
    answer:
      'Exact for the documented flat-top formulas. Real sewing still depends on seam accuracy and pressing.',
  },
];
