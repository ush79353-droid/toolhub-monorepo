import type { ToolPageDetail } from '@/tools/page-detail';
import { BradfordFactorGuideArticle } from './BradfordFactorGuideArticle';
import { BRADFORD_FACTOR_FAQS, BRADFORD_FACTOR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the Bradford Factor from absence spells and total days absent using B = S × S × D.',
  asideAriaLabel: 'Interactive Bradford Factor calculator',
  tocItems: BRADFORD_FACTOR_TOC_ITEMS,
  GuideArticle: BradfordFactorGuideArticle,
  faqs: BRADFORD_FACTOR_FAQS,
  countryRules: null,
};
