import type { ToolPageDetail } from '@/tools/page-detail';
import { AccumulatedDepreciationGuideArticle } from './AccumulatedDepreciationGuideArticle';
import {
  ACCUMULATED_DEPRECIATION_FAQS,
  ACCUMULATED_DEPRECIATION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate accumulated depreciation and net book value with straight line, declining balance, sum of the year’s digits, or units of production.',
  asideAriaLabel: 'Interactive accumulated depreciation calculator',
  tocItems: ACCUMULATED_DEPRECIATION_TOC_ITEMS,
  GuideArticle: AccumulatedDepreciationGuideArticle,
  faqs: ACCUMULATED_DEPRECIATION_FAQS,
  countryRules: null,
};
