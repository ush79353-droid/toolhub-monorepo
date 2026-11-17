import type { ToolPageDetail } from '@/tools/page-detail';
import { GalToKgGuideArticle } from './GalToKgGuideArticle';
import { GAL_TO_KG_FAQS, GAL_TO_KG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US and UK gallons to kilograms using material density. Reverse convert kg to gallons with the same density.',
  asideAriaLabel: 'Interactive gal to kg converter',
  tocItems: GAL_TO_KG_TOC_ITEMS,
  GuideArticle: GalToKgGuideArticle,
  faqs: GAL_TO_KG_FAQS,
  countryRules: null,
};
