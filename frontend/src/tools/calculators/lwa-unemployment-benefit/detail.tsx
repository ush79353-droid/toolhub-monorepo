import type { ToolPageDetail } from '@/tools/page-detail';
import { LwaUnemploymentBenefitGuideArticle } from './LwaUnemploymentBenefitGuideArticle';
import { LWA_UNEMPLOYMENT_FAQS, LWA_UNEMPLOYMENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical notice about FEMA Lost Wages Assistance (LWA). Not a current benefit calculator — use the Loan Calculator for installment estimates.',
  asideAriaLabel: 'Lost Wages Assistance historical unemployment benefit notice',
  tocItems: LWA_UNEMPLOYMENT_TOC_ITEMS,
  GuideArticle: LwaUnemploymentBenefitGuideArticle,
  faqs: LWA_UNEMPLOYMENT_FAQS,
  countryRules: null,
};
