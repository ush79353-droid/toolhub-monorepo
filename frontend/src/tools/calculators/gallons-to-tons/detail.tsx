import type { ToolPageDetail } from '@/tools/page-detail';
import { GalToTonsGuideArticle } from './GalToTonsGuideArticle';
import { GAL_TO_TONS_FAQS, GAL_TO_TONS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert gallons to tons using material density. Supports US/UK gallons, short tons, long tons, and metric tonnes.',
  asideAriaLabel: 'Interactive gallons to tons converter',
  tocItems: GAL_TO_TONS_TOC_ITEMS,
  GuideArticle: GalToTonsGuideArticle,
  faqs: GAL_TO_TONS_FAQS,
  countryRules: null,
};
