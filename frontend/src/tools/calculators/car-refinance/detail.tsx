import type { ToolPageDetail } from '@/tools/page-detail';
import { CarRefinanceGuideArticle } from './CarRefinanceGuideArticle';
import { CAR_REFINANCE_FAQS, CAR_REFINANCE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare your remaining car loan with a refinance offer; monthly payment, total interest, and total payments side by side, with independent Phase 2 FX on money fields.',
  asideAriaLabel: 'Interactive Car Refinance Calculator',
  tocItems: CAR_REFINANCE_TOC_ITEMS,
  GuideArticle: CarRefinanceGuideArticle,
  faqs: CAR_REFINANCE_FAQS,
  countryRules: null,
};
