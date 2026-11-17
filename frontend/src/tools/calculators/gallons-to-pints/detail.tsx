import type { ToolPageDetail } from '@/tools/page-detail';
import { GalToPintsGuideArticle } from './GalToPintsGuideArticle';
import { GAL_TO_PINTS_FAQS, GAL_TO_PINTS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US and UK gallons to pints instantly — synchronized US gal, UK gal, US pt, and UK pt with exact liter factors.',
  asideAriaLabel: 'Interactive gallons to pints converter',
  tocItems: GAL_TO_PINTS_TOC_ITEMS,
  GuideArticle: GalToPintsGuideArticle,
  faqs: GAL_TO_PINTS_FAQS,
  countryRules: null,
};
