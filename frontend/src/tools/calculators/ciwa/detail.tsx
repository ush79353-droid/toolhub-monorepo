import type { ToolPageDetail } from '@/tools/page-detail';
import { CiwaGuideArticle } from './CiwaGuideArticle';
import { CIWA_FAQS, CIWA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational CIWA-Ar alcohol-withdrawal symptom score (Sullivan 1989) — ten items, max 67; not a diagnosis or medication order.',
  asideAriaLabel: 'Interactive CIWA Calculator',
  tocItems: CIWA_TOC_ITEMS,
  GuideArticle: CiwaGuideArticle,
  faqs: CIWA_FAQS,
  countryRules: null,
};
