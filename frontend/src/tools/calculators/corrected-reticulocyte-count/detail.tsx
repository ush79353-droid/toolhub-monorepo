import type { ToolPageDetail } from '@/tools/page-detail';
import { CorrectedReticulocyteCountGuideArticle } from './CorrectedReticulocyteCountGuideArticle';
import { CORRECTED_RETICULOCYTE_FAQS, CORRECTED_RETICULOCYTE_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'CRC (%) from hematocrit and reticulocyte % with optional RPI — educational hematology.',
  asideAriaLabel: 'Interactive Corrected Reticulocyte Count Calculator',
  tocItems: CORRECTED_RETICULOCYTE_TOC,
  GuideArticle: CorrectedReticulocyteCountGuideArticle,
  faqs: CORRECTED_RETICULOCYTE_FAQS,
  countryRules: null,
};