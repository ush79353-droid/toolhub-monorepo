import type { ToolPageDetail } from '@/tools/page-detail';
import { TotalAssetTurnoverGuideArticle } from './TotalAssetTurnoverGuideArticle';
import {
  TOTAL_ASSET_TURNOVER_FAQS,
  TOTAL_ASSET_TURNOVER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate total asset turnover: Revenue ÷ Average total assets; from beginning and ending asset balances and period revenue.',
  asideAriaLabel: 'Interactive Total Asset Turnover Calculator',
  tocItems: TOTAL_ASSET_TURNOVER_TOC_ITEMS,
  GuideArticle: TotalAssetTurnoverGuideArticle,
  faqs: TOTAL_ASSET_TURNOVER_FAQS,
  countryRules: null,
};
