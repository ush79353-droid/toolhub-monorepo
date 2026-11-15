import type { ToolPageDetail } from '@/tools/page-detail';
import { RoceGuideArticle } from './RoceGuideArticle';
import { ROCE_FAQS, ROCE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate return on capital employed from EBIT and capital employed using assets or equity.',
  asideAriaLabel: 'Interactive Return on Capital Employed Calculator',
  tocItems: ROCE_TOC_ITEMS,
  GuideArticle: RoceGuideArticle,
  faqs: ROCE_FAQS,
  countryRules: null,
};
