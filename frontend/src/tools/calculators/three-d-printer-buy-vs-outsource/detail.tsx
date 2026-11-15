import type { ToolPageDetail } from '@/tools/page-detail';
import { PRINTER_FAQS, PRINTER_TOC_ITEMS } from './content';
import { ThreeDPrinterBuyVsOutsourceGuideArticle } from './ThreeDPrinterBuyVsOutsourceGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare the cost of owning a 3D printer with outsourcing the same parts, including failures, power, maintenance, and shipping.',
  asideAriaLabel: 'Interactive 3D printer buy versus outsource calculator',
  tocItems: PRINTER_TOC_ITEMS,
  GuideArticle: ThreeDPrinterBuyVsOutsourceGuideArticle,
  faqs: PRINTER_FAQS,
  countryRules: null,
};
