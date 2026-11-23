import type { ToolPageDetail } from '@/tools/page-detail';
import { EroaMitralRegurgitationGuideArticle } from './EroaMitralRegurgitationGuideArticle';
import { EROA_FAQS, EROA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational PISA effective regurgitant orifice area for mitral regurgitation — hemispherical 2πr²Va flow, EROA, and regurgitant volume. Not an MR grade.',
  asideAriaLabel: 'Interactive EROA Mitral Regurgitation Calculator',
  tocItems: EROA_TOC_ITEMS,
  GuideArticle: EroaMitralRegurgitationGuideArticle,
  faqs: EROA_FAQS,
  countryRules: null,
};
