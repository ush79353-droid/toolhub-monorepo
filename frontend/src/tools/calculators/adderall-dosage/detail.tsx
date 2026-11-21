import type { ToolPageDetail } from '@/tools/page-detail';
import { AdderallDosageGuideArticle } from './AdderallDosageGuideArticle';
import { ADDERALL_FAQS, ADDERALL_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Explore Adderall immediate-release educational label charts and convert a clinician-prescribed mg amount into tablet quantity arithmetic. Not a prescription. XR is out of scope.',
  asideAriaLabel: 'Adderall Dosage Calculator panel',
  tocItems: ADDERALL_TOC,
  GuideArticle: AdderallDosageGuideArticle,
  faqs: ADDERALL_FAQS,
  countryRules: null,
};
