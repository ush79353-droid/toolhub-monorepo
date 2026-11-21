import type { ToolPageDetail } from '@/tools/page-detail';
import { FisherEffectGuideArticle } from './FisherEffectGuideArticle';
import { FISHER_EFFECT_FAQS, FISHER_EFFECT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate real interest rates, nominal interest rates, and expected inflation using the exact Fisher equation.',
  asideAriaLabel: 'Interactive Fisher Effect Calculator',
  tocItems: FISHER_EFFECT_TOC_ITEMS,
  GuideArticle: FisherEffectGuideArticle,
  faqs: FISHER_EFFECT_FAQS,
  countryRules: null,
};
