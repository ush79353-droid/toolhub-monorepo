import type { ToolPageDetail } from '@/tools/page-detail';
import { FreeWaterDeficitGuideArticle } from './FreeWaterDeficitGuideArticle';
import {
  FREE_WATER_DEFICIT_FAQS,
  FREE_WATER_DEFICIT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate free water deficit from demographic TBW and serum sodium — educational only.',
  asideAriaLabel: 'Interactive Free Water Deficit Calculator',
  tocItems: FREE_WATER_DEFICIT_TOC_ITEMS,
  GuideArticle: FreeWaterDeficitGuideArticle,
  faqs: FREE_WATER_DEFICIT_FAQS,
  countryRules: null,
};
