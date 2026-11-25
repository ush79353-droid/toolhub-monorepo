import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PSA_DT_TOC: readonly TableOfContentsItem[] = [
  { id: 'psa-dt-how-to-use', label: 'How to use the PSA DT calculator' },
  { id: 'psa-dt-interpreting', label: 'Interpreting your PSA doubling time' },
  { id: 'psa-dt-what-is-psa', label: 'What is PSA, and why PSA doubling time?' },
  { id: 'psa-dt-prostate-cancer', label: 'Prostate cancer and PSA DT info' },
  { id: 'psa-dt-faq', label: 'FAQs' },
];

export const PSA_DT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is PSA doubling time calculated?',
    answer:
      'For two positive rising measurements over Δt days: doubling time = Δt × ln(2) / ln(newer PSA ÷ older PSA). Falling or equal values do not show a positive doubling time.',
  },
  {
    question: 'What are PSA velocity and log slope?',
    answer:
      'Optional absolute PSA velocity is (newer − older PSA) ÷ elapsed time in years (ng/mL per year). Log slope is ln(newer ÷ older) ÷ elapsed time in years (per year). Enable “Show slope and velocity” in the calculator.',
  },
  {
    question: 'Are my lab values stored or shared?',
    answer:
      'No. PSA levels and dates stay in your browser. Share uses the public page URL only.',
  },
  {
    question: 'Does this diagnose prostate cancer?',
    answer:
      'No. This is an educational kinetics worksheet. Clinical interpretation belongs with a treating clinician.',
  },
];