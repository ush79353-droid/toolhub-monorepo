import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ABSENCE_PERCENTAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-absenteeism-rate', label: 'What Is Absenteeism Rate?' },
  { id: 'how-to-calculate', label: 'How to Calculate Absence Percentage' },
  { id: 'absenteeism-formula', label: 'Absenteeism Rate Formula' },
  { id: 'calculation-examples', label: 'Calculation Examples' },
  { id: 'consequences', label: 'Consequences of Employee Absenteeism' },
  { id: 'why-monitor', label: 'Why Companies Monitor Absence Rates' },
  { id: 'how-to-interpret', label: 'How to Interpret Absenteeism Rates' },
  { id: 'absence-percentage-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; note?: string }[];
  tableHeaders?: readonly [string, string, string?];
}

export const ABSENCE_PERCENTAGE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-absenteeism-rate',
    title: 'What Is Absenteeism Rate?',
    paragraphs: [
      'Absenteeism rate (also called absence percentage) measures how much scheduled work time is lost to employee absences. It compares total employee-days missed with the total employee-workdays that were available in the same period.',
      'Human resources, operations, and finance teams use the rate to spot trends, plan coverage, and estimate productivity impact. It is a workforce metric, not a medical or disciplinary judgment about any individual.',
    ],
  },
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Absence Percentage',
    paragraphs: [
      'Enter three whole-number inputs: the headcount of employees in the group, the number of scheduled workdays per employee in the period, and the total days absent across that group. Days absent are employee-days—if two people each miss one day, that counts as two days absent.',
      'Multiply employees by workdays to get available employee-workdays. Divide total days absent by that product, then multiply by 100 to express the result as a percentage. The calculator updates the absenteeism rate automatically once all three inputs are valid.',
    ],
  },
  {
    id: 'absenteeism-formula',
    title: 'Absenteeism Rate Formula',
    paragraphs: [
      'The standard absence percentage formula used by this calculator is:',
    ],
    formula:
      'Absenteeism rate (%) = (Total days absent ÷ (Total employees × Total workdays)) × 100',
  },
  {
    id: 'calculation-examples',
    title: 'Calculation Examples',
    paragraphs: [
      'Example 1 — small team: 10 employees scheduled for 20 workdays each have 200 available employee-workdays. If the team records 8 days absent, the rate is (8 ÷ 200) × 100 = 4%.',
      'Example 2 — zero absences: the same 200 available days with 0 days absent yields 0%.',
      'Example 3 — full absence of scheduled capacity: 10 × 20 = 200 available days with 200 days absent yields 100%. Values above available capacity are rejected because they are not mathematically meaningful for this definition.',
    ],
    table: [
      { left: '10 × 20, 8 absent', right: '4%' },
      { left: '10 × 20, 0 absent', right: '0%' },
      { left: '10 × 20, 200 absent', right: '100%' },
      { left: '50 × 22, 55 absent', right: '5%' },
      { left: '3 × 20, 1 absent', right: '1.67%' },
    ],
    tableHeaders: ['Inputs', 'Absenteeism rate'],
  },
  {
    id: 'consequences',
    title: 'Consequences of Employee Absenteeism',
    paragraphs: [
      'High absence levels can increase overtime cost, delay projects, strain remaining staff, and reduce service quality. In manufacturing and healthcare, coverage gaps can also raise safety and compliance risk.',
      'Measuring the rate does not explain root causes—illness, caregiving, burnout, scheduling conflicts, and workplace culture all matter—but it gives a consistent baseline for comparing periods, teams, or locations.',
    ],
  },
  {
    id: 'why-monitor',
    title: 'Why Companies Monitor Absence Rates',
    paragraphs: [
      'Organizations track absenteeism to allocate staffing buffers, evaluate the effect of wellness or flexible-work programs, and support fair, consistent attendance policies. Finance teams may also estimate the labor-cost impact of lost hours.',
      'A single monthly percentage is rarely enough on its own. Pair the rate with headcount changes, overtime, turnover, and qualitative feedback before drawing conclusions.',
    ],
  },
  {
    id: 'how-to-interpret',
    title: 'How to Interpret Absenteeism Rates',
    paragraphs: [
      'Interpretation depends on industry, seasonality, and local leave norms. A rate that looks high in one sector may be typical in another. Compare like-for-like periods and similar job groups rather than chasing a universal “good” number.',
      'Sudden spikes deserve investigation; gradual rises may signal workload, engagement, or health issues. Always treat individual absences privately and in line with applicable employment law—this tool only computes a workforce percentage.',
    ],
  },
];

export const ABSENCE_PERCENTAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is an absenteeism rate?',
    answer:
      'It is the percentage of scheduled employee-workdays that were lost to absence in a chosen period.',
  },
  {
    question: 'How do you calculate absence percentage?',
    answer:
      'Divide total days absent by (total employees × workdays per employee), then multiply by 100.',
  },
  {
    question: 'What does “total workdays” mean?',
    answer:
      'It is the number of scheduled working days per employee during the period—not the sum across the whole workforce.',
  },
  {
    question: 'What does “total days absent” include?',
    answer:
      'It is the sum of employee-days missed. Two employees each missing one day counts as two days absent.',
  },
  {
    question: 'Why is 10 employees, 20 workdays, and 8 absences equal to 4%?',
    answer:
      'Available capacity is 10 × 20 = 200 employee-workdays. 8 ÷ 200 × 100 = 4%.',
  },
  {
    question: 'Can the absenteeism rate be 0%?',
    answer: 'Yes. Zero days absent with a positive available capacity yields 0%.',
  },
  {
    question: 'Can the absenteeism rate be 100%?',
    answer:
      'Yes, when total days absent equals total employees × workdays. Higher values are invalid for this formula.',
  },
  {
    question: 'Why can’t I enter zero employees or zero workdays?',
    answer:
      'Either value makes the denominator zero, so the rate is undefined. The calculator requires positive whole numbers for both.',
  },
  {
    question: 'Do I need a currency selector for this calculator?',
    answer:
      'No. Absenteeism rate is a percentage of time, not a money conversion.',
  },
  {
    question: 'Is this calculator medical or legal advice?',
    answer:
      'No. It only computes a workforce percentage from the numbers you enter. Attendance decisions remain subject to your policies and applicable law.',
  },
];
