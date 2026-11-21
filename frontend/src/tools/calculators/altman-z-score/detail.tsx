import type { ToolPageDetail } from '@/tools/page-detail';
import { AltmanZScoreGuideArticle } from './AltmanZScoreGuideArticle';
import { ALTMAN_Z_SCORE_FAQS, ALTMAN_Z_SCORE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Use this Altman Z-Score Calculator to assess a company's financial distress risk using five financial ratios. Enter its working capital, retained earnings, operating income, market value of equity, total assets, and total liabilities to calculate the Altman Z-Score and understand the resulting financial risk category.",
  asideAriaLabel: 'Interactive Altman Z-Score Calculator',
  tocItems: ALTMAN_Z_SCORE_TOC_ITEMS,
  GuideArticle: AltmanZScoreGuideArticle,
  faqs: ALTMAN_Z_SCORE_FAQS,
  countryRules: null,
};
