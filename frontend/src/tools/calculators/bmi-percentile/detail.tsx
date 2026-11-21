import type { ToolPageDetail } from '@/tools/page-detail';
import { BmiPercentileGuideArticle } from './BmiPercentileGuideArticle';
import { BMI_PERCENTILE_FAQS, BMI_PERCENTILE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a child’s WHO BMI-for-age percentile (0–60 months) from BMI or from height and weight. Educational only — not a diagnosis.',
  asideAriaLabel: 'Interactive BMI Percentile Calculator',
  tocItems: BMI_PERCENTILE_TOC_ITEMS,
  GuideArticle: BmiPercentileGuideArticle,
  faqs: BMI_PERCENTILE_FAQS,
  countryRules: null,
};
