import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CURTAIN_PANEL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Curtain Panel Calculator' },
  { id: 'what-panel', label: 'What Is a Curtain Panel?' },
  { id: 'what-calc', label: 'What Is a Curtain Panel Calculator?' },
  { id: 'types', label: 'Different Types of Curtain Panels' },
  { id: 'standard', label: 'Standard Curtain Panels' },
  { id: 'grommet', label: 'Grommet and Eyelet Curtains' },
  { id: 'gathered', label: 'Gathered Curtain Panels' },
  { id: 'fullness', label: 'What Is Curtain Fullness?' },
  { id: 'calc-fullness', label: 'How to Calculate Curtain Fullness' },
  { id: 'measure-window', label: 'How to Measure a Window for Curtains' },
  { id: 'rod', label: 'How to Measure Curtain Rod Width' },
  { id: 'length', label: 'How to Determine Curtain Length' },
  { id: 'how-many', label: 'How Many Curtain Panels Do I Need?' },
  { id: 'how-wide', label: 'How Wide Should Curtain Panels Be?' },
  { id: 'fabric-req', label: 'How to Calculate Curtain Fabric Requirements' },
  { id: 'yardage', label: 'How to Calculate Curtain Fabric Yardage' },
  { id: 'two-panels', label: 'Fabric for Two Curtain Panels' },
  { id: 'width-formula', label: 'Curtain Panel Width Formula' },
  { id: 'length-formula', label: 'Curtain Panel Length Formula' },
  { id: 'drops', label: 'How to Calculate Fabric Drops' },
  { id: 'what-drop', label: 'What Is a Fabric Drop?' },
  { id: 'cut-len', label: 'How to Calculate Fabric Cutting Length' },
  { id: 'hems', label: 'How to Add Curtain Hem Allowances' },
  { id: 'side-hem', label: 'How to Calculate Side Hem Allowance' },
  { id: 'top-bottom', label: 'Top and Bottom Hem Allowances' },
  { id: 'repeat', label: 'Fabric Pattern Repeat' },
  { id: 'extra', label: 'How Much Extra Fabric Should You Buy?' },
  { id: 'measure-panels', label: 'How to Measure Curtain Panels' },
  { id: 'sew', label: 'How to Sew Curtain Panels' },
  { id: 'hems-sew', label: 'How to Sew Top and Bottom Hems' },
  { id: 'sew-gathered', label: 'How to Make Gathered Curtains' },
  { id: 'sew-grommet', label: 'How to Make Grommet Curtains' },
  { id: 'choose-fabric', label: 'How to Choose Curtain Fabric' },
  { id: 'weight', label: 'Curtain Fabric Weight and Fullness' },
  { id: 'mistakes', label: 'Curtain Measurement Mistakes' },
  { id: 'example', label: 'Worked Fabric Calculation Example' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cp-faq', label: 'Frequently Asked Questions' },
];

export const CURTAIN_PANEL_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a curtain panel?',
    answer:
      'A finished curtain piece hung on a rod or track. A window often uses one panel or a pair.',
  },
  {
    question: 'How do I calculate curtain panel size?',
    answer:
      'Multiply rod width by fullness for total flat coverage, divide by panel count, then add side hems for cut width and top/bottom allowances for cut length.',
  },
  {
    question: 'How many curtain panels do I need?',
    answer:
      'Two is common for a pair. Use one for a single stack, or more for wide openings — this tool accepts any positive count.',
  },
  {
    question: 'How wide should curtain panels be?',
    answer:
      'Finished flat width ≈ (rod width × fullness) ÷ panels. Cut wider by twice the side-hem allowance.',
  },
  {
    question: 'How long should curtain panels be?',
    answer:
      'Measure from your heading reference to the desired hem — sill, apron, or floor — then add top and bottom allowances for cutting.',
  },
  {
    question: 'How much fabric do I need for curtains?',
    answer:
      'Cut length per drop × total drops (drops per panel × panels), then convert to meters/yards and round purchase up.',
  },
  {
    question: 'How do I calculate fabric yardage for curtains?',
    answer: 'Yards = total meters ÷ 0.9144. This calculator also suggests ¼-yard purchase rounding up.',
  },
  {
    question: 'How much fabric do I need for two curtain panels?',
    answer:
      'Run the formulas with N=2. Example: 200 cm rod · 2× fullness · 140 cm fabric often needs 4 drops.',
  },
  {
    question: 'How much fabric do I need for a 200 cm window?',
    answer:
      'Use rod width (often wider than glass), choose fullness, then compute coverage and drops — not glass alone.',
  },
  {
    question: 'How do I measure a window for curtain panels?',
    answer:
      'Prefer the installed rod/track span and the finished drop length from heading to hem.',
  },
  {
    question: 'Should curtain width be based on window width or rod width?',
    answer:
      'Usually rod or track width — that is what the curtains actually cover.',
  },
  {
    question: 'What is curtain fullness?',
    answer:
      'How much flat fabric width you provide relative to the rod: fullness = flat coverage ÷ rod width.',
  },
  {
    question: 'What does 2x fullness mean?',
    answer: 'Flat finished curtain width totals about twice the rod width.',
  },
  {
    question: 'What is the ideal curtain fullness ratio?',
    answer:
      'There is no single ideal — lightweight fabrics often use more; heavy drapes less. Heading style matters.',
  },
  {
    question: 'How much fullness do grommet curtains need?',
    answer: 'Often around 1.5–2× depending on look; adjustable in this tool.',
  },
  {
    question: 'How much fullness do gathered curtains need?',
    answer: 'Often 2–2.5× or more for a fuller gather.',
  },
  {
    question: 'How do I calculate curtain fabric width?',
    answer:
      'Per panel: coverage/N, then add side hems. Join multiple fabric widths (drops) if needed.',
  },
  {
    question: 'How do I calculate curtain panel length?',
    answer: 'Finished length + top allowance + bottom hem (then optional pattern repeat).',
  },
  {
    question: 'How much extra fabric should I allow for curtain hems?',
    answer:
      'Depends on heading and hem depth — this tool defaults to example allowances you can edit.',
  },
  {
    question: 'What is a curtain fabric drop?',
    answer:
      'One cut length of full fabric width used as (or joined into) a panel.',
  },
  {
    question: 'How many fabric drops do I need?',
    answer:
      'Enough widths so assembled width after joining seams ≥ cut panel width.',
  },
  {
    question: 'How do I calculate curtain fabric cutting length?',
    answer: 'Finished length + top + bottom, then align to pattern repeat if required.',
  },
  {
    question: 'What is a vertical pattern repeat?',
    answer:
      'The distance before a print motif repeats vertically — may force longer cuts for matching.',
  },
  {
    question: 'How does fabric pattern repeat affect yardage?',
    answer:
      'Cut length is rounded up to whole repeats in the simplified model, increasing total fabric.',
  },
  {
    question: 'How do I calculate curtain fabric waste?',
    answer: 'Optional waste % multiplies purchase length after shrinkage adjustment.',
  },
  {
    question: 'How do I account for fabric shrinkage?',
    answer:
      'If cutting after expected shrink: purchase = length / (1 − s/100) for s between 0 and 100.',
  },
  {
    question: 'Can I make curtains from 140 cm wide fabric?',
    answer: 'Yes — join drops when cut width exceeds one usable width.',
  },
  {
    question: 'Can I make curtains from 54-inch-wide fabric?',
    answer: 'Yes — enter usable width in inches or convert to cm.',
  },
  {
    question: 'How do I sew two fabric widths together for curtains?',
    answer:
      'Join with seams (allowance per edge), then finish outer side hems of the assembled panel.',
  },
  {
    question: 'How do I measure curtains for floor-length installation?',
    answer:
      'Measure from heading to floor (or desired break/puddle) and add hem allowances.',
  },
  {
    question: 'Should curtains touch the floor?',
    answer:
      'Preference: kiss, break, or puddle. Measure intentionally for the look you want.',
  },
  {
    question: 'What is the difference between one curtain panel and a pair?',
    answer: 'One panel stacks to one side; a pair usually splits coverage left/right.',
  },
  {
    question: 'How do I calculate fabric for blackout curtains?',
    answer:
      'Same width/length math; lining may need separate yardage not covered here.',
  },
  {
    question: 'How do I make curtain panels without sewing?',
    answer:
      'No-sew tapes/hems exist, but still use the same finished sizes and coverage math.',
  },
  {
    question: 'Can I use the calculator for Roman blinds?',
    answer:
      'Not as a dedicated Roman formula — panel coverage/fullness assumptions differ.',
  },
  {
    question: 'How accurate is the curtain panel calculator?',
    answer:
      'Geometry is exact for the inputs. Real fabric yield depends on usable width, matching, and construction.',
  },
];
