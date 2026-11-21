import type { ToolPageDetail } from '@/tools/page-detail';
import { FalseNegativePregnancyTestGuideArticle } from './FalseNegativePregnancyTestGuideArticle';
import { FALSE_NEGATIVE_FAQS, FALSE_NEGATIVE_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Learn why pregnancy tests can read negative early, and use the same educational timing widget as the Pregnancy Test Calculator—without fake false-negative probabilities.',
  asideAriaLabel: 'False-negative pregnancy test timing widget',
  tocItems: FALSE_NEGATIVE_TOC,
  GuideArticle: FalseNegativePregnancyTestGuideArticle,
  faqs: FALSE_NEGATIVE_FAQS,
  countryRules: null,
};
