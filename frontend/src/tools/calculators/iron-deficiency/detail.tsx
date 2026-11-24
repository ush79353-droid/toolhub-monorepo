import type { ToolPageDetail } from '@/tools/page-detail';
import { IronDeficiencyGuideArticle } from './IronDeficiencyGuideArticle';
import { IRON_DEFICIENCY_FAQS, IRON_DEFICIENCY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Ganzoni iron deficit from weight and hemoglobin — not an IV iron prescription or laboratory report.',
  asideAriaLabel: 'Interactive Iron Deficiency Calculator',
  tocItems: IRON_DEFICIENCY_TOC_ITEMS,
  GuideArticle: IronDeficiencyGuideArticle,
  faqs: IRON_DEFICIENCY_FAQS,
  countryRules: null,
};
