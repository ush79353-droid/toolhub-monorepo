import type { ToolPageDetail } from '@/tools/page-detail';
import { SipGuideArticle } from './SipGuideArticle';
import { SIP_FAQS, SIP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate SIP maturity from monthly contributions, years, and expected annual return — with independent FX on money fields.',
  asideAriaLabel: 'Interactive SIP Calculator',
  tocItems: SIP_TOC_ITEMS,
  GuideArticle: SipGuideArticle,
  faqs: SIP_FAQS,
  countryRules: null,
};
