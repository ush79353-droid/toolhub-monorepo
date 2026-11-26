import type { ToolPageDetail } from '@/tools/page-detail';
import { WhtrGuideArticle } from './WhtrGuideArticle';
import { WHTR_FAQS, WHTR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute waist-to-height ratio (waist ÷ height) — educational only.',
  asideAriaLabel: 'Interactive Waist to Height Ratio Calculator',
  tocItems: WHTR_TOC_ITEMS,
  GuideArticle: WhtrGuideArticle,
  faqs: WHTR_FAQS,
  countryRules: null,
};
