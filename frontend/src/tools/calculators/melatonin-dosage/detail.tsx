import type { ToolPageDetail } from '@/tools/page-detail';
import { MelatoninDosageGuideArticle } from './MelatoninDosageGuideArticle';
import { MELATONIN_DOSAGE_FAQS, MELATONIN_DOSAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational melatonin label lookup: Circadin 2 mg SmPC for adults ≥55 when selected, and clear limits for US dietary-supplement forms. Not medical advice.',
  asideAriaLabel: 'Interactive Melatonin Dosage Calculator',
  tocItems: MELATONIN_DOSAGE_TOC_ITEMS,
  GuideArticle: MelatoninDosageGuideArticle,
  faqs: MELATONIN_DOSAGE_FAQS,
  countryRules: null,
};
