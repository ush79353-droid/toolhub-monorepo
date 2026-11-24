import type { ToolPageDetail } from '@/tools/page-detail';
import { OpioidConversionGuideArticle } from './OpioidConversionGuideArticle';
import { OPIOID_CONVERSION_FAQS, OPIOID_CONVERSION_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational equianalgesic opioid dose comparison using CDC, FDA labeling caveats, and NHS Scottish Palliative Care Guidelines—never for automatic rotation or prescribing.',
  asideAriaLabel: 'Interactive Opioid Conversion Calculator',
  tocItems: OPIOID_CONVERSION_TOC,
  GuideArticle: OpioidConversionGuideArticle,
  faqs: OPIOID_CONVERSION_FAQS,
  countryRules: null,
};
