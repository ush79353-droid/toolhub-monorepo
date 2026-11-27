import type { ToolPageDetail } from '@/tools/page-detail';
import { QuizProteinCreatinineRatioGuideArticle } from './QuizProteinCreatinineRatioGuideArticle';
import { QUIZ_PCR_FAQS, QUIZ_PCR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational protein-creatinine-ratio quiz; five questions; score out of five when complete.',
  asideAriaLabel: 'Interactive Protein Creatinine Ratio Quiz',
  tocItems: QUIZ_PCR_TOC_ITEMS,
  GuideArticle: QuizProteinCreatinineRatioGuideArticle,
  faqs: QUIZ_PCR_FAQS,
  countryRules: null,
};
