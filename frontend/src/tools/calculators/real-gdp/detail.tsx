import type { ToolPageDetail } from '@/tools/page-detail';
import { RealGdpGuideArticle } from './RealGdpGuideArticle';
import { REAL_GDP_FAQS, REAL_GDP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate real gross domestic product (GDP) by adjusting nominal GDP for changes in the overall price level. Enter nominal GDP and the GDP deflator to find inflation-adjusted economic output.',
  asideAriaLabel: 'Interactive Real GDP Calculator',
  tocItems: REAL_GDP_TOC_ITEMS,
  GuideArticle: RealGdpGuideArticle,
  faqs: REAL_GDP_FAQS,
  countryRules: null,
};
