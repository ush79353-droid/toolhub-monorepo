import type { ToolPageDetail } from '@/tools/page-detail';
import { OuncesToMillilitersGuideArticle } from './OuncesToMillilitersGuideArticle';
import {
  OUNCES_TO_MILLILITERS_FAQS,
  OUNCES_TO_MILLILITERS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US or UK fluid ounces to milliliters. Exact: 1 US fl oz = 29.5735295625 mL; 1 UK fl oz = 28.4130625 mL. Volume only — not weight ounces.',
  asideAriaLabel: 'Interactive ounces to milliliters converter',
  tocItems: OUNCES_TO_MILLILITERS_TOC_ITEMS,
  GuideArticle: OuncesToMillilitersGuideArticle,
  faqs: OUNCES_TO_MILLILITERS_FAQS,
  countryRules: null,
};
