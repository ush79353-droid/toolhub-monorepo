export const DRUG_HALF_LIFE_TOC_ITEMS = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'formula', label: 'Elimination formula' },
  { id: 'assumptions', label: 'Assumptions & limits' },
  { id: 'faq', label: 'FAQ' },
];

export const DRUG_HALF_LIFE_FAQS = [
  {
    question: 'What does drug half-life mean?',
    answer:
      'Elimination half-life (t½) is the time for plasma concentration (or amount) to fall by half under first-order kinetics. After one half-life ≈50% remains; after two ≈25%; after five ≈3%.',
  },
  {
    question: 'How is remaining dosage calculated?',
    answer:
      'This tool uses Dosage(t) = Dosage(0) × 0.5^(t / t½). The results table lists successive half-life cycles (t = 0, 1×t½, 2×t½, …) with remaining mass and fractional concentration.',
  },
  {
    question: 'Why is there no drug-specific half-life table?',
    answer:
      'Published half-lives vary by formulation, age, organ function, and assay. Enter the half-life from a primary reference or label for the product you are studying. This calculator does not invent clinical PK tables.',
  },
  {
    question: 'Is this suitable for dosing decisions?',
    answer:
      'No. It is educational arithmetic for a single first-order bolus model. Real dosing needs a clinician, labeling, and patient-specific factors.',
  },
];
