import type { ToolPageDetail } from '@/tools/page-detail';
import { PregnancyGuideArticle } from './PregnancyGuideArticle';
import { PREGNANCY_FAQS, PREGNANCY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our Pregnancy Calculator to estimate due date and schedule milestones from due date, LMP, ultrasound, conception, or IVF transfer (ACOG-style educational dating).',
  asideAriaLabel: 'Interactive Pregnancy Calculator',
  tocItems: PREGNANCY_TOC_ITEMS,
  GuideArticle: PregnancyGuideArticle,
  faqs: PREGNANCY_FAQS,
  countryRules: null,
};
