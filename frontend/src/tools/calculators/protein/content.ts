export const PROTEIN_TOC_ITEMS = [
  { id: 'general', label: 'General IOM / AMDR' },
  { id: 'sport', label: 'Sport ACSM bands' },
  { id: 'energy', label: 'Energy base' },
];

export const PROTEIN_FAQS = [
  {
    question: 'How is the general protein target calculated?',
    answer:
      'Weight-based grams use the Institute of Medicine Recommended Dietary Allowance in g/kg for the life-stage band (0.80 g/kg for adults 19+). Separately, Acceptable Macronutrient Distribution Range (AMDR) protein shares of 10–35% of energy convert to grams with 4 kcal per gram when calories are known.',
  },
  {
    question: 'What changes in Recommendations for sport?',
    answer:
      'A training-focus control appears. Grams = body weight (kg) × published ACSM teaching g/kg ranges: endurance 1.2–1.4, strength/power 1.6–1.7, or the broad ACSM/AND/DC athletic band 1.2–2.0 g/kg. These are educational ranges, not prescriptions.',
  },
  {
    question: 'Do calories and g/kg always match?',
    answer:
      'No. AMDR grams come only from daily energy; g/kg targets come only from body weight. Enter calories directly or leave them blank and estimate maintenance with Mifflin–St Jeor × activity. Compare both views independently.',
  },
];
