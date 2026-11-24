import type { ToolPageDetail } from '@/tools/page-detail';
import { LocalAnestheticGuideArticle } from './LocalAnestheticGuideArticle';
import { LOCAL_ANESTHETIC_FAQS, LOCAL_ANESTHETIC_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational plain (no epinephrine) local anesthetic max dose worksheet — not a prescription.',
  asideAriaLabel: 'Interactive Local Anesthetic Calculator',
  tocItems: LOCAL_ANESTHETIC_TOC,
  GuideArticle: LocalAnestheticGuideArticle,
  faqs: LOCAL_ANESTHETIC_FAQS,
  countryRules: null,
};
