import type { ToolPageDetail } from '@/tools/page-detail';
import { WeightPercentileGuideArticle } from './WeightPercentileGuideArticle';
import {
  WEIGHT_PERCENTILE_FAQS,
  WEIGHT_PERCENTILE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a child’s weight-for-age percentile with WHO Child Growth Standards (0–60 months). Educational only — not a diagnosis.',
  asideAriaLabel: 'Interactive Weight Percentile Calculator',
  tocItems: WEIGHT_PERCENTILE_TOC_ITEMS,
  GuideArticle: WeightPercentileGuideArticle,
  faqs: WEIGHT_PERCENTILE_FAQS,
  countryRules: null,
};
