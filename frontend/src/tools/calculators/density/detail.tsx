import type { ToolPageDetail } from '@/tools/page-detail';
import { DensityGuideArticle } from './DensityGuideArticle';
import { DENSITY_FAQS, DENSITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert density between kg/m³, kg/dm³, lb/cu ft, lb/cu yd, and lb/US gal — synchronized through kilograms per cubic meter.',
  asideAriaLabel: 'Interactive density conversion calculator',
  tocItems: DENSITY_TOC_ITEMS,
  GuideArticle: DensityGuideArticle,
  faqs: DENSITY_FAQS,
  countryRules: null,
};
