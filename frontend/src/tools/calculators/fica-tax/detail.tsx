import type { ToolPageDetail } from '@/tools/page-detail';
import { FicaTaxGuideArticle } from './FicaTaxGuideArticle';
import { FICA_FAQS, FICA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate US Social Security, Medicare, and Additional Medicare Tax for employees or the self-employed using verified IRS and SSA rates for tax years 2025 and 2026. Fixed USD — educational FICA estimate, not a complete payroll tax return.',
  asideAriaLabel: 'Interactive FICA Tax Calculator',
  tocItems: FICA_TOC_ITEMS,
  GuideArticle: FicaTaxGuideArticle,
  faqs: FICA_FAQS,
  countryRules: null,
};
