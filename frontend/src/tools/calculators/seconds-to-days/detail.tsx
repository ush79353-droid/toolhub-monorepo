import type { ToolPageDetail } from '@/tools/page-detail';
import { SecondsToDaysGuideArticle } from './SecondsToDaysGuideArticle';
import { S2D_FAQS, S2D_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert seconds to days and days to seconds. Exact: 1 day = 86,400 seconds (24-hour day).',
  asideAriaLabel: 'Interactive seconds to days converter',
  tocItems: S2D_TOC_ITEMS,
  GuideArticle: SecondsToDaysGuideArticle,
  faqs: S2D_FAQS,
  countryRules: null,
};
