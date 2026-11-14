import type { ToolPageDetail } from '@/tools/page-detail';
import { DirectMaterialPriceVarianceGuideArticle } from './DirectMaterialPriceVarianceGuideArticle';
import { DMPV_FAQS, DMPV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate direct materials price variance from standard rate, actual rate, and quantity.',
  asideAriaLabel: 'Interactive Direct Material Price Variance Calculator',
  tocItems: DMPV_TOC_ITEMS,
  GuideArticle: DirectMaterialPriceVarianceGuideArticle,
  faqs: DMPV_FAQS,
  countryRules: null,
};
