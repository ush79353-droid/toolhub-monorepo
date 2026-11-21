import type { ToolPageDetail } from '@/tools/page-detail';
import { MileageReimbursementGuideArticle } from './MileageReimbursementGuideArticle';
import {
  MILEAGE_REIMBURSEMENT_FAQS,
  MILEAGE_REIMBURSEMENT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a nominal combined IRS standard-mileage amount for business, medical, and charitable driving, with verified year/period rates and mi/km conversion. Fixed USD.',
  asideAriaLabel: 'Interactive Mileage Reimbursement Calculator',
  tocItems: MILEAGE_REIMBURSEMENT_TOC_ITEMS,
  GuideArticle: MileageReimbursementGuideArticle,
  faqs: MILEAGE_REIMBURSEMENT_FAQS,
  countryRules: null,
};
