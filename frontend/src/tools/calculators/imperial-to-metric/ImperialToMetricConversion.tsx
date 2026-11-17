'use client';

import type { ToolComponentProps } from '@/tools/types';
import { ImperialCalculator } from '../imperial/ImperialCalculator';

/** Same measurement hub as Imperial Calculator; distinct catalog route + branding. */
export function ImperialToMetricConversion(props: ToolComponentProps) {
  return (
    <ImperialCalculator
      {...props}
      brandName="Imperial to Metric Conversion"
      panelSubtitle="Imperial / US → metric by category"
      resultHeading="Imperial to metric"
    />
  );
}
