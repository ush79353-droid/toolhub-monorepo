import type { ToolPageDetail } from '@/tools/page-detail';
import { WindsockGuideArticle } from './WindsockGuideArticle';
import { WINDSOCK_FAQS, WINDSOCK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate wind speed from extended windsock segments (≈3 kn each) and convert between knots, mph, km/h, m/s, and ft/s — approximate visual model only.',
  asideAriaLabel: 'Interactive Windsock Calculator',
  tocItems: WINDSOCK_TOC_ITEMS,
  GuideArticle: WindsockGuideArticle,
  faqs: WINDSOCK_FAQS,
  countryRules: null,
};
