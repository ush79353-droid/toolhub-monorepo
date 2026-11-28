import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Half Square Triangle Calculator' },
  { id: 'what-hst', label: 'What Is a Half Square Triangle?' },
  { id: 'what-calc', label: 'What Is a Half Square Triangle Calculator?' },
  { id: 'how', label: 'How Does the HST Calculator Work?' },
  { id: 'finished', label: 'What Is a Finished HST Size?' },
  { id: 'unfinished', label: 'What Is an Unfinished HST Size?' },
  { id: 'raw', label: 'Finished vs Raw Square Sizes' },
  { id: 'calc-size', label: 'How to Calculate Half Square Triangle Size' },
  { id: 'formulas', label: 'Half Square Triangle Cutting Formulas' },
  { id: 'make', label: 'How to Make Half Square Triangles' },
  { id: 'tools', label: 'Tools Needed to Make Half Square Triangles' },
  { id: 'two', label: 'Two-at-a-Time HST Method' },
  { id: 'eight', label: 'Eight-at-a-Time HST Method' },
  { id: 'quilt', label: 'How to Make Half Square Triangles for Quilting' },
  { id: 'sew', label: 'How to Sew Half Square Triangles' },
  { id: 'cut', label: 'How to Cut HST Fabric Squares' },
  { id: 'mark', label: 'How to Mark Diagonal Sewing Lines' },
  { id: 'seam', label: 'How to Calculate Seam Allowance' },
  { id: 'quarter', label: 'Quarter-Inch Seam Allowance Explained' },
  { id: 'accurate', label: 'How to Make Accurate HST Quilt Blocks' },
  { id: 'trim', label: 'How to Trim Oversized Half Square Triangles' },
  { id: 'chart', label: 'Half Square Triangle Size Chart' },
  { id: 'diag', label: 'Half Square Triangle Diagonal Formula' },
  { id: 'raw-calc', label: 'How to Calculate Raw Square Size' },
  { id: 'fin-calc', label: 'How to Calculate Finished HST Size' },
  { id: 'multi', label: 'How to Make Multiple HST Blocks' },
  { id: 'fabric', label: 'How Much Fabric Is Needed for HST Blocks?' },
  { id: 'arrange', label: 'How to Arrange Half Square Triangles' },
  { id: 'patterns', label: 'Popular Half Square Triangle Quilt Patterns' },
  { id: 'mistakes', label: 'Common HST Cutting Mistakes' },
  { id: 'tips', label: 'Tips for Accurate Quilting Measurements' },
  { id: 'fabrics', label: 'Best Fabrics for Half Square Triangles' },
  { id: 'press', label: 'How to Press Half Square Triangle Seams' },
  { id: 'distort', label: 'How to Avoid Fabric Distortion' },
  { id: 'square-up', label: 'How to Square Up HST Quilt Blocks' },
  { id: 'limits', label: 'Half Square Triangle Calculator Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'hst-faq', label: 'Frequently Asked Questions' },
];

export const HST_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a half square triangle?',
    answer:
      'A square quilt unit made of two right triangles joined on the hypotenuse.',
  },
  {
    question: 'How do you calculate half square triangles?',
    answer:
      'Choose finished size and method, then compute unfinished size (F+2a) and raw cutting square from geometric or traditional formulas.',
  },
  {
    question: 'How do I calculate HST size?',
    answer:
      'Enter finished size (or raw/diagonal) with seam allowance and cutting preference in this calculator.',
  },
  {
    question: 'What size square do I cut for a 4-inch HST?',
    answer:
      'Traditional two-at-a-time: 4⅞″. Geometric minimum ≈ 4.85″ with ¼″ seams.',
  },
  {
    question: 'What size square do I cut for a 3-inch HST?',
    answer: 'Traditional two-at-a-time: 3⅞″.',
  },
  {
    question: 'What is the difference between finished and unfinished HST?',
    answer:
      'Finished is the visible quilt size; unfinished includes outer seam allowances (usually +½″ for ¼″ seams).',
  },
  {
    question: 'How much seam allowance do I need for HST?',
    answer: 'Most quilters use ¼″; this tool defaults to 0.25 in and is editable.',
  },
  {
    question: 'Why do quilters add ⅞ inch to HST cutting sizes?',
    answer:
      'It is a traditional two-at-a-time shortcut for ¼″ seams — close to, but not identical to, the geometric minimum.',
  },
  {
    question: 'How do I make two HST blocks at once?',
    answer:
      'Sew two squares together on both sides of a diagonal, cut, and press — two HSTs per pair.',
  },
  {
    question: 'How do I make eight HST blocks at once?',
    answer:
      'Use the eight-at-a-time marking and cutting method — eight HSTs per pair.',
  },
  {
    question: 'How many HST blocks can I make from two squares?',
    answer: '2 with two-at-a-time, or 8 with eight-at-a-time.',
  },
  {
    question: 'How do I calculate fabric requirements for HST?',
    answer:
      'Divide required HSTs by blocks per pair, ceil to pairs, then ×2 fabric squares.',
  },
  {
    question: 'How do I cut half square triangles accurately?',
    answer: 'Use a sharp rotary cutter, ruler, and consistent seam; trim oversized units.',
  },
  {
    question: 'How do I square up half square triangles?',
    answer:
      'Align the diagonal on a square ruler and trim to unfinished size.',
  },
  {
    question: 'What is the diagonal of a square?',
    answer: 'd = s√2.',
  },
  {
    question: 'How do I calculate a square\'s diagonal?',
    answer: 'Multiply the side by √2 ≈ 1.4142.',
  },
  {
    question: 'How do I calculate square size from diagonal?',
    answer: 's = d / √2.',
  },
  {
    question: 'Can I make HST blocks with different fabric colors?',
    answer: 'Yes — that is the usual two-fabric contrast HST.',
  },
  {
    question: 'How do I sew a quarter-inch seam?',
    answer: 'Use a ¼″ foot or marked guide and sew a consistent scant/true ¼″ as preferred.',
  },
  {
    question: 'How do I press half square triangle seams?',
    answer: 'Press carefully to set, then open or nest toward the darker fabric as the pattern requires.',
  },
  {
    question: 'What is an oversized HST?',
    answer: 'A unit cut larger than the geometric minimum, then trimmed to unfinished size.',
  },
  {
    question: 'Why should I oversize HST blocks?',
    answer: 'Trimming corrects sewing and cutting variance for sharper points.',
  },
  {
    question: 'How do I trim HST blocks to size?',
    answer: 'Use a square ruler on the unfinished size with the seam on the diagonal.',
  },
  {
    question: 'What tools are needed for half square triangles?',
    answer: 'Rotary cutter, mat, quilting ruler, sewing machine, iron, and marking tool.',
  },
  {
    question: 'How do I use a rotary cutter for HST?',
    answer: 'Cut squares and trim with a ruler; keep the blade against the ruler edge.',
  },
  {
    question: 'How do I use a quilting ruler?',
    answer: 'Align markings to fabric edges/seam lines for accurate cuts.',
  },
  {
    question: 'What is the easiest method for making HST blocks?',
    answer: 'Two-at-a-time is simplest; eight-at-a-time is faster for large quantities.',
  },
  {
    question: 'How do I make HST blocks quickly?',
    answer: 'Batch-cut squares, chain-piece, and consider eight-at-a-time.',
  },
  {
    question: 'How can I avoid inaccurate HST dimensions?',
    answer: 'Consistent seams, careful pressing, and trim-to-size when oversized.',
  },
  {
    question: 'How do I prevent fabric stretching?',
    answer: 'Avoid pulling bias edges; starch lightly and press, do not iron-drag.',
  },
  {
    question: 'How many HSTs do I need for a quilt?',
    answer: 'Depends on the pattern — enter the required count in advanced quantity.',
  },
  {
    question: 'Can I make HST blocks in centimeters?',
    answer: 'Yes — switch units; math stays consistent.',
  },
  {
    question: 'How do I convert HST dimensions to inches?',
    answer: 'Use the unit selector; 1 in = 2.54 cm.',
  },
  {
    question: 'What is the best fabric for HST blocks?',
    answer: 'Stable quilting cotton is common; prewash if you wash finished quilts.',
  },
  {
    question: 'Can I use HST blocks for table runners?',
    answer: 'Yes — HSTs work in many projects beyond bed quilts.',
  },
  {
    question: 'How do I arrange half square triangles into quilt patterns?',
    answer:
      'Rotate units to form pinwheels, chevrons, flying-geese lookalikes, and more.',
  },
  {
    question: 'How do I calculate cutting sizes for a 5-inch finished HST?',
    answer: 'Traditional two-at-a-time raw = 5⅞″; unfinished = 5½″ with ¼″ seams.',
  },
  {
    question: 'How much extra fabric should I allow for trimming?',
    answer: 'Often ⅛″ beyond geometric minimum — set in oversized mode.',
  },
  {
    question: 'What is the difference between geometric and traditional cutting sizes?',
    answer:
      'Geometric uses R=F+2a+a√2; traditional uses F+⅞″ (two-at-a-time) as a practical shortcut.',
  },
  {
    question: 'How accurate is the Half Square Triangle Calculator?',
    answer:
      'Exact for the documented formulas. Real sewing accuracy depends on seam and trim technique.',
  },
];
