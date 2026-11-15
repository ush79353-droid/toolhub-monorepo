import type { ToolPageDetail } from '@/tools/page-detail';
import { AverageCollectionPeriodGuideArticle } from './AverageCollectionPeriodGuideArticle';
import {
  AVERAGE_COLLECTION_PERIOD_FAQS,
  AVERAGE_COLLECTION_PERIOD_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how many days it takes to collect credit sales from average receivables or from the receivables turnover ratio. Compare the result with stated credit terms.',
  asideAriaLabel: 'Interactive average collection period calculator',
  tocItems: AVERAGE_COLLECTION_PERIOD_TOC_ITEMS,
  GuideArticle: AverageCollectionPeriodGuideArticle,
  faqs: AVERAGE_COLLECTION_PERIOD_FAQS,
  countryRules: null,
};
