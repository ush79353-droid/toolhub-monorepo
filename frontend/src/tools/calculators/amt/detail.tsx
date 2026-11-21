import type { ToolPageDetail } from '@/tools/page-detail';
import { AmtGuideArticle } from './AmtGuideArticle';
import { AMT_FAQS, AMT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate historical US federal alternative minimum tax (AMT) for tax years 2022 and 2023 from AMTI, filing status, and permitted credits. Fixed USD; tentative AMT estimate, not additional AMT versus regular tax.',
  asideAriaLabel: 'Interactive AMT Calculator',
  tocItems: AMT_TOC_ITEMS,
  GuideArticle: AmtGuideArticle,
  faqs: AMT_FAQS,
  countryRules: null,
};
