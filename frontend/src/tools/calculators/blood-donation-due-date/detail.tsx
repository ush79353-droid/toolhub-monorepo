import type { ToolPageDetail } from '@/tools/page-detail';
import { BloodDonationDueDateGuideArticle } from './BloodDonationDueDateGuideArticle';
import {
  BLOOD_DONATION_DUE_DATE_FAQS,
  BLOOD_DONATION_DUE_DATE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the earliest next whole-blood donation date from your last donation using NHS-style male/female waits or a custom period.',
  asideAriaLabel: 'Interactive Blood Donation Due Date Calculator',
  tocItems: BLOOD_DONATION_DUE_DATE_TOC_ITEMS,
  GuideArticle: BloodDonationDueDateGuideArticle,
  faqs: BLOOD_DONATION_DUE_DATE_FAQS,
  countryRules: null,
};
