import type { ToolPageDetail } from '@/tools/page-detail';
import { KgToOunceGuideArticle } from './KgToOunceGuideArticle';
import { KG_TO_OUNCE_FAQS, KG_TO_OUNCE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilograms to avoirdupois ounces instantly. Exact: 1 oz = 0.028349523125 kg. Includes troy ounces and pounds & ounces.',
  asideAriaLabel: 'Interactive kg to ounce converter',
  tocItems: KG_TO_OUNCE_TOC_ITEMS,
  GuideArticle: KgToOunceGuideArticle,
  faqs: KG_TO_OUNCE_FAQS,
  countryRules: null,
};
