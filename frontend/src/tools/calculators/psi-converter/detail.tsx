import type { ToolPageDetail } from '@/tools/page-detail';
import { PsiConverterGuideArticle } from './PsiConverterGuideArticle';
import { PSI_CONVERTER_FAQS, PSI_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert PSI to bar, atm, Pa, kPa, and more. Exact international pound-force per square inch factors via Pascals.',
  asideAriaLabel: 'Interactive PSI pressure converter',
  tocItems: PSI_CONVERTER_TOC_ITEMS,
  GuideArticle: PsiConverterGuideArticle,
  faqs: PSI_CONVERTER_FAQS,
  countryRules: null,
};
