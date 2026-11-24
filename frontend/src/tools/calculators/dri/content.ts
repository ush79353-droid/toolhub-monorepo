export const DRI_TOC_ITEMS = [
  { id: 'what-is-dri', label: 'What is DRI?' },
  { id: 'energy-and-macros', label: 'Energy and macronutrients' },
  { id: 'micronutrients', label: 'Vitamins and minerals' },
  { id: 'smoking', label: 'Smoking and vitamin C' },
];

export const DRI_FAQS = [
  {
    question: 'What does DRI mean?',
    answer:
      'Dietary Reference Intakes (DRIs) are National Academies nutrient reference values for healthy people in the US and Canada. This tool surfaces Recommended Dietary Allowances (RDA) when published, otherwise Adequate Intakes (AI), plus AMDR ranges for macronutrients from estimated calories.',
  },
  {
    question: 'Why does the age menu use bands instead of an exact age?',
    answer:
      'Micronutrient RDAs and AIs are published by life-stage group. Energy uses the Harris–Benedict equation with a fixed representative age inside each band (for example age 25 for 19–50 years) multiplied by the selected activity factor, because a continuous age is not entered.',
  },
  {
    question: 'Does the smoker checkbox change every nutrient?',
    answer:
      'No. Only vitamin C adds 35 mg/day for people who smoke, matching NIH Office of Dietary Supplements guidance. Other DRI rows are unchanged by the smoker toggle.',
  },
];
