import type { ToolPageDetail } from '@/tools/page-detail';
import { AuditScoreGuideArticle } from './AuditScoreGuideArticle';
import { AUDIT_SCORE_FAQS, AUDIT_SCORE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational WHO AUDIT (10-item) alcohol screening with consumption, dependence, and problems domains — not a diagnosis.',
  asideAriaLabel: 'Interactive Audit Score Calculator',
  tocItems: AUDIT_SCORE_TOC_ITEMS,
  GuideArticle: AuditScoreGuideArticle,
  faqs: AUDIT_SCORE_FAQS,
  countryRules: null,
};
