import type { ToolPageDetail } from '@/tools/page-detail';
import { MpgToL100GuideArticle } from './MpgToL100GuideArticle';
import { MPG_FAQS, MPG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US mpg, UK mpg, L/100 km, and km/L with exact mile and gallon definitions.',
  asideAriaLabel: 'Interactive MPG to L/100 km converter',
  tocItems: MPG_TOC_ITEMS,
  GuideArticle: MpgToL100GuideArticle,
  faqs: MPG_FAQS,
  countryRules: null,
};
