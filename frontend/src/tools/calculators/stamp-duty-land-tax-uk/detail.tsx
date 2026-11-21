import type { ToolPageDetail } from '@/tools/page-detail';
import { StampDutyLandTaxUkGuideArticle } from './StampDutyLandTaxUkGuideArticle';
import {
  STAMP_DUTY_LAND_TAX_UK_FAQS,
  STAMP_DUTY_LAND_TAX_UK_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate England & Northern Ireland residential Stamp Duty Land Tax from buyer scenario, residency, and property price using HMRC marginal bands. Fixed GBP.',
  asideAriaLabel: 'Interactive Stamp Duty Land Tax Calculator UK',
  tocItems: STAMP_DUTY_LAND_TAX_UK_TOC_ITEMS,
  GuideArticle: StampDutyLandTaxUkGuideArticle,
  faqs: STAMP_DUTY_LAND_TAX_UK_FAQS,
  countryRules: null,
};
