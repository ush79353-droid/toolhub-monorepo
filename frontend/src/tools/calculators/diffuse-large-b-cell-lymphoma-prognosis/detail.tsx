import type { ToolPageDetail } from '@/tools/page-detail';
import { DiffuseLargeBCellLymphomaPrognosisGuideArticle } from './DiffuseLargeBCellLymphomaPrognosisGuideArticle';
import { DLBCL_FAQS, DLBCL_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'R-IPI score with 4-year PFS/OS from the rituximab-era cohort — educational oncology.',
  asideAriaLabel: 'Interactive Diffuse Large B-cell Lymphoma Prognosis Calculator',
  tocItems: DLBCL_TOC,
  GuideArticle: DiffuseLargeBCellLymphomaPrognosisGuideArticle,
  faqs: DLBCL_FAQS,
  countryRules: null,
};