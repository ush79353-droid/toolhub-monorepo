import type { ToolPageDetail } from '@/tools/page-detail';
import { KtvDaugirdasGuideArticle } from './KtvDaugirdasGuideArticle';
import { KTV_DAUGIRDAS_FAQS, KTV_DAUGIRDAS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate educational single-pool Daugirdas Kt/V and urea reduction ratio from pre/post BUN, session time, ultrafiltration, and post-dialysis weight.',
  asideAriaLabel: 'Interactive Kt/V Calculator Daugirdas',
  tocItems: KTV_DAUGIRDAS_TOC_ITEMS,
  GuideArticle: KtvDaugirdasGuideArticle,
  faqs: KTV_DAUGIRDAS_FAQS,
  countryRules: null,
};
