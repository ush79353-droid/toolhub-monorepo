import type { ToolPageDetail } from '@/tools/page-detail';
import { CaresActUnemploymentBenefitGuideArticle } from './CaresActUnemploymentBenefitGuideArticle';
import {
  CARES_ACT_UNEMPLOYMENT_FAQS,
  CARES_ACT_UNEMPLOYMENT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical notice about CARES Act pandemic unemployment relief. Not a current benefit calculator. Use the Unemployment Calculator for unemployment-rate math.',
  asideAriaLabel: 'CARES Act unemployment benefit historical notice',
  tocItems: CARES_ACT_UNEMPLOYMENT_TOC_ITEMS,
  GuideArticle: CaresActUnemploymentBenefitGuideArticle,
  faqs: CARES_ACT_UNEMPLOYMENT_FAQS,
  countryRules: null,
};
