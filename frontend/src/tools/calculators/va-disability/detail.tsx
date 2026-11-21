import type { ToolPageDetail } from '@/tools/page-detail';
import { VaDisabilityGuideArticle } from './VaDisabilityGuideArticle';
import { VA_DISABILITY_FAQS, VA_DISABILITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a combined VA disability rating with the remaining-efficiency method, then a monthly amount from the December 1, 2025 compensation table. Not an official VA decision.',
  asideAriaLabel: 'VA Disability Calculator guide',
  tocItems: VA_DISABILITY_TOC_ITEMS,
  GuideArticle: VaDisabilityGuideArticle,
  faqs: VA_DISABILITY_FAQS,
  countryRules: null,
};
