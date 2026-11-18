import type { ToolPageDetail } from '@/tools/page-detail';
import { DebtToAssetRatioGuideArticle } from './DebtToAssetRatioGuideArticle';
import {
  DEBT_TO_ASSET_RATIO_FAQS,
  DEBT_TO_ASSET_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute the debt to assets ratio from long-term and short-term debt and total assets, with real FX on all money fields.',
  asideAriaLabel: 'Interactive Debt to Asset Ratio Calculator',
  tocItems: DEBT_TO_ASSET_RATIO_TOC_ITEMS,
  GuideArticle: DebtToAssetRatioGuideArticle,
  faqs: DEBT_TO_ASSET_RATIO_FAQS,
  countryRules: null,
};
