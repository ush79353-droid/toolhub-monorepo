import type { ToolPageDetail } from '@/tools/page-detail';
import { CcToOzGuideArticle } from './CcToOzGuideArticle';
import { CC_TO_OZ_FAQS, CC_TO_OZ_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cubic centimeters (cc) to US or UK fluid ounces instantly. Exact factors: 1 US fl oz = 29.5735295625 cc; 1 UK fl oz = 28.4130625 cc. Volume only — not weight ounces.',
  asideAriaLabel: 'Interactive cc to oz converter',
  tocItems: CC_TO_OZ_TOC_ITEMS,
  GuideArticle: CcToOzGuideArticle,
  faqs: CC_TO_OZ_FAQS,
  countryRules: null,
};
