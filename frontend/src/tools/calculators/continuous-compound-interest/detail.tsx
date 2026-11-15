import type { ToolPageDetail } from '@/tools/page-detail';
import { ContinuousCompoundInterestGuideArticle } from './ContinuousCompoundInterestGuideArticle';
import {
  CONTINUOUS_COMPOUND_INTEREST_FAQS,
  CONTINUOUS_COMPOUND_INTEREST_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate final balance and compound interest with continuous compounding and optional deposits.',
  asideAriaLabel: 'Interactive continuous compound interest calculator',
  tocItems: CONTINUOUS_COMPOUND_INTEREST_TOC_ITEMS,
  GuideArticle: ContinuousCompoundInterestGuideArticle,
  faqs: CONTINUOUS_COMPOUND_INTEREST_FAQS,
  countryRules: null,
};
