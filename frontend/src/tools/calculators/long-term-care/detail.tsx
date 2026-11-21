import type { ToolPageDetail } from '@/tools/page-detail';
import { LONG_TERM_CARE_FAQS, LONG_TERM_CARE_TOC_ITEMS } from './content';
import { LongTermCareGuideArticle } from './LongTermCareGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate future long-term care expenses from a daily or monthly rate, with annual inflation over multiple years. Currency changes formatting only.',
  asideAriaLabel: 'Long Term Care Calculator guide',
  tocItems: LONG_TERM_CARE_TOC_ITEMS,
  GuideArticle: LongTermCareGuideArticle,
  faqs: LONG_TERM_CARE_FAQS,
  countryRules: null,
};
