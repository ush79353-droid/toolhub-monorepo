import type { ToolPageDetail } from '@/tools/page-detail';
import { BloodVolumeGuideArticle } from './BloodVolumeGuideArticle';
import { BLOOD_VOLUME_FAQS, BLOOD_VOLUME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate total blood volume with Nadler, Lemmens–Bernstein–Brodsky, and weight-based adult formulas.',
  asideAriaLabel: 'Interactive Blood Volume Calculator',
  tocItems: BLOOD_VOLUME_TOC_ITEMS,
  GuideArticle: BloodVolumeGuideArticle,
  faqs: BLOOD_VOLUME_FAQS,
  countryRules: null,
};