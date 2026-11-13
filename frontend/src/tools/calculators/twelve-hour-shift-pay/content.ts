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
      'This calculator prices one shift, then scales that shift by a weekly schedule. You enter an hourly wage, how many hours of the shift are paid at that wage, and an overtime hourly wage for the remaining hours. The default shift is 12 hours, with the first 8 hours treated as regular time.',
      'The overtime box starts at 1.5 times the hourly wage. That fill-in is only a suggestion. Once you type a different overtime wage, later edits to the regular wage leave your overtime wage alone. Use “Use 1.5× the hourly wage” to return to the suggestion.',
      'Currency changes the symbol and the number format. It does not convert PKR into dollars or any other currency. A wage of 20 stays 20 in whichever currency you select.',
    ],
  },
  {
    id: 'regular-vs-overtime',
    title: 'Regular hours and overtime hours',
    paragraphs: [
      'Regular hours are the part of a single shift paid at the base hourly wage. They are not a weekly total. On a 12-hour shift with 8 regular hours, the other 4 hours are overtime hours.',
      'Overtime hours are shift length minus regular hours. Set regular hours to 12 on a 12-hour shift and overtime hours become 0. Set regular hours to 0 and the whole shift is priced at the overtime wage. Regular hours cannot exceed the shift length, and they stay between 0 and 12.',
    ],
    formula: 'Overtime hours = shift length − regular hours',
  },
  {
    id: 'overtime-pay',
    title: 'How overtime pay is calculated',
    paragraphs: [
      'Regular pay is regular hours multiplied by the hourly wage. Overtime pay is overtime hours multiplied by the overtime hourly wage. Shift pay is the sum of those two amounts. Average wage per hour is shift pay divided by the full shift length, so a mix of rates lands between the two wages.',
      'Each money line is rounded to the nearest hundredth before the next line uses it, so the regular and overtime amounts add up to the shift total you see. A wage of 20 and an overtime wage of 30 on an 8 + 4 split is 160 + 120 = 280, and 280 ÷ 12 is 23.33.',
    ],
    formula: 'Shift pay = (regular hours × hourly wage) + (overtime hours × overtime hourly wage)',
    formulaNote: 'Average hourly pay = shift pay ÷ shift length.',
  },
  {
    id: 'weekly-monthly-yearly',
    title: 'Weekly, monthly, and yearly estimates',
    paragraphs: [
      'Weekly pay is one shift’s pay multiplied by shifts per week. The default is 5 shifts, which is 60 hours if every shift is 12 hours long. Yearly pay multiplies that weekly amount by weeks per year. The default is 52. Monthly pay divides the yearly amount by 12. It is not a count of calendar workdays in a particular month.',
      'Open Schedule assumptions to change shift length, shifts per week, or weeks per year. The result states those assumptions beside the week, month, and year figures. Unpaid leave, missed shifts, and extra call-outs are not included, so the larger totals are projections rather than a promised salary.',
    ],
    formula: 'Yearly pay = shift pay × shifts per week × weeks per year',
    formulaNote: 'Monthly pay = yearly pay ÷ 12.',
  },
  {
    id: 'shift-pay-examples',
    title: 'Worked examples',
    paragraphs: [
      'Base example: hourly wage 20, overtime wage 30, 8 regular hours, 12-hour shift. Regular pay is 160, overtime pay is 120, shift pay is 280, and the average is 23.33 per hour. Five shifts a week for 52 weeks is 1,400 a week, 72,800 a year, and about 6,066.67 a month.',
      'Same wages with all 12 hours marked regular: overtime pay is 0 and the shift pays 240. With regular hours set to 0, the shift pays 360 because every hour uses the overtime wage. Changing only the overtime wage to 25, while keeping 8 regular hours, pays 160 + 100 = 260 for the shift.',
    ],
  },
  {
    id: 'shift-pay-mistakes',
    title: 'Common mistakes',
    paragraphs: [
      'Treating regular hours as a weekly total undercounts or overcounts a long shift. Eight regular hours here means eight hours inside the shift you are pricing, not eight hours across the week.',
      'Expecting the overtime box to keep tracking 1.5× after you edit it will not happen. A typed rate stays put. Another miss is reading the monthly figure as take-home pay. The calculator does not subtract tax, benefits, differentials, or unpaid breaks.',
      'A zero shift length cannot produce an average hourly wage, and regular hours above 12 or above the shift length are rejected instead of showing a blank or an infinite number.',
    ],
  },
  {
    id: 'overtime-rules',
    title: 'Overtime rules and legal limits',
    paragraphs: [
      'A 1.5× overtime wage is a common contract assumption. It is not a universal legal rule. Some places require overtime after 8 hours in a day, some only after 40 hours in a week, and some occupations are exempt. Night differentials, weekend premiums, and double time after a longer threshold are separate rates this calculator does not apply on their own.',
      'Health-care, transport, and public-safety schedules often use 12-hour shifts under their own agreements. Confirm the threshold and the multiplier in the employment contract and the rules that cover the workplace before treating this estimate as owed wages. This page is arithmetic, not legal advice.',
    ],
  },
];

export const SHIFT_PAY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is pay for a 12-hour shift calculated?',
    answer:
      'Split the shift into regular hours and overtime hours. Multiply each block by its own hourly wage and add the two products. With a wage of 20, an overtime wage of 30, and 8 regular hours, the shift pays 280.',
  },
  {
    question: 'Why does the overtime wage start at 1.5 times my hourly wage?',
    answer:
      'That fill-in is a suggestion so the form has a rate before you type one. It is not applied as a legal requirement. Type another overtime wage and the calculator keeps that number even if you later change the hourly wage.',
  },
  {
    question: 'What if my whole shift is straight time?',
    answer:
      'Set regular hours equal to the shift length. Overtime hours become zero and overtime pay is zero, even if an overtime wage is still shown in the form.',
  },
  {
    question: 'How do you get monthly pay from a weekly shift schedule?',
    answer:
      'Monthly pay is weekly pay times weeks per year, divided by 12. The default schedule is 5 shifts and 52 weeks. Change those assumptions in the schedule section. The result is an even monthly projection, not a guaranteed paycheck.',
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
