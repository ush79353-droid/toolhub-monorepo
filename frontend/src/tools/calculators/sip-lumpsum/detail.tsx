import type { ToolPageDetail } from '@/tools/page-detail';
import { SipLumpsumGuideArticle } from './SipLumpsumGuideArticle';
import { SIP_LUMPSUM_FAQS, SIP_LUMPSUM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project the combined future value of an initial lumpsum and SIP deposits with begin/end timing, compounding, optional inflation adjustment, and solve-for modes. Currency changes formatting only.',
  asideAriaLabel: 'Interactive SIP Calculator + Lumpsum',
  tocItems: SIP_LUMPSUM_TOC_ITEMS,
  GuideArticle: SipLumpsumGuideArticle,
  faqs: SIP_LUMPSUM_FAQS,
  countryRules: null,
};
