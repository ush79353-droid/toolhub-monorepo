import type { ToolPageDetail } from '@/tools/page-detail';
import {
  REMOTE_VS_ON_LOCATION_FAQS,
  REMOTE_VS_ON_LOCATION_TOC_ITEMS,
} from './content';
import { RemoteVsOnLocationGuideArticle } from './RemoteVsOnLocationGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare remote per-employee allowances with on-location office costs over a chosen period — including lease vs own, recurring frequencies, custom expenses, and cost per employee. Currency changes formatting only.',
  asideAriaLabel: 'Remote vs. On-Location Workers Calculator guide',
  tocItems: REMOTE_VS_ON_LOCATION_TOC_ITEMS,
  GuideArticle: RemoteVsOnLocationGuideArticle,
  faqs: REMOTE_VS_ON_LOCATION_FAQS,
  countryRules: null,
};
