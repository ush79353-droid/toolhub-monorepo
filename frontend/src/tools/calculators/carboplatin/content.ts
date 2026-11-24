export const CARBOPLATIN_TOC_ITEMS = [
  { id: 'gfr', label: 'GFR estimation' },
  { id: 'calvert', label: 'Calvert formula' },
];

export const CARBOPLATIN_FAQS = [
  {
    question: 'Which GFR equation is used?',
    answer:
      'Cockcroft–Gault creatinine clearance in mL/min with the female 0.85 multiplier — treated as absolute GFR for Calvert dosing in this educational tool.',
  },
  {
    question: 'What is the maximum dose field?',
    answer:
      'It applies the common practice of capping estimated GFR at 125 mL/min before Calvert dose = AUC × (GFR + 25).',
  },
];