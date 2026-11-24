import type { ToolPageDetail } from '@/tools/page-detail';
import { NetCarbsGuideArticle } from './NetCarbsGuideArticle';
import { NET_CARBS_FAQS, NET_CARBS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate net carbohydrates from a nutrition label — total carbs minus fiber (when the label includes it) and sugar alcohols, with optional meal servings and calories.',
  asideAriaLabel: 'Interactive Net Carbs Calculator',
  tocItems: NET_CARBS_TOC_ITEMS,
  GuideArticle: NetCarbsGuideArticle,
  faqs: NET_CARBS_FAQS,
  countryRules: null,
};
