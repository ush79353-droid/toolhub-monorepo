import type { ToolPageDetail } from '@/tools/page-detail';
import { LgdGuideArticle } from './LgdGuideArticle';
import { LGD_FAQS, LGD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Loss Given Default (LGD), recovery rates, loss severity, and estimated credit losses using a simple credit risk formula. Distinguish LGD amount (loss if default occurs) from Expected Loss (PD × LGD × EAD).',
  asideAriaLabel: 'Interactive LGD Calculator – Loss Given Default',
  tocItems: LGD_TOC_ITEMS,
  GuideArticle: LgdGuideArticle,
  faqs: LGD_FAQS,
  countryRules: null,
};
