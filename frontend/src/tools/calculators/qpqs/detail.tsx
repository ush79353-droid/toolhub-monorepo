import type { ToolPageDetail } from '@/tools/page-detail';
import { QpQsGuideArticle } from './QpQsGuideArticle';
import { QPQS_FAQS, QPQS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational pulmonary-to-systemic flow ratio (Qp/Qs) from echo, Fick oxygen content, or direct flows — not a cath or echo report.',
  asideAriaLabel: 'Interactive Qp/Qs Calculator',
  tocItems: QPQS_TOC_ITEMS,
  GuideArticle: QpQsGuideArticle,
  faqs: QPQS_FAQS,
  countryRules: null,
};