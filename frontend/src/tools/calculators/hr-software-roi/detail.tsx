import type { ToolPageDetail } from '@/tools/page-detail';
import { HR_SOFTWARE_ROI_FAQS, HR_SOFTWARE_ROI_TOC_ITEMS } from './content';
import { HrSoftwareRoiGuideArticle } from './HrSoftwareRoiGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate HR software return on investment from total cost and gross financial benefits — or expand an itemized cost-and-benefit breakdown for the same ROI formula. Currency changes formatting only.',
  asideAriaLabel: 'HR Software ROI Calculator guide',
  tocItems: HR_SOFTWARE_ROI_TOC_ITEMS,
  GuideArticle: HrSoftwareRoiGuideArticle,
  faqs: HR_SOFTWARE_ROI_FAQS,
  countryRules: null,
};
