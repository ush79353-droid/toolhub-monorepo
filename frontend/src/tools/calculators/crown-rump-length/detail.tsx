import type { ToolPageDetail } from '@/tools/page-detail';
import { CrownRumpLengthGuideArticle } from './CrownRumpLengthGuideArticle';
import { CRL_FAQS, CRL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational first-trimester gestational age from crown–rump length using the Robinson–Fleming equation. Not a clinical ultrasound report.',
  asideAriaLabel: 'Interactive Crown-rump Length Calculator',
  tocItems: CRL_TOC_ITEMS,
  GuideArticle: CrownRumpLengthGuideArticle,
  faqs: CRL_FAQS,
  countryRules: null,
};
