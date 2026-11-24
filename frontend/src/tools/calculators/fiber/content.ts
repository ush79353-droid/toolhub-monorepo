export const FIBER_TOC_ITEMS = [
  { id: 'energy-scaled', label: 'Energy-scaled fiber target' },
  { id: 'ai-tables', label: 'IOM Adequate Intake' },
  { id: 'energy-base', label: 'Energy base' },
];

export const FIBER_FAQS = [
  {
    question: 'How is recommended fiber calculated from calories?',
    answer:
      'Institute of Medicine Dietary Reference Intakes use an energy-density basis of 14 grams of total fiber per 1,000 kcal. Target grams = daily kcal × 14 / 1,000 (for example, 2,000 kcal → 28 g).',
  },
  {
    question: 'What is the Adequate Intake (AI) table?',
    answer:
      'IOM also publishes life-stage and sex Adequate Intake values for total fiber (for example, men 19–50 y: 38 g/day; women 19–50 y: 25 g/day). This calculator keeps that age/sex AI lookup distinct from the energy-scaled estimate.',
  },
  {
    question: 'Where do the calories come from?',
    answer:
      'Enter recommended daily calorie intake directly, or leave it blank and provide sex, age, height, weight, and activity so maintenance energy can be estimated with Mifflin–St Jeor × activity PAL.',
  },
];
