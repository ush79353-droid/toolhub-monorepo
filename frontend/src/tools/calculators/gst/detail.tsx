import type { ToolPageDetail } from '@/tools/page-detail';
import { GstGuideArticle } from './GstGuideArticle';
import { GST_FAQS, GST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Add or remove GST from a price using any rate you enter — gross is GST-inclusive, net is GST-exclusive — with independent FX on money fields.',
  asideAriaLabel: 'Interactive GST Calculator',
  tocItems: GST_TOC_ITEMS,
  GuideArticle: GstGuideArticle,
  faqs: GST_FAQS,
  countryRules: null,
};
