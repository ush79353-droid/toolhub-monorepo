import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SHIFT_PAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-shift-pay-works', label: 'How the 12-hour shift pay calculator works' },
  { id: 'regular-vs-overtime', label: 'Regular hours and overtime hours' },
  { id: 'overtime-pay', label: 'How overtime pay is calculated' },
  { id: 'weekly-monthly-yearly', label: 'Weekly, monthly, and yearly estimates' },
  { id: 'shift-pay-examples', label: 'Worked examples' },
  { id: 'shift-pay-mistakes', label: 'Common mistakes' },
  { id: 'overtime-rules', label: 'Overtime rules and legal limits' },
  { id: 'shift-pay-faq', label: 'Frequently asked questions' },
];

export interface ShiftPayGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
}

export const SHIFT_PAY_GUIDE_SECTIONS: readonly ShiftPayGuideSection[] = [
  {
    id: 'how-shift-pay-works',
    title: 'How the 12-hour shift pay calculator works',
    paragraphs: [
      'Enter an hourly wage, an overtime hourly wage, and how many hours of a 12-hour shift are paid at the regular wage. The calculator prices that one shift, then scales it to a week, a month, and a year.',
      'The shift length, the number of workdays, and the weeks in a month or year stay fixed. They are not extra fields. Currency changes the symbol and grouping only. A wage of 20 stays 20 in whichever currency you select.',
    ],
  },
  {
    id: 'regular-vs-overtime',
    title: 'Regular hours and overtime hours',
    paragraphs: [
      'Regular hours are the part of the 12-hour shift paid at the base hourly wage. They are not a weekly total. With 8 regular hours, the other 4 hours are overtime.',
      'Overtime hours are 12 minus regular hours, and they never go below 0. Regular hours of 12 mean the whole shift is straight time. Regular hours of 0 mean the whole shift uses the overtime wage. A value above 12 is rejected with a message instead of being shortened to 12.',
    ],
    formula: 'Overtime hours = max(12 − regular hours, 0)',
  },
  {
    id: 'overtime-pay',
    title: 'How overtime pay is calculated',
    paragraphs: [
      'Daily pay is regular hours times the hourly wage, plus overtime hours times the overtime hourly wage. Average wage per hour is that daily total divided by 12. Each displayed amount is rounded to the nearest hundredth.',
      'A wage of 20 and an overtime wage of 30 with 8 regular hours is 160 + 120 = 280 for the day. 280 ÷ 12 is 23.33.',
    ],
    formula: 'Daily pay = (regular hours × hourly wage) + (overtime hours × overtime hourly wage)',
    formulaNote: 'Average wage per hour = daily pay ÷ 12.',
  },
  {
    id: 'weekly-monthly-yearly',
    title: 'Weekly, monthly, and yearly estimates',
    paragraphs: [
      'Weekly pay is one day’s pay times 5. Monthly pay is that weekly amount times 4.4. Yearly pay is the weekly amount times 52. Those multipliers are built in, so the form does not ask for shifts per week or weeks per year.',
      'The defaults of 20, 30, and 8 regular hours pay 1,400 a week, 6,160 a month, and 72,800 a year. Unpaid leave, missed shifts, tax, and extra call-outs are not included.',
    ],
    formula: 'Weekly pay = daily pay × 5',
    formulaNote: 'Monthly pay = weekly pay × 4.4. Yearly pay = weekly pay × 52.',
  },
  {
    id: 'shift-pay-examples',
    title: 'Worked examples',
    paragraphs: [
      'Base example: hourly wage 20, overtime wage 30, 8 regular hours. Regular pay is 160, overtime pay is 120, daily pay is 280, and the average is 23.33 per hour. The week is 1,400, the month is 6,160, and the year is 72,800.',
      'All 12 hours regular: overtime hours are 0 and the day pays 240. Regular hours set to 0: the day pays 360 because every hour uses the overtime wage of 30. Changing only the overtime wage to 25, with 8 regular hours, pays 160 + 100 = 260 for the day.',
    ],
  },
  {
    id: 'shift-pay-mistakes',
    title: 'Common mistakes',
    paragraphs: [
      'Treating regular hours as a weekly total misprices the shift. Eight regular hours means eight hours inside the 12-hour shift, not eight hours across the week.',
      'A wage of 0 or a negative wage is rejected. Regular hours above 12 are rejected rather than clamped, so the form never shows a shortened shift you did not enter. Empty or non-numeric input does not produce a result.',
      'The monthly figure is weekly pay times 4.4. It is not yearly pay divided by 12, and it is not take-home pay after tax.',
    ],
  },
  {
    id: 'overtime-rules',
    title: 'Overtime rules and legal limits',
    paragraphs: [
      'This page uses the overtime wage you type. It does not apply a legal multiplier on its own. Some places require overtime after 8 hours in a day, some only after 40 hours in a week, and some occupations are exempt.',
      'Health-care, transport, and public-safety schedules often use 12-hour shifts under their own agreements. Confirm the threshold and the rate in the employment contract before treating this estimate as owed wages. This page is arithmetic, not legal advice.',
    ],
  },
];

export const SHIFT_PAY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is pay for a 12-hour shift calculated?',
    answer:
      'Split the shift into regular hours and overtime hours. Overtime hours are 12 minus regular hours. Multiply each block by its own hourly wage and add the two products. With a wage of 20, an overtime wage of 30, and 8 regular hours, the day pays 280.',
  },
  {
    question: 'What if regular hours are more than 12?',
    answer:
      'The calculator asks you to enter a number from 0 to 12. It does not silently shorten a larger number to 12.',
  },
  {
    question: 'What if the whole shift is straight time?',
    answer:
      'Set regular hours to 12. Overtime hours become 0 and overtime pay is 0.',
  },
  {
    question: 'How are week, month, and year figures calculated?',
    answer:
      'Weekly pay is daily pay times 5. Monthly pay is weekly pay times 4.4. Yearly pay is weekly pay times 52. The default example is 1,400 a week, 6,160 a month, and 72,800 a year.',
  },
  {
    question: 'Does changing the currency convert my wage?',
    answer:
      'No. The currency control changes the symbol and decimal format only. Enter the wage in the currency you want to read.',
  },
  {
    question: 'Does this include tax or an unpaid meal break?',
    answer:
      'No. Figures are gross pay for the hours you enter. Tax withholding, benefits, shift differentials, and unpaid breaks need to be handled outside this estimate.',
  },
];
