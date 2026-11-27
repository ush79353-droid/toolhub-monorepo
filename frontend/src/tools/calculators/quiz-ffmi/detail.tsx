import type { ToolPageDetail } from '@/tools/page-detail';
import { QuizFfmiGuideArticle } from './QuizFfmiGuideArticle';
import { QUIZ_FFMI_FAQS, QUIZ_FFMI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational FFMI quiz; eight sequential questions; score out of eight when complete.',
  asideAriaLabel: 'Interactive FFMI Quiz',
  tocItems: QUIZ_FFMI_TOC_ITEMS,
  GuideArticle: QuizFfmiGuideArticle,
  faqs: QUIZ_FFMI_FAQS,
  countryRules: null,
};
