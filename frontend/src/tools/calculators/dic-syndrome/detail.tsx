import type { ToolPageDetail } from '@/tools/page-detail';
import { DicSyndromeGuideArticle } from './DicSyndromeGuideArticle';
import { DIC_SYNDROME_FAQS, DIC_SYNDROME_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'ISTH overt DIC diagnostic score — educational coagulation screening.',
  asideAriaLabel: 'Interactive DIC Syndrome Calculator',
  tocItems: DIC_SYNDROME_TOC,
  GuideArticle: DicSyndromeGuideArticle,
  faqs: DIC_SYNDROME_FAQS,
  countryRules: null,
};