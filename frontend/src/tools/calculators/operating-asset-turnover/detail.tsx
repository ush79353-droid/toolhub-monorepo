import type { ToolPageDetail } from '@/tools/page-detail';
import { OperatingAssetTurnoverGuideArticle } from './OperatingAssetTurnoverGuideArticle';
import { OAT_FAQS, OAT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Sum operating asset lines, then divide sales by that total to get operating asset turnover. Currency changes the symbol only.',
  asideAriaLabel: 'Interactive operating asset turnover calculator',
  tocItems: OAT_TOC_ITEMS,
  GuideArticle: OperatingAssetTurnoverGuideArticle,
  faqs: OAT_FAQS,
  countryRules: null,
};
