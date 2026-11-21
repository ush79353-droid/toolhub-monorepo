import type { ToolPageDetail } from '@/tools/page-detail';
import { YardsToMetersGuideArticle } from './YardsToMetersGuideArticle';
import { YARDS_TO_METERS_FAQS, YARDS_TO_METERS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert yards to meters and meters to yards instantly; 1 yard equals exactly 0.9144 meters.',
  asideAriaLabel: 'Interactive yards to meters conversion calculator',
  tocItems: YARDS_TO_METERS_TOC_ITEMS,
  GuideArticle: YardsToMetersGuideArticle,
  faqs: YARDS_TO_METERS_FAQS,
  countryRules: null,
};
