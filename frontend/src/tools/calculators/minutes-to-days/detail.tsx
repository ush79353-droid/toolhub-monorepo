import type { ToolPageDetail } from '@/tools/page-detail';
import { MinutesToDaysGuideArticle } from './MinutesToDaysGuideArticle';
import { M2D_FAQS, M2D_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert minutes to days and days to minutes. Exact: 1 day = 1,440 minutes.',
  asideAriaLabel: 'Interactive minutes to days calculator',
  tocItems: M2D_TOC_ITEMS,
  GuideArticle: MinutesToDaysGuideArticle,
  faqs: M2D_FAQS,
  countryRules: null,
};
