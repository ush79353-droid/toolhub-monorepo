import type { ToolPageDetail } from '@/tools/page-detail';
import { WlpGuideArticle } from './WlpGuideArticle';
import { WLP_FAQS, WLP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute weight loss amount and percent from past and current weight — educational only.',
  asideAriaLabel: 'Interactive Weight Loss Percentage Calculator',
  tocItems: WLP_TOC_ITEMS,
  GuideArticle: WlpGuideArticle,
  faqs: WLP_FAQS,
  countryRules: null,
};
