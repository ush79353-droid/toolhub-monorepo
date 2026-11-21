import type { ToolPageDetail } from '@/tools/page-detail';
import { GdpGrowthGuideArticle } from './GdpGrowthGuideArticle';
import { GDP_GROWTH_FAQS, GDP_GROWTH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate GDP growth rates from current and previous GDP with formulas, step-by-step examples, and economic explanations.',
  asideAriaLabel: 'Interactive GDP Growth Rate Calculator',
  tocItems: GDP_GROWTH_TOC_ITEMS,
  GuideArticle: GdpGrowthGuideArticle,
  faqs: GDP_GROWTH_FAQS,
  countryRules: null,
};
