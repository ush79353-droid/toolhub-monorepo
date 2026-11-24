import type { ToolPageDetail } from '@/tools/page-detail';
import { IifymGuideArticle } from './IifymGuideArticle';
import { IIFYM_FAQS, IIFYM_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate maintenance calories and USDA AMDR macro ranges, with optional Normal or Strict weight-change pacing.',
  asideAriaLabel: 'Interactive IIFYM Calculator',
  tocItems: IIFYM_TOC,
  GuideArticle: IifymGuideArticle,
  faqs: IIFYM_FAQS,
  countryRules: null,
};
