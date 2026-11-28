import type { ToolPageDetail } from '@/tools/page-detail';
import { RpmGuideArticle } from './RpmGuideArticle';
import { RPM_FAQS, RPM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate engine RPM, wheel RPM, drivetrain ratio, tire diameter, and vehicle speed with bidirectional rotational-speed formulas.',
  asideAriaLabel: 'Interactive RPM Calculator',
  tocItems: RPM_TOC_ITEMS,
  GuideArticle: RpmGuideArticle,
  faqs: RPM_FAQS,
  countryRules: null,
};
