import type { ToolPageDetail } from '@/tools/page-detail';
import { GstGuideArticle } from './GstGuideArticle';
import { GST_FAQS, GST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Generic GST rate tool: add or remove tax from a price using any rate you enter — distinct from Canada GST/QST calculators — gross is GST-inclusive, net is GST-exclusive, with independent FX on money fields.',
  asideAriaLabel: 'Interactive GST Calculator',
  tocItems: GST_TOC_ITEMS,
  GuideArticle: GstGuideArticle,
  faqs: GST_FAQS,
  countryRules: null,
};
