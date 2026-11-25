import type { ToolPageDetail } from '@/tools/page-detail';
import { TidalVolumeGuideArticle } from './TidalVolumeGuideArticle';
import { TIDAL_VOLUME_FAQS, TIDAL_VOLUME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational 6–8 mL/kg Devine IBW tidal-volume range and Chula Ideal ETT depth from height and sex — not a ventilator or intubation order.',
  asideAriaLabel: 'Interactive Tidal Volume Calculator',
  tocItems: TIDAL_VOLUME_TOC_ITEMS,
  GuideArticle: TidalVolumeGuideArticle,
  faqs: TIDAL_VOLUME_FAQS,
  countryRules: null,
};
