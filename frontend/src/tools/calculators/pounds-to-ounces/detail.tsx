import type { ToolPageDetail } from '@/tools/page-detail';
import { PoundsToOuncesGuideArticle } from './PoundsToOuncesGuideArticle';
import { POUNDS_TO_OUNCES_FAQS, POUNDS_TO_OUNCES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pounds to ounces and ounces to pounds instantly. Exact: 1 lb = 16 oz (avoirdupois mass).',
  asideAriaLabel: 'Interactive pounds to ounces converter',
  tocItems: POUNDS_TO_OUNCES_TOC_ITEMS,
  GuideArticle: PoundsToOuncesGuideArticle,
  faqs: POUNDS_TO_OUNCES_FAQS,
  countryRules: null,
};
