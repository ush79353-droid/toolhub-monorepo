import type { ToolPageDetail } from '@/tools/page-detail';
import { FatIntakeGuideArticle } from './FatIntakeGuideArticle';
import { FAT_INTAKE_FAQS, FAT_INTAKE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Total fat grams from AMDR energy shares and saturated-fat upper guidance, with optional Mifflin–St Jeor maintenance.',
  asideAriaLabel: 'Interactive Fat Intake Calculator',
  tocItems: FAT_INTAKE_TOC_ITEMS,
  GuideArticle: FatIntakeGuideArticle,
  faqs: FAT_INTAKE_FAQS,
  countryRules: null,
};
