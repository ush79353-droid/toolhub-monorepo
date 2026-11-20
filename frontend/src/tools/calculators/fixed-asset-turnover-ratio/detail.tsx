import type { ToolPageDetail } from '@/tools/page-detail';
import { FixedAssetTurnoverRatioGuideArticle } from './FixedAssetTurnoverRatioGuideArticle';
import {
  FIXED_ASSET_TURNOVER_RATIO_FAQS,
  FIXED_ASSET_TURNOVER_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate fixed asset turnover — Revenue ÷ Average net fixed assets — from beginning and ending PP&E balances and period revenue.',
  asideAriaLabel: 'Interactive Fixed Asset Turnover Ratio Calculator',
  tocItems: FIXED_ASSET_TURNOVER_RATIO_TOC_ITEMS,
  GuideArticle: FixedAssetTurnoverRatioGuideArticle,
  faqs: FIXED_ASSET_TURNOVER_RATIO_FAQS,
  countryRules: null,
};
