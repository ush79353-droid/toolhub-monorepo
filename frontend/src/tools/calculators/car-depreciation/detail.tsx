import type { ToolPageDetail } from '@/tools/page-detail';
import { CarDepreciationGuideArticle } from './CarDepreciationGuideArticle';
import { CAR_DEPRECIATION_FAQS, CAR_DEPRECIATION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a car’s reduced value from its age, then project illustrative values 1 minute and 1–5 years ahead using a transparent constant annual depreciation rate.',
  asideAriaLabel: 'Interactive Car Depreciation Calculator',
  tocItems: CAR_DEPRECIATION_TOC_ITEMS,
  GuideArticle: CarDepreciationGuideArticle,
  faqs: CAR_DEPRECIATION_FAQS,
  countryRules: null,
};
