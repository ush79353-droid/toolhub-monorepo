import type { ToolPageDetail } from '@/tools/page-detail';
import { BuildVsBuyGuideArticle } from './BuildVsBuyGuideArticle';
import { BUILD_VS_BUY_FAQS, BUILD_VS_BUY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare the annual cost of buying software with the cost to build and maintain it in-house, including payback years.',
  asideAriaLabel: 'Interactive build vs buy calculator',
  tocItems: BUILD_VS_BUY_TOC_ITEMS,
  GuideArticle: BuildVsBuyGuideArticle,
  faqs: BUILD_VS_BUY_FAQS,
  countryRules: null,
};
