import type { ToolPageDetail } from '@/tools/page-detail';
import { PgE2GuideArticle } from './PgE2GuideArticle';
import { PGE2_FAQS, PGE2_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute the educational progesterone-to-estradiol (Pg/E2) mass ratio from lab concentrations. Not a diagnosis.',
  asideAriaLabel: 'Interactive Progesterone to Estrogen Ratio Calculator',
  tocItems: PGE2_TOC_ITEMS,
  GuideArticle: PgE2GuideArticle,
  faqs: PGE2_FAQS,
  countryRules: null,
};
