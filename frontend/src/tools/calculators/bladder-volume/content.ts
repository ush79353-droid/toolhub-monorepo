export const BLADDER_VOLUME_TOC_ITEMS = [
  { id: 'how-to-use', label: 'How to use the bladder volume calculator?' },
  { id: 'how-to-calculate', label: 'How to calculate bladder volume?' },
  { id: 'ultrasound', label: 'Bladder volume on ultrasound' },
  { id: 'capacity', label: 'How much can a bladder hold?' },
  { id: 'faqs', label: 'FAQs' },
];

export const BLADDER_VOLUME_FAQS = [
  {
    question: 'Why is the ellipsoid coefficient 0.81 instead of 0.52?',
    answer:
      '0.52 is the geometric ellipsoid factor (π/6). Omni and this worksheet use Bih et al. (1998) empirical regressions for ultrasound bladder shapes: ellipsoid 0.81, cuboid 0.89, triangular prism 0.66. Prolate ellipsoid keeps the geometric 0.52 option.',
  },
  {
    question: 'What units should I enter?',
    answer:
      'Enter three orthogonal ultrasound diameters. The engine converts mm or inches to centimeters before applying L×W×H×k. Volume is shown in mL (same numeric value as cm³) or liters.',
  },
  {
    question: 'Is this accurate enough for clinical decisions?',
    answer:
      'Bih et al. reported about 12.7% mean error when the matching shape coefficient was used. This tool is educational only and does not replace catheterization, formal urodynamics, or clinician judgment.',
  },
];
