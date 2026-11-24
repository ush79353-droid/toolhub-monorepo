export const BLOOD_VOLUME_TOC_ITEMS = [
  { id: 'nadler', label: 'Nadler formula' },
  { id: 'lbb', label: 'Lemmens–Bernstein–Brodsky' },
  { id: 'weight', label: 'Weight-based estimate' },
];

export const BLOOD_VOLUME_FAQS = [
  {
    question: 'Why are male and female results both shown?',
    answer:
      'The reference UI compares sex-specific coefficients for each method from the same height and weight, so you can see both Nadler and indexed-volume estimates side by side.',
  },
  {
    question: 'Which method should I use?',
    answer:
      'Nadler is widely taught for normal-weight adults; Lemmens–Bernstein–Brodsky adjusts indexed volume across BMI; the weight-only method is a simple mL/kg shortcut. None replaces measured blood volume.',
  },
];