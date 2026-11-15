import type { ToolPageDetail } from '@/tools/page-detail';
import { TreynorRatioGuideArticle } from './TreynorRatioGuideArticle';
import { TREYNOR_RATIO_FAQS, TREYNOR_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Measure excess return per unit of systematic market risk (beta).',
  asideAriaLabel: 'Interactive Treynor Ratio Calculator',
  tocItems: TREYNOR_RATIO_TOC_ITEMS,
  GuideArticle: TreynorRatioGuideArticle,
  faqs: TREYNOR_RATIO_FAQS,
  countryRules: null,
};
