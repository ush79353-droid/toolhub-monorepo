import type { ToolPageDetail } from '@/tools/page-detail';
import { LidocaineDoseGuideArticle } from './LidocaineDoseGuideArticle';
import { LIDOCAINE_DOSE_FAQS, LIDOCAINE_DOSE_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational FDA plain-lidocaine maximum subcutaneous dose worksheet — not a prescription.',
  asideAriaLabel: 'Interactive Lidocaine Dose Calculator',
  tocItems: LIDOCAINE_DOSE_TOC,
  GuideArticle: LidocaineDoseGuideArticle,
  faqs: LIDOCAINE_DOSE_FAQS,
  countryRules: null,
};
