import type { ToolPageDetail } from '@/tools/page-detail';
import { PensionGuideArticle } from './PensionGuideArticle';
import { PENSION_FAQS, PENSION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare a pension lump sum invested at your assumed return against a COLA-adjusted monthly pension. Currency changes formatting only. Informational — not financial advice.',
  asideAriaLabel: 'Interactive Pension Calculator',
  tocItems: PENSION_TOC_ITEMS,
  GuideArticle: PensionGuideArticle,
  faqs: PENSION_FAQS,
  countryRules: null,
};
