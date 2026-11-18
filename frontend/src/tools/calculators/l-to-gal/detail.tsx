import type { ToolPageDetail } from '@/tools/page-detail';
import { LToGalGuideArticle } from './LToGalGuideArticle';
import { L_TO_GAL_FAQS, L_TO_GAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert liters to US or Imperial gallons instantly using exact volume factors (1 US gal = 3.785411784 L).',
  asideAriaLabel: 'Interactive liters to gallons converter',
  tocItems: L_TO_GAL_TOC_ITEMS,
  GuideArticle: LToGalGuideArticle,
  faqs: L_TO_GAL_FAQS,
  countryRules: null,
};
