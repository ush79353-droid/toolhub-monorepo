import type { ToolPageDetail } from '@/tools/page-detail';
import { DEPRECIATION_FAQS, DEPRECIATION_TOC_ITEMS } from './content';
import { DepreciationGuideArticle } from './DepreciationGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate selected-year depreciation expense and end book value with straight-line, declining-balance, or sum-of-years’ digits methods — independent FX on money fields, whole-year periods only.',
  asideAriaLabel: 'Depreciation Calculator guide',
  tocItems: DEPRECIATION_TOC_ITEMS,
  GuideArticle: DepreciationGuideArticle,
  faqs: DEPRECIATION_FAQS,
  countryRules: null,
};
