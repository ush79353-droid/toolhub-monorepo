export const GASTRIC_SLEEVE_TOC_ITEMS = [
  { id: 'ewl-vs-twl', label: '%EWL vs %TWL' },
  { id: 'population-estimate', label: 'Population estimate' },
  { id: 'limits', label: 'Limits' },
];

export const GASTRIC_SLEEVE_FAQS = [
  {
    question: 'Does this predict my personal weight after sleeve surgery?',
    answer:
      'No. The tool applies a published population mean percent excess weight loss (%EWL) for sleeve gastrectomy at about one year. Individual outcomes vary widely with starting BMI, comorbidities, technique, and adherence.',
  },
  {
    question: 'What is the difference between %EWL and %TWL?',
    answer:
      'Percent total weight loss (%TWL) is loss ÷ baseline weight. Percent excess weight loss (%EWL) is loss ÷ (baseline − reference weight). This calculator uses %EWL with a BMI 25 kg/m² reference weight, matching common bariatric reporting.',
  },
  {
    question: 'Which published figure is used?',
    answer:
      'Observational sleeve gastrectomy year-1 mean %EWL ≈ 51.5% from Chang et al., JAMA Surgery 2014 (meta-analysis of bariatric procedures, 2003–2012). RCT arms in the same paper reported higher point estimates with wide intervals; this tool uses the larger observational SG pool.',
  },
];
