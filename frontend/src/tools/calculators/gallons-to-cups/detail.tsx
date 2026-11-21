import type { ToolPageDetail } from '@/tools/page-detail';
import { GalToCupsGuideArticle } from './GalToCupsGuideArticle';
import { GAL_TO_CUPS_FAQS, GAL_TO_CUPS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US liquid gallons to US customary cups and back; 1 US gallon equals exactly 16 US cups.',
  asideAriaLabel: 'Interactive gallons to cups converter',
  tocItems: GAL_TO_CUPS_TOC_ITEMS,
  GuideArticle: GalToCupsGuideArticle,
  faqs: GAL_TO_CUPS_FAQS,
  countryRules: null,
};
