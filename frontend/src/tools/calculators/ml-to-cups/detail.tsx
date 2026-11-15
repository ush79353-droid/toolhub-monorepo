import type { ToolPageDetail } from '@/tools/page-detail';
import { ML_TO_CUPS_FAQS, ML_TO_CUPS_TOC_ITEMS } from './content';
import { MlToCupsGuideArticle } from './MlToCupsGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliliters to cups and cups to milliliters. Choose US customary, US legal, metric, or imperial cup standards.',
  asideAriaLabel: 'Interactive mL to cups converter',
  tocItems: ML_TO_CUPS_TOC_ITEMS,
  GuideArticle: MlToCupsGuideArticle,
  faqs: ML_TO_CUPS_FAQS,
  countryRules: null,
};
