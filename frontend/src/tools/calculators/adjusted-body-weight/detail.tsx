import type { ToolPageDetail } from '@/tools/page-detail';
import { AdjustedBodyWeightGuideArticle } from './AdjustedBodyWeightGuideArticle';
import {
  ADJUSTED_BODY_WEIGHT_FAQS,
  ADJUSTED_BODY_WEIGHT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Robinson ideal body weight and 0.4 adjusted body weight from height and actual weight — educational nutrition worksheet.',
  asideAriaLabel: 'Interactive Adjusted Body Weight Calculator',
  tocItems: ADJUSTED_BODY_WEIGHT_TOC_ITEMS,
  GuideArticle: AdjustedBodyWeightGuideArticle,
  faqs: ADJUSTED_BODY_WEIGHT_FAQS,
  countryRules: null,
};
