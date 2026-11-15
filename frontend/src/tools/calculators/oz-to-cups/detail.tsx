import type { ToolPageDetail } from '@/tools/page-detail';
import { OZ_TO_CUPS_FAQS, OZ_TO_CUPS_TOC_ITEMS } from './content';
import { OzToCupsGuideArticle } from './OzToCupsGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert fluid ounces to cups and cups to fluid ounces. Choose US or Imperial fl oz and US customary, US legal, metric, or Imperial cups.',
  asideAriaLabel: 'Interactive oz to cups converter',
  tocItems: OZ_TO_CUPS_TOC_ITEMS,
  GuideArticle: OzToCupsGuideArticle,
  faqs: OZ_TO_CUPS_FAQS,
  countryRules: null,
};
