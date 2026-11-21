import type { ToolPageDetail } from '@/tools/page-detail';
import { MarriageTaxGuideArticle } from './MarriageTaxGuideArticle';
import { MARRIAGE_TAX_FAQS, MARRIAGE_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare estimated 2026 U.S. tax if two people file under their before-marriage statuses versus married filing jointly — a simplified marriage penalty/bonus estimate.',
  asideAriaLabel: 'Interactive Marriage Tax Calculator',
  tocItems: MARRIAGE_TAX_TOC_ITEMS,
  GuideArticle: MarriageTaxGuideArticle,
  faqs: MARRIAGE_TAX_FAQS,
  countryRules: null,
};
