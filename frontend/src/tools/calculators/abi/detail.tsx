import type { ToolPageDetail } from '@/tools/page-detail';
import { AbiGuideArticle } from './AbiGuideArticle';
import { ABI_FAQS, ABI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute right and left ankle-brachial index from higher arm and foot systolic pressures (mmHg). Educational ratio only.',
  asideAriaLabel: 'Interactive ABI Calculator',
  tocItems: ABI_TOC_ITEMS,
  GuideArticle: AbiGuideArticle,
  faqs: ABI_FAQS,
  countryRules: null,
};
