import type { ToolPageDetail } from '@/tools/page-detail';
import { NmConverterGuideArticle } from './NmConverterGuideArticle';
import { NM_FAQS, NM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert nanometers to µm, mm, m, inches, feet, and ångströms. Exact SI: 1 nm = 10⁻⁹ m.',
  asideAriaLabel: 'Interactive nanometer converter',
  tocItems: NM_TOC_ITEMS,
  GuideArticle: NmConverterGuideArticle,
  faqs: NM_FAQS,
  countryRules: null,
};
