import type { ToolPageDetail } from '@/tools/page-detail';
import { ZuluTimeGuideArticle } from './ZuluTimeGuideArticle';
import { ZULU_FAQS, ZULU_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Zulu time (UTC) to local time. Pick a country or IANA zone; offsets and DST follow the selected date.',
  asideAriaLabel: 'Interactive Zulu time converter',
  tocItems: ZULU_TOC_ITEMS,
  GuideArticle: ZuluTimeGuideArticle,
  faqs: ZULU_FAQS,
  countryRules: null,
};
