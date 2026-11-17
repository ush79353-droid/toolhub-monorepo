import type { ToolPageDetail } from '@/tools/page-detail';
import { GrossMarginGuideArticle } from './GrossMarginGuideArticle';
import { GROSS_MARGIN_FAQS, GROSS_MARGIN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate gross profit and gross margin from revenue and COGS, with real FX on every money field.',
  asideAriaLabel: 'Interactive Gross Margin Calculator',
  tocItems: GROSS_MARGIN_TOC_ITEMS,
  GuideArticle: GrossMarginGuideArticle,
  faqs: GROSS_MARGIN_FAQS,
  countryRules: null,
};
