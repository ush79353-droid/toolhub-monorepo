import type { ToolPageDetail } from '@/tools/page-detail';
import { LfprGuideArticle } from './LfprGuideArticle';
import { LFPR_FAQS, LFPR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate labor force participation rate using employed, unemployed, and working-age populations. Get LFPR, labor force, and unemployment rate instantly.',
  asideAriaLabel: 'Interactive Labor Force Participation Rate Calculator',
  tocItems: LFPR_TOC_ITEMS,
  GuideArticle: LfprGuideArticle,
  faqs: LFPR_FAQS,
  countryRules: null,
};
