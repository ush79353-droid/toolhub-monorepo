import type { ToolPageDetail } from '@/tools/page-detail';
import { GdpGapGuideArticle } from './GdpGapGuideArticle';
import { GDP_GAP_FAQS, GDP_GAP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the percentage GDP gap from actual and potential GDP, with step-by-step calculations and economic interpretation.',
  asideAriaLabel: 'Interactive GDP Gap Calculator',
  tocItems: GDP_GAP_TOC_ITEMS,
  GuideArticle: GdpGapGuideArticle,
  faqs: GDP_GAP_FAQS,
  countryRules: null,
};
