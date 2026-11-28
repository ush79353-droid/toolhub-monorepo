import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FABRIC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Fabric Calculator' },
  { id: 'what', label: 'What Is a Fabric Calculator?' },
  { id: 'how', label: 'How Does a Fabric Calculator Work?' },
  { id: 'yardage', label: 'How to Calculate Fabric Yardage' },
  { id: 'meas', label: 'What Measurements Do You Need?' },
  { id: 'width', label: 'How to Measure Fabric Width' },
  { id: 'piece', label: 'How to Measure Fabric Piece Dimensions' },
  { id: 'across', label: 'How to Calculate Pieces Across' },
  { id: 'rows', label: 'How to Calculate Cutting Rows' },
  { id: 'length', label: 'How to Calculate Total Fabric Length' },
  { id: 'in-yd', label: 'How to Convert Inches to Yards' },
  { id: 'cm-m', label: 'How to Convert Centimeters to Meters' },
  { id: 'by-hand', label: 'How to Calculate Fabric Yardage by Hand' },
  { id: 'layout', label: 'Fabric Cutting Layout Explained' },
  { id: 'waste', label: 'How to Minimize Fabric Waste' },
  { id: 'usable', label: 'Fabric Width vs Usable Width' },
  { id: 'grain', label: 'Fabric Grain and Cutting Direction' },
  { id: 'rotate', label: 'Can Fabric Pieces Be Rotated?' },
  { id: 'shrink', label: 'How to Calculate Fabric Shrinkage Allowance' },
  { id: 'extra', label: 'How Much Extra Fabric Should You Buy?' },
  { id: 'common-w', label: 'Common Fabric Widths' },
  { id: 'sewing', label: 'Fabric for Sewing Projects' },
  { id: 'quilt', label: 'Fabric for Quilting' },
  { id: 'curtains', label: 'Fabric for Curtains' },
  { id: 'cushions', label: 'Fabric for Cushion Covers' },
  { id: 'table', label: 'Fabric for Tablecloths' },
  { id: 'multi', label: 'Fabric for Multiple Identical Pieces' },
  { id: 'examples', label: 'Fabric Yardage Calculation Examples' },
  { id: 'mistakes', label: 'Common Fabric Measurement Mistakes' },
  { id: 'limits', label: 'Fabric Calculator Limitations' },
  { id: 'tips', label: 'Tips for Buying the Right Amount of Fabric' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'fab-faq', label: 'Frequently Asked Questions' },
];

export const FABRIC_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate how much fabric I need?',
    answer:
      'Find how many pieces fit across the usable width, compute rows for your quantity, multiply by piece length, then convert to yards/meters and add allowances.',
  },
  {
    question: 'How does a fabric calculator work?',
    answer:
      'It models a rectangular cutting grid: pieces across, rows, and total length under uniform orientation.',
  },
  {
    question: 'How do I calculate fabric yardage?',
    answer: 'Yards = total length in inches ÷ 36 (or length in mm ÷ 914.4).',
  },
  {
    question: 'How do I calculate fabric length?',
    answer: 'Length = rows × piece length (+ row gaps if used).',
  },
  {
    question: 'How many inches are in a yard of fabric?',
    answer: '36 inches.',
  },
  {
    question: 'How many centimeters are in a yard?',
    answer: '91.44 cm.',
  },
  {
    question: 'How many meters are in one yard?',
    answer: '0.9144 m.',
  },
  {
    question: 'How wide is a standard fabric roll?',
    answer:
      'Common usable widths include 36, 44/45, 54, 58/60, and 72 inches — check your bolt.',
  },
  {
    question: 'What is usable fabric width?',
    answer:
      'Fabric width minus unusable edge allowances (selvages/margins).',
  },
  {
    question: 'How many pieces can I cut from one yard of fabric?',
    answer:
      'Depends on fabric width and piece size — compute pieces across and how many rows fit in 36 inches.',
  },
  {
    question: 'How do I calculate pieces across fabric?',
    answer: 'P = floor(F/W), or with gap G: floor((F+G)/(W+G)).',
  },
  {
    question: 'How do I calculate rows of fabric pieces?',
    answer: 'R = ceil(N/P) when P > 0.',
  },
  {
    question: 'How do I calculate fabric for multiple pieces?',
    answer: 'Use total piece count N in the row formula, then length = R×L.',
  },
  {
    question: 'How do I calculate the fabric needed for 120 napkins?',
    answer: 'Enter napkin size and 120 as quantity — the layout math scales.',
  },
  {
    question: 'How much fabric do I need for 10 cushion covers?',
    answer:
      'Enter one cover’s cut rectangle and quantity 10 (add seam allowances in the piece size).',
  },
  {
    question: 'How do I calculate fabric for curtains?',
    answer:
      'Curtains often need drops and fullness — use Curtain Panel Calculator for panel yardage; this tool suits identical rectangles.',
  },
  {
    question: 'How do I calculate fabric for a tablecloth?',
    answer: 'Treat the cloth as one large piece (N=1) or multiple joined panels.',
  },
  {
    question: 'How do I calculate fabric for quilting?',
    answer:
      'Enter block/strip cut sizes and counts; patterned matching may need extra beyond this grid model.',
  },
  {
    question: 'How many yards are in a bolt of fabric?',
    answer: 'Bolts vary by mill and retailer — often tens of yards, not fixed.',
  },
  {
    question: 'How many square feet are in one yard of fabric?',
    answer:
      'Area = width (ft) × 3 ft. A 60-inch (5 ft) wide yard is about 15 sq ft.',
  },
  {
    question: 'Is a yard of fabric always 36 inches long?',
    answer: 'Yes — a linear yard is 36 inches along the bolt.',
  },
  {
    question: 'Does fabric width affect the yardage needed?',
    answer: 'Yes — wider fabric can fit more pieces across and reduce length.',
  },
  {
    question: 'What is fabric grain?',
    answer:
      'Grain follows lengthwise/crosswise threads; garments often require a specific grain.',
  },
  {
    question: 'Can I rotate fabric pieces while cutting?',
    answer:
      'Only if grain/nap/pattern allow. This tool can compare uniform 90° layouts.',
  },
  {
    question: 'How do I minimize fabric waste?',
    answer:
      'Choose efficient piece sizes, consider rotation when allowed, and reduce gaps — nested packing may do better than this grid.',
  },
  {
    question: 'How much extra fabric should I buy?',
    answer: 'Often 5–15% for mistakes and matching; use the extra % field.',
  },
  {
    question: 'How do I account for fabric shrinkage?',
    answer: 'Buy length = finished length ÷ (1 − S/100) for lengthwise shrink S%.',
  },
  {
    question: 'How do I calculate fabric utilization?',
    answer: 'U = (piece area × N) ÷ (usable width × base length) × 100.',
  },
  {
    question: 'What happens if the piece width exceeds fabric width?',
    answer:
      'No pieces fit across unless rotation makes the shorter side fit — the calculator warns.',
  },
  {
    question: 'How accurate is a fabric calculator?',
    answer:
      'Exact for its grid assumptions. Real projects need seams, matching, and grain constraints.',
  },
  {
    question: 'Why does fabric pattern direction matter?',
    answer: 'Motifs and nap may forbid rotation and require extra length for matching.',
  },
  {
    question: 'How do cutting gaps affect yardage?',
    answer: 'Gaps reduce pieces across and can add length between rows.',
  },
  {
    question: 'Can I use the calculator for patterned fabric?',
    answer:
      'Yes for rough yardage — add repeat allowances manually; this model does not match prints.',
  },
  {
    question: 'Does the calculator account for seam allowances?',
    answer: 'Include seams in your piece width/length inputs.',
  },
  {
    question: 'How do I convert fabric yards into meters?',
    answer: 'Meters = yards × 0.9144.',
  },
  {
    question: 'How do I calculate fabric cost?',
    answer:
      'Multiply purchase length by price per yard/meter — cost is outside this tool’s scope.',
  },
];
