import type { ToolPageDetail } from '@/tools/page-detail';
import { AuditCGuideArticle } from './AuditCGuideArticle';
import { AUDITC_FAQS, AUDITC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational AUDIT-C consumption screen (0–12) — not a diagnosis of alcoholism.',
  asideAriaLabel: 'Interactive Audit-C Calculator',
  tocItems: AUDITC_TOC_ITEMS,
  GuideArticle: AuditCGuideArticle,
  faqs: AUDITC_FAQS,
  countryRules: null,
};
