import type { ToolPageDetail } from '@/tools/page-detail';
import { FfoGuideArticle } from './FfoGuideArticle';
import { FFO_FAQS, FFO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate REIT funds from operations: FFO = Net income + Qualifying D&A − Property sale gains + Property sale losses; with an optional interest-income exclusion.',
  asideAriaLabel: 'Interactive FFO Calculator',
  tocItems: FFO_TOC_ITEMS,
  GuideArticle: FfoGuideArticle,
  faqs: FFO_FAQS,
  countryRules: null,
};
