import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RREF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rref', label: 'What Is Reduced Row Echelon Form?' },
  { id: 'what-is-ref', label: 'What Is Row Echelon Form?' },
  { id: 'how-to-calculate-rref', label: 'How to Calculate RREF' },
  { id: 'elementary-row-operations', label: 'Elementary Row Operations' },
  { id: 'rref-rules', label: 'RREF Rules and Properties' },
  { id: 'worked-rref-example', label: 'Step-by-Step RREF Example' },
  { id: 'rref-vs-ref', label: 'RREF vs. REF' },
  { id: 'matrix-rank-from-rref', label: 'How to Find Matrix Rank Using RREF' },
  { id: 'solving-with-rref', label: 'Solving Linear Equations Using RREF' },
  { id: 'solution-types', label: 'Unique, Infinite and No Solutions' },
  { id: 'common-rref-mistakes', label: 'Common RREF Mistakes' },
  { id: 'rref-faq', label: 'Frequently Asked Questions' },
];

export const RREF_FAQS: readonly FAQItem[] = [
  {
    question: 'What does RREF mean?',
    answer:
      'RREF stands for Reduced Row Echelon Form. It is a standardized matrix shape produced by Gauss–Jordan elimination in which every leading entry is 1, each leading 1 is the only nonzero entry in its column, and zero rows sit at the bottom.',
  },
  {
    question: 'How is RREF different from REF?',
    answer:
      'Row Echelon Form (REF) requires leading 1s that stair-step to the right and zeros below each pivot. Reduced Row Echelon Form additionally forces zeros above each pivot, so each pivot column becomes a standard basis vector among the nonzero rows.',
  },
  {
    question: 'Can every matrix be reduced to RREF?',
    answer:
      'Yes. Over the real numbers (and rationals), every matrix can be transformed into RREF by a finite sequence of elementary row operations. The resulting RREF is unique for a given matrix.',
  },
  {
    question: 'Is RREF unique?',
    answer:
      'Yes. While many sequences of row operations can reach it, the final reduced row echelon form of a matrix is unique. That uniqueness is why RREF is reliable for reading rank and solving linear systems.',
  },
  {
    question: 'How do you find matrix rank from RREF?',
    answer:
      'The rank equals the number of nonzero rows in the RREF, which is also the number of pivot columns. This calculator reports that count directly after elimination.',
  },
  {
    question: 'What are pivot columns?',
    answer:
      'A pivot column contains a leading 1 from some nonzero row in RREF. Pivot columns identify independent columns of the original matrix and the basic variables of an associated linear system.',
  },
  {
    question: 'Can RREF solve linear equations?',
    answer:
      'Yes, when you treat the matrix as an augmented matrix [A | b]. Enable Augmented mode so the last column is interpreted as constants. The RREF then reveals inconsistency, a unique solution, or free variables.',
  },
  {
    question: 'What happens if a row becomes all zeros?',
    answer:
      'An all-zero row contributes nothing to the rank and is moved to the bottom in RREF. In an augmented system, a zero-variable row with a nonzero constant means the system is inconsistent.',
  },
  {
    question: 'Can RREF contain fractions?',
    answer:
      'Absolutely. Normalizing a pivot often produces fractions. This calculator uses exact rational arithmetic so fractions like 1/2 stay exact instead of becoming recurring decimals.',
  },
];

export interface RrefGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  formula?: string;
  formulaNote?: string;
  orderedSteps?: readonly string[];
  hasWorkedExample?: boolean;
  hasComparisonTable?: boolean;
}

export const RREF_GUIDE_SECTIONS: readonly RrefGuideSection[] = [
  {
    id: 'what-is-rref',
    title: 'What Is Reduced Row Echelon Form?',
    paragraphs: [
      'Reduced row echelon form (RREF) is a clean, canonical shape of a matrix obtained by elementary row operations. In RREF, information about linear dependence, rank, and solutions of linear systems becomes easy to read at a glance.',
      'Think of RREF as the matrix equivalent of simplifying a fraction: many paths can get you there, but the simplified result is unique and reveals structure that the original entries may hide.',
      'All calculations on this page run locally in your browser using exact rational arithmetic for educational planning and homework checking.',
    ],
  },
  {
    id: 'what-is-ref',
    title: 'What Is Row Echelon Form?',
    paragraphs: [
      'Row echelon form (REF) is a related staircase shape. Each nonzero row has a leading 1 (a pivot), pivots move strictly rightward as you go down the rows, and every entry below a pivot is zero.',
      'REF is often an intermediate stage of Gaussian elimination. Continuing with Gauss–Jordan elimination clears entries above the pivots as well, producing RREF.',
    ],
  },
  {
    id: 'how-to-calculate-rref',
    title: 'How to Calculate RREF',
    paragraphs: [
      'The standard algorithm is Gauss–Jordan elimination. Work column by column from left to right, selecting a nonzero pivot in the remaining rows, normalizing that pivot to 1, and clearing the rest of the column.',
    ],
    orderedSteps: [
      'Choose the leftmost column that still has a nonzero entry in a remaining row; that entry (or a swapped one) becomes the pivot.',
      'Swap rows if needed so the pivot sits on the current pivot row.',
      'Scale the pivot row so the pivot equals 1.',
      'Add suitable multiples of the pivot row to every other row to create zeros above and below the pivot.',
      'Move to the next column and next pivot row; repeat until no further pivots remain.',
    ],
  },
  {
    id: 'elementary-row-operations',
    title: 'Elementary Row Operations',
    paragraphs: [
      'Only three operations are allowed. They never change the row space in a way that alters the solution set of an associated linear system.',
    ],
    bullets: [
      'Row swap: exchange two rows (Rᵢ ↔ Rⱼ).',
      'Row scaling: multiply a row by a nonzero scalar (Rᵢ → cRᵢ).',
      'Row replacement: add a multiple of one row to another (Rᵢ → Rᵢ + cRⱼ).',
    ],
  },
  {
    id: 'rref-rules',
    title: 'RREF Rules and Properties',
    paragraphs: [
      'A matrix is in RREF when all of the following hold simultaneously:',
    ],
    bullets: [
      'Every nonzero row has a leading 1 (a pivot).',
      'Each pivot is the only nonzero entry in its column.',
      'Pivot positions move strictly rightward in successive nonzero rows.',
      'All-zero rows, if any, appear below the nonzero rows.',
    ],
  },
  {
    id: 'worked-rref-example',
    title: 'Step-by-Step RREF Example',
    paragraphs: [
      'Consider the default 3×3 matrix used by this calculator. It has two dependent rows and one free direction after reduction.',
    ],
    hasWorkedExample: true,
  },
  {
    id: 'rref-vs-ref',
    title: 'RREF vs. REF',
    paragraphs: [
      'Both forms use pivots that stair-step to the right. The practical difference is whether entries above pivots are cleared.',
    ],
    hasComparisonTable: true,
  },
  {
    id: 'matrix-rank-from-rref',
    title: 'How to Find Matrix Rank Using RREF',
    paragraphs: [
      'After reduction, count the nonzero rows (or equivalently the pivot columns). That count is the rank of the matrix — the dimension of its column space and row space.',
      'Nullity equals the number of columns minus the rank (for a non-augmented matrix). Free columns are exactly the non-pivot columns.',
    ],
  },
  {
    id: 'solving-with-rref',
    title: 'Solving Linear Equations Using RREF',
    paragraphs: [
      'To solve Ax = b, form the augmented matrix [A | b] and compute its RREF. Enable Augmented mode in the calculator so the final column is treated as constants.',
      'Each pivot column corresponds to a basic variable. Non-pivot variable columns are free and may be assigned arbitrary parameters when the system is consistent.',
    ],
  },
  {
    id: 'solution-types',
    title: 'Unique, Infinite and No Solutions',
    paragraphs: [
      'Reading the RREF of an augmented matrix distinguishes the three classical outcomes of a linear system.',
    ],
    bullets: [
      'No solution (inconsistent): a row of the form [0 … 0 | c] with c ≠ 0 appears.',
      'Unique solution: every variable column is a pivot column and the system is consistent.',
      'Infinitely many solutions: the system is consistent but at least one variable column has no pivot (a free variable).',
    ],
  },
  {
    id: 'common-rref-mistakes',
    title: 'Common RREF Mistakes',
    paragraphs: [
      'Most algebra errors in hand calculation come from arithmetic slips or mis-applied pivots. Watch for these patterns:',
    ],
    bullets: [
      'Choosing a zero pivot instead of swapping in a nonzero entry from below.',
      'Dividing by zero when attempting to normalize an all-zero column.',
      'Clearing only below a pivot and forgetting that RREF also requires zeros above.',
      'Confusing REF with RREF when counting free variables.',
      'Treating a non-augmented matrix as if it already encodes a linear system with a unique solution.',
    ],
  },
];
