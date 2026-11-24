export const PROSTATE_VOLUME_TOC_ITEMS = [
  { id: 'what-is', label: 'What is prostate gland volume?' },
  { id: 'psa', label: 'PSA test and normal range' },
  { id: 'formula', label: 'Prostate volume formula' },
  { id: 'how-to', label: 'How to use this calculator' },
  { id: 'faqs', label: 'FAQs' },
];

export const PROSTATE_VOLUME_FAQS = [
  {
    question: 'What is the difference between ellipsoid and bullet volume?',
    answer:
      'Ellipsoid uses V = L×H×W×(π/6). Bullet uses V = L×H×W×(5π/24) (π/4.8), which MacMahon et al. (Radiology 2009) found closer to planimetry for many glands under about 55 mL.',
  },
  {
    question: 'How is PSA density calculated?',
    answer:
      'PSA density = serum PSA (ng/mL) ÷ selected prostate volume (mL), reported as ng/mL². Open the Calculate PSA density section to enter PSA.',
  },
];
