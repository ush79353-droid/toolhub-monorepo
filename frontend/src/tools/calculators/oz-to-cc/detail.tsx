import type { ToolPageDetail } from '@/tools/page-detail';
import { OzToCcGuideArticle } from './OzToCcGuideArticle';
import { OZ_TO_CC_FAQS, OZ_TO_CC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US or UK fluid ounces to cubic centimeters (cc = mL). Exact: 1 US fl oz = 29.5735295625 cc; 1 UK fl oz = 28.4130625 cc. Volume only — not weight ounces.',
  asideAriaLabel: 'Interactive oz to cc converter',
  tocItems: OZ_TO_CC_TOC_ITEMS,
  GuideArticle: OzToCcGuideArticle,
  faqs: OZ_TO_CC_FAQS,
  countryRules: null,
};
