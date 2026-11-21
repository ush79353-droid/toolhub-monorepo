import type { ToolPageDetail } from '@/tools/page-detail';
import { AverageVariableCostGuideArticle } from './AverageVariableCostGuideArticle';
import { AVC_FAQS, AVC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate average variable cost per unit from total variable costs and output (or reverse-solve variable costs or quantity) with clear handling when output or AVC is zero.',
  asideAriaLabel: 'Interactive Average Variable Cost Calculator',
  tocItems: AVC_TOC_ITEMS,
  GuideArticle: AverageVariableCostGuideArticle,
  faqs: AVC_FAQS,
  countryRules: null,
};
