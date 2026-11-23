import type { ToolPageDetail } from '@/tools/page-detail';
import { RatePressureProductGuideArticle } from './RatePressureProductGuideArticle';
import {
  RATE_PRESSURE_PRODUCT_FAQS,
  RATE_PRESSURE_PRODUCT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational rate-pressure product from max heart rate and max systolic BP — a double-product index, not a clinical stress-test report.',
  asideAriaLabel: 'Interactive Rate Pressure Product Calculator',
  tocItems: RATE_PRESSURE_PRODUCT_TOC_ITEMS,
  GuideArticle: RatePressureProductGuideArticle,
  faqs: RATE_PRESSURE_PRODUCT_FAQS,
  countryRules: null,
};
