import type { ToolPageDetail } from '@/tools/page-detail';
import { FlangeSizeGuideArticle } from './FlangeSizeGuideArticle';
import { FLANGE_SIZE_FAQS, FLANGE_SIZE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Map nipple base diameter to Spectra Baby USA flange sizes using their published table. Educational fit guide — confirm comfort while pumping.',
  asideAriaLabel: 'Interactive Flange Size Calculator',
  tocItems: FLANGE_SIZE_TOC_ITEMS,
  GuideArticle: FlangeSizeGuideArticle,
  faqs: FLANGE_SIZE_FAQS,
  countryRules: null,
};
