import type { ToolPageDetail } from '@/tools/page-detail';
import { HomeAffordabilityGuideArticle } from './HomeAffordabilityGuideArticle';
import {
  HOME_AFFORDABILITY_FAQS,
  HOME_AFFORDABILITY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how much home you may afford from a monthly housing budget or income and DTI limits — with taxes, insurance, HOA, mortgage insurance, and clear payment vs income modes.',
  asideAriaLabel: 'Interactive Home Affordability Calculator',
  tocItems: HOME_AFFORDABILITY_TOC_ITEMS,
  GuideArticle: HomeAffordabilityGuideArticle,
  faqs: HOME_AFFORDABILITY_FAQS,
  countryRules: null,
};
