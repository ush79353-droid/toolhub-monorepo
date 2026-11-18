import type { ToolPageDetail } from '@/tools/page-detail';
import { MgToCcGuideArticle } from './MgToCcGuideArticle';
import { MG_TO_CC_FAQS, MG_TO_CC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mg to cc using medication concentration or substance density. 1 cc = 1 mL. Mass and volume are not interchangeable without that factor.',
  asideAriaLabel: 'Interactive mg to cc conversion calculator',
  tocItems: MG_TO_CC_TOC_ITEMS,
  GuideArticle: MgToCcGuideArticle,
  faqs: MG_TO_CC_FAQS,
  countryRules: null,
};
