import type { ToolPageDetail } from '@/tools/page-detail';
import { SkinfoldBodyFatGuideArticle } from './SkinfoldBodyFatGuideArticle';
import { SKINFOLD_FAQS, SKINFOLD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate body fat % from four skinfolds with Durnin–Womersley density equations and Siri conversion. Educational only; ages under 17 are gated.',
  asideAriaLabel: 'Interactive Skinfold Body Fat Calculator',
  tocItems: SKINFOLD_TOC_ITEMS,
  GuideArticle: SkinfoldBodyFatGuideArticle,
  faqs: SKINFOLD_FAQS,
  countryRules: null,
};
