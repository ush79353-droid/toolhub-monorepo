import type { ToolPageDetail } from '@/tools/page-detail';
import {
  FIFTY_THIRTY_TWENTY_FAQS,
  FIFTY_THIRTY_TWENTY_TOC_ITEMS,
} from './content';
import { FiftyThirtyTwentyGuideArticle } from './FiftyThirtyTwentyGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Divide monthly after-tax income into 50% necessities, 30% wants, and 20% savings, with monthly and annual views. Currency changes formatting only.',
  asideAriaLabel: '50/30/20 Rule Calculator guide',
  tocItems: FIFTY_THIRTY_TWENTY_TOC_ITEMS,
  GuideArticle: FiftyThirtyTwentyGuideArticle,
  faqs: FIFTY_THIRTY_TWENTY_FAQS,
  countryRules: null,
};
