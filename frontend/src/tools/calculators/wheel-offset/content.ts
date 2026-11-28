import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Wheel Offset Calculator' },
  { id: 'what-offset', label: 'What Is Wheel Offset?' },
  { id: 'what-means', label: 'What Does Offset Mean?' },
  { id: 'positive', label: 'Positive Wheel Offset' },
  { id: 'negative', label: 'Negative Wheel Offset' },
  { id: 'zero', label: 'Zero Wheel Offset' },
  { id: 'width-vs-offset', label: 'Width vs Offset' },
  { id: 'how-calc', label: 'How to Calculate Changes' },
  { id: 'formula', label: 'Wheel Offset Formula' },
  { id: 'clearance', label: 'Clearance Calculation' },
  { id: 'position', label: 'Position Calculation' },
  { id: 'inner-outer', label: 'Inner vs Outer Clearance' },
  { id: 'how-use', label: 'How to Use' },
  { id: 'example', label: 'Calculation Example' },
  { id: 'backspacing', label: 'What Is Backspacing?' },
  { id: 'offset-vs-back', label: 'Offset vs Backspacing' },
  { id: 'tire-fitment', label: 'Offset & Tire Fitment' },
  { id: 'suspension', label: 'Suspension Clearance' },
  { id: 'fender', label: 'Fender Clearance' },
  { id: 'handling', label: 'Handling Effects' },
  { id: 'rubbing', label: 'Can Offset Cause Rubbing?' },
  { id: 'measure', label: 'How to Measure Offset' },
  { id: 'choose', label: 'Choosing Offset' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'wo-faq', label: 'Frequently Asked Questions' },
];

export const WO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is wheel offset?',
    answer:
      'Wheel offset (often marked ET) is the distance between the wheel’s hub-mounting surface and its centerline. It determines how far the rim sits inboard or outboard relative to the hub.',
  },
  {
    question: 'What does ET mean on wheels?',
    answer:
      'ET comes from the German Einpresstiefe (insertion depth). It is the offset in millimeters — for example ET45 means +45 mm offset.',
  },
  {
    question: 'What is positive wheel offset?',
    answer:
      'Positive offset places the hub-mounting surface toward the outer face of the wheel, typically pulling the wheel farther inward relative to a lower (or negative) offset.',
  },
  {
    question: 'What is negative wheel offset?',
    answer:
      'Negative offset places the mounting surface toward the inner face, which tends to push the wheel farther outward for a given width.',
  },
  {
    question: 'What is zero wheel offset?',
    answer:
      'Zero offset means the hub-mounting surface aligns with the wheel centerline.',
  },
  {
    question: 'How do I calculate wheel offset?',
    answer:
      'Measure from the hub pad to the wheel centerline. This tool compares two known width/offset pairs rather than measuring a physical wheel.',
  },
  {
    question: 'How do I calculate wheel clearance change?',
    answer:
      'C = (W_c/2 + ET_c) − (W_n/2 + ET_n) with all values in millimeters. Positive C means more inner rim-edge clearance.',
  },
  {
    question: 'What is wheel position change?',
    answer:
      'P = (W_n/2 − ET_n) − (W_c/2 − ET_c). Positive P means the new outer rim edge sits farther toward the fender.',
  },
  {
    question: 'How does changing wheel width affect offset?',
    answer:
      'Width and offset both move the inner and outer rim edges. A wider wheel with the same ET extends both edges farther from the centerline.',
  },
  {
    question: 'Does a lower offset push wheels outward?',
    answer:
      'For the same width, lowering ET increases outward extent and usually increases inner clearance at the rim edge — but tires and lips still matter.',
  },
  {
    question: 'Does a higher offset move wheels inward?',
    answer:
      'For the same width, raising ET reduces outward poke and reduces the inner rim-edge clearance metric used here.',
  },
  {
    question: 'What happens when wheel offset changes?',
    answer:
      'Inner and outer rim edges shift relative to the hub plane, changing available space toward the suspension and the fender.',
  },
  {
    question: 'What is the difference between ET35 and ET45?',
    answer:
      'ET35 is 10 mm lower offset than ET45. At equal width, that typically moves the wheel about 10 mm farther outward.',
  },
  {
    question: 'How much farther out is ET35 than ET45?',
    answer:
      'At the same width, about 10 mm farther outward on the outer rim edge (and about 10 mm more inner rim clearance in this model).',
  },
  {
    question: 'Can different wheel widths have the same offset?',
    answer:
      'Yes. Same ET does not mean identical poke or clearance when widths differ.',
  },
  {
    question: 'Does wheel width affect inner clearance?',
    answer:
      'Yes. Half of any width change moves the inner rim edge for a fixed offset.',
  },
  {
    question: 'Does offset affect suspension clearance?',
    answer:
      'Yes. Lower ET (or less inward extent) can increase space toward suspension components at the rim — tires may still foul.',
  },
  {
    question: 'Does offset affect fender clearance?',
    answer:
      'Yes. Lower ET or greater width usually increases outward rim position toward the fender.',
  },
  {
    question: 'Can incorrect wheel offset cause rubbing?',
    answer:
      'Yes — against fenders, liners, suspension, brakes, or the wheel well, especially with wide tires or lowered suspension.',
  },
  {
    question: 'Can incorrect offset damage wheel bearings?',
    answer:
      'Large scrub-radius or lever-arm changes can increase bearing loads. Follow vehicle and wheel manufacturer guidance.',
  },
  {
    question: 'Is wheel offset the same as backspacing?',
    answer:
      'No. Offset is from centerline to hub pad; backspacing is typically from the mounting pad to the inboard rim flange.',
  },
  {
    question: 'How do I convert wheel offset to backspacing?',
    answer:
      'Backspacing relates to overall rim width and offset; use the maker’s overall width (not just advertised rim width) when converting.',
  },
  {
    question: 'What does 18x8.5 ET35 mean?',
    answer:
      'An 18-inch diameter wheel, 8.5-inch rim width, with +35 mm offset.',
  },
  {
    question: 'What does 17x7.5 ET45 mean?',
    answer:
      'A 17-inch diameter wheel, 7.5-inch rim width, with +45 mm offset.',
  },
  {
    question: 'How much clearance do I need for aftermarket wheels?',
    answer:
      'There is no universal millimeter rule. Check tires, lips, brakes, fenders, and suspension travel — this calculator only shows rim-edge deltas.',
  },
  {
    question: 'Can I change wheel offset without changing wheel width?',
    answer:
      'Yes. Same-width offset changes shift both edges by roughly the ET difference.',
  },
  {
    question: 'Can I change wheel width without changing wheel offset?',
    answer:
      'Yes. Half the width change appears on each side of the centerline for a fixed ET.',
  },
  {
    question: 'Does increasing wheel width make wheels stick out?',
    answer:
      'Often the outer edge moves out when width increases at the same ET; the inner edge also moves inward.',
  },
  {
    question: 'How does wheel offset affect tire fitment?',
    answer:
      'Offset sets where the rim sits; tire section, brand, and profile still determine contact with body and suspension.',
  },
  {
    question: 'Can I use a different offset from the factory wheels?',
    answer:
      'Sometimes within measured clearances and manufacturer limits. Compare carefully and verify physically.',
  },
  {
    question: 'Does offset affect steering?',
    answer:
      'It can change scrub radius and steering feel. Effects vary by suspension design.',
  },
  {
    question: 'Does wheel offset affect handling?',
    answer:
      'Track width and scrub radius changes can alter response and loads; do not treat small rim-edge deltas as a handling upgrade claim.',
  },
  {
    question: 'What wheel offset is best for my car?',
    answer:
      'Start from OEM or documented fitment data for your year/model, tire size, and suspension — not a generic “best ET.”',
  },
  {
    question: 'Can wheel offset be measured in inches?',
    answer:
      'Yes, but ET is usually stamped in millimeters. This tool converts in/cm/mm as needed.',
  },
  {
    question: 'How accurate is a wheel offset calculator?',
    answer:
      'Exact for the rim-edge formulas and units you enter. Real fitment also depends on tires, lips, brakes, and bodywork.',
  },
  {
    question: 'What is inner wheel clearance?',
    answer:
      'Space toward the suspension/brake side. This tool reports change in nominal inner rim extent, not measured tire clearance.',
  },
  {
    question: 'What is outer wheel clearance?',
    answer:
      'Space toward the fender. Position change here is the shift of the nominal outer rim edge.',
  },
  {
    question: 'What is the difference between rim width and overall wheel width?',
    answer:
      'Rim width is often bead-seat width; overall width includes outer lips and may be larger — critical for backspacing conversions.',
  },
  {
    question: 'How does wheel offset affect brake clearance?',
    answer:
      'Offset and spoke design both matter. A favorable clearance change does not prove caliper clearance.',
  },
  {
    question: 'Can wheel spacers change effective wheel offset?',
    answer:
      'Yes. Spacers effectively reduce ET by about the spacer thickness, pushing the wheel outward.',
  },
];
