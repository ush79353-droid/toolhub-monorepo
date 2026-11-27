import type { ToolPageDetail } from '@/tools/page-detail';
import { AcidBaseGuideArticle } from './AcidBaseGuideArticle';
import { ACID_BASE_FAQS, ACID_BASE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational ABG framing with serum anion gap and Figge albumin correction — not a clinical diagnosis.',
  asideAriaLabel: 'Interactive Acid Base Calculator',
  tocItems: ACID_BASE_TOC_ITEMS,
  GuideArticle: AcidBaseGuideArticle,
  faqs: ACID_BASE_FAQS,
  countryRules: null,
};
