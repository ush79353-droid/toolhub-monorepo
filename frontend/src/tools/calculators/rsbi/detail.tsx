import type { ToolPageDetail } from '@/tools/page-detail';
import { RsbiGuideArticle } from './RsbiGuideArticle';
import { RSBI_FAQS, RSBI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational rapid shallow breathing index (RSBI = f ÷ VT in liters) — not an extubation order.',
  asideAriaLabel: 'Interactive RSBI Calculator',
  tocItems: RSBI_TOC_ITEMS,
  GuideArticle: RsbiGuideArticle,
  faqs: RSBI_FAQS,
  countryRules: null,
};
