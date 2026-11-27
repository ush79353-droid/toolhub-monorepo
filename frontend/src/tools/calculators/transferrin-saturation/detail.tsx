import type { ToolPageDetail } from '@/tools/page-detail';
import { TsatGuideArticle } from './TsatGuideArticle';
import { TSAT_FAQS, TSAT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational transferrin saturation from Fe/TIBC or Fe/transferrin — not a diagnosis.',
  asideAriaLabel: 'Interactive Transferrin Saturation Calculator',
  tocItems: TSAT_TOC_ITEMS,
  GuideArticle: TsatGuideArticle,
  faqs: TSAT_FAQS,
  countryRules: null,
};
