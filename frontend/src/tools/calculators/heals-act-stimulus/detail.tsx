import type { ToolPageDetail } from '@/tools/page-detail';
import { HealsGuideArticle } from './HealsGuideArticle';
import { HEALS_FAQS, HEALS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical, hypothetical estimate of the proposed July 2020 HEALS Act second stimulus check — not a current benefit and not claimable today.',
  asideAriaLabel: 'HEALS Act second stimulus calculator guide',
  tocItems: HEALS_TOC_ITEMS,
  GuideArticle: HealsGuideArticle,
  faqs: HEALS_FAQS,
};
