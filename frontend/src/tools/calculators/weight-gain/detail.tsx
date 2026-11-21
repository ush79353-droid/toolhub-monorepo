import type { ToolPageDetail } from '@/tools/page-detail';
import { WeightGainGuideArticle } from './WeightGainGuideArticle';
import { WEIGHT_GAIN_FAQS, WEIGHT_GAIN_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate maintenance calories and a Normal or Strict surplus plan toward your target weight.',
  asideAriaLabel: 'Interactive Weight Gain Calculator',
  tocItems: WEIGHT_GAIN_TOC,
  GuideArticle: WeightGainGuideArticle,
  faqs: WEIGHT_GAIN_FAQS,
  countryRules: null,
};
