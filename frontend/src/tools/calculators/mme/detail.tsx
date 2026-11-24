import type { ToolPageDetail } from '@/tools/page-detail';
import { MmeGuideArticle } from './MmeGuideArticle';
import { MME_FAQS, MME_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational CDC 2022 morphine milligram equivalents worksheet — not for opioid switching or prescribing.',
  asideAriaLabel: 'Interactive MME Calculator',
  tocItems: MME_TOC,
  GuideArticle: MmeGuideArticle,
  faqs: MME_FAQS,
  countryRules: null,
};
