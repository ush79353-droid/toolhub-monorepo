import type { ToolPageDetail } from '@/tools/page-detail';
import { CmHeightConversionGuideArticle } from './CmHeightConversionGuideArticle';
import { CM_HEIGHT_FAQS, CM_HEIGHT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert height between centimeters, feet and inches, meters, millimeters, and decimal feet with exact international factors.',
  asideAriaLabel: 'Interactive CM height conversion calculator',
  tocItems: CM_HEIGHT_TOC_ITEMS,
  GuideArticle: CmHeightConversionGuideArticle,
  faqs: CM_HEIGHT_FAQS,
  countryRules: null,
};
