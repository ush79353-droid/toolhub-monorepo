import type { ToolPageDetail } from '@/tools/page-detail';
import { PascalConversionGuideArticle } from './PascalConversionGuideArticle';
import { PASCAL_FAQS, PASCAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pascals to bar, PSI, atmospheres, Torr, kPa, and MPa. Exact: 1 atm = 101,325 Pa; 1 bar = 100,000 Pa.',
  asideAriaLabel: 'Interactive Pascal conversion calculator',
  tocItems: PASCAL_TOC_ITEMS,
  GuideArticle: PascalConversionGuideArticle,
  faqs: PASCAL_FAQS,
  countryRules: null,
};
