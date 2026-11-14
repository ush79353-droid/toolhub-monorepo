import type { ToolPageDetail } from '@/tools/page-detail';
import { HhiGuideArticle } from './HhiGuideArticle';
import { HHI_FAQS, HHI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Sum the squares of firm market shares (as percentages) to compute the Herfindahl-Hirschman Index.',
  asideAriaLabel: 'Interactive HHI calculator',
  tocItems: HHI_TOC_ITEMS,
  GuideArticle: HhiGuideArticle,
  faqs: HHI_FAQS,
  countryRules: null,
};
