import type { ToolPageDetail } from '@/tools/page-detail';
import { DeferredAnnuityGuideArticle } from './DeferredAnnuityGuideArticle';
import { DEFERRED_ANNUITY_FAQS, DEFERRED_ANNUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate deferred annuity accumulation and the monthly withdrawal that depletes the balance.',
  asideAriaLabel: 'Interactive Deferred Annuity Calculator',
  tocItems: DEFERRED_ANNUITY_TOC_ITEMS,
  GuideArticle: DeferredAnnuityGuideArticle,
  faqs: DEFERRED_ANNUITY_FAQS,
  countryRules: null,
};
