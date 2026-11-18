import type { ToolPageDetail } from '@/tools/page-detail';
import { KgToLiterGuideArticle } from './KgToLiterGuideArticle';
import { KG_TO_LITER_FAQS, KG_TO_LITER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilograms to liters and liters to kilograms using substance density. Fresh water defaults to ≈ 1 kg/L.',
  asideAriaLabel: 'Interactive kg to liter converter',
  tocItems: KG_TO_LITER_TOC_ITEMS,
  GuideArticle: KgToLiterGuideArticle,
  faqs: KG_TO_LITER_FAQS,
  countryRules: null,
};
