import type { ToolPageDetail } from '@/tools/page-detail';
import { BloodDonorGuideArticle } from './BloodDonorGuideArticle';
import { BLOOD_DONOR_FAQS, BLOOD_DONOR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational ABO/Rh compatibility for red cells and plasma — not a substitute for crossmatch or local blood-bank rules.',
  asideAriaLabel: 'Interactive Blood Donor Calculator',
  tocItems: BLOOD_DONOR_TOC_ITEMS,
  GuideArticle: BloodDonorGuideArticle,
  faqs: BLOOD_DONOR_FAQS,
  countryRules: null,
};