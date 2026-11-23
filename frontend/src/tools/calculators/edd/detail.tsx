import type { ToolPageDetail } from '@/tools/page-detail';
import { EddGuideArticle } from './EddGuideArticle';
import { EDD_FAQS, EDD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational LMP vs ultrasound estimated due date comparison using ACOG-style calendar math. Compares gestational ages — does not choose a clinical due date.',
  asideAriaLabel: 'Interactive EDD Calculator',
  tocItems: EDD_TOC_ITEMS,
  GuideArticle: EddGuideArticle,
  faqs: EDD_FAQS,
  countryRules: null,
};
