import type { ToolPageDetail } from '@/tools/page-detail';
import { GastricSleeveWeightLossGuideArticle } from './GastricSleeveWeightLossGuideArticle';
import { GASTRIC_SLEEVE_FAQS, GASTRIC_SLEEVE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational sleeve gastrectomy population weight-loss estimate from published %EWL — not an individual forecast.',
  asideAriaLabel: 'Interactive Gastric Sleeve Weight Loss Calculator',
  tocItems: GASTRIC_SLEEVE_TOC_ITEMS,
  GuideArticle: GastricSleeveWeightLossGuideArticle,
  faqs: GASTRIC_SLEEVE_FAQS,
  countryRules: null,
};
