export const KTV_DAUGIRDAS_TOC_ITEMS = [
  { id: 'what-is-ktv', label: 'What does Kt/V stand for in dialysis?' },
  { id: 'normal-ktv', label: 'What is normal Kt/V?' },
  { id: 'ktv-vs-urr', label: 'Difference between Kt/V and URR' },
  { id: 'how-to-calculate', label: 'How to calculate Kt/V in dialysis?' },
  { id: 'faqs', label: 'FAQs' },
];

export const KTV_DAUGIRDAS_FAQS = [
  {
    question: 'Which Daugirdas formula does this use?',
    answer:
      'The single-pool second-generation formula: Kt/V = −ln(R − 0.008×t) + (4 − 3.5×R)×(UF/W), with R = post/pre BUN, t in hours, UF in liters, and W post-dialysis weight in kg (Daugirdas, JASN 1993/1995).',
  },
  {
    question: 'How is URR calculated?',
    answer:
      'URR (%) = 100 × (1 − R), where R is the post-/pre-dialysis BUN ratio. Example: 60 → 18 mg/dL gives URR 70%.',
  },
  {
    question: 'When is Kt/V undefined?',
    answer:
      'When R − 0.008×t is not positive, or post-dialysis weight is not positive. The worksheet rejects those inputs rather than returning NaN.',
  },
];
