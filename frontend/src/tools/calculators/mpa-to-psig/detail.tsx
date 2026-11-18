import type { ToolPageDetail } from '@/tools/page-detail';
import { MpaToPsigGuideArticle } from './MpaToPsigGuideArticle';
import { MPA_TO_PSIG_FAQS, MPA_TO_PSIG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert MPa(g) to psig and psig to MPa(g) instantly. Gauge-to-gauge via Pa — no atmospheric offset.',
  asideAriaLabel: 'Interactive MPa to PSIG converter',
  tocItems: MPA_TO_PSIG_TOC_ITEMS,
  GuideArticle: MpaToPsigGuideArticle,
  faqs: MPA_TO_PSIG_FAQS,
  countryRules: null,
};
