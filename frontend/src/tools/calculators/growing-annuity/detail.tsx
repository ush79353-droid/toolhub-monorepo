import type { ToolPageDetail } from '@/tools/page-detail';
import { GrowingAnnuityGuideArticle } from './GrowingAnnuityGuideArticle';
import { GROWING_ANNUITY_FAQS, GROWING_ANNUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve growing-annuity present value, future value, or payment with growth, compounding, and real currency conversion.',
  asideAriaLabel: 'Interactive Growing Annuity Calculator',
  tocItems: GROWING_ANNUITY_TOC_ITEMS,
  GuideArticle: GrowingAnnuityGuideArticle,
  faqs: GROWING_ANNUITY_FAQS,
  countryRules: null,
};
