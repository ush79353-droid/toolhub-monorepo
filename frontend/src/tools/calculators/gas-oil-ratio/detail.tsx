import type { ToolPageDetail } from '@/tools/page-detail';
import { GasOilRatioGuideArticle } from './GasOilRatioGuideArticle';
import { GAS_OIL_FAQS, GAS_OIL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate two-stroke gasoline and oil premix volumes for 50:1, 40:1, 32:1, 25:1, or custom ratios — with unit conversions and a practical mixing chart.',
  asideAriaLabel: 'Interactive Gas Oil Ratio Calculator',
  tocItems: GAS_OIL_TOC_ITEMS,
  GuideArticle: GasOilRatioGuideArticle,
  faqs: GAS_OIL_FAQS,
  countryRules: null,
};
