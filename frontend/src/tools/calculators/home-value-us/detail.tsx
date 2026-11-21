import type { ToolPageDetail } from '@/tools/page-detail';
import { HomeValueUsGuideArticle } from './HomeValueUsGuideArticle';
import { HOME_VALUE_US_FAQS, HOME_VALUE_US_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how a US home’s indexed value changed using verified S&P CoreLogic Case-Shiller metro series and CPI-U inflation adjustment from FRED; not a property appraisal.',
  asideAriaLabel: 'Interactive Home Value Calculator (US)',
  tocItems: HOME_VALUE_US_TOC_ITEMS,
  GuideArticle: HomeValueUsGuideArticle,
  faqs: HOME_VALUE_US_FAQS,
  countryRules: null,
};
