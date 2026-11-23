import type { ToolPageDetail } from '@/tools/page-detail';
import { Te2GuideArticle } from './Te2GuideArticle';
import { TE2_FAQS, TE2_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute the educational testosterone-to-estradiol (T/E2) mixed-unit index from lab concentrations. Not a diagnosis.',
  asideAriaLabel: 'Interactive Testosterone to Estradiol Ratio Calculator',
  tocItems: TE2_TOC_ITEMS,
  GuideArticle: Te2GuideArticle,
  faqs: TE2_FAQS,
  countryRules: null,
};