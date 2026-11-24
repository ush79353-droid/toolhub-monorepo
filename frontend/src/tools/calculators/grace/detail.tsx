import type { ToolPageDetail } from '@/tools/page-detail';
import { GraceGuideArticle } from './GraceGuideArticle';
import { GRACE_FAQS, GRACE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational GRACE 1.0 point score (Granger 2003) with in-hospital mortality risk categories — not a treatment or triage order.',
  asideAriaLabel: 'Interactive GRACE Calculator',
  tocItems: GRACE_TOC_ITEMS,
  GuideArticle: GraceGuideArticle,
  faqs: GRACE_FAQS,
  countryRules: null,
};