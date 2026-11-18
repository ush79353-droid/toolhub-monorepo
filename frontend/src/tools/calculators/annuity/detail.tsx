import type { ToolPageDetail } from '@/tools/page-detail';
import { AnnuityGuideArticle } from './AnnuityGuideArticle';
import { ANNUITY_FAQS, ANNUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve annuity present value, future value, payment, term, or rate for ordinary and due schedules with real currency conversion.',
  asideAriaLabel: 'Interactive Annuity Calculator',
  tocItems: ANNUITY_TOC_ITEMS,
  GuideArticle: AnnuityGuideArticle,
  faqs: ANNUITY_FAQS,
  countryRules: null,
};
