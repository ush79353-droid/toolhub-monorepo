import type { ToolPageDetail } from '@/tools/page-detail';
import { LcrGuideArticle } from './LcrGuideArticle';
import { LCR_FAQS, LCR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the liquidity coverage ratio (LCR) using high-quality liquid assets and 30-day net cash outflows. Understand the formula and Basel III benchmark.',
  asideAriaLabel: 'Interactive LCR Calculator',
  tocItems: LCR_TOC_ITEMS,
  GuideArticle: LcrGuideArticle,
  faqs: LCR_FAQS,
  countryRules: null,
};
