import type {
  DaysOffContract,
  DaysOffCountry,
  DaysOffResult,
  DaysOffSegment,
} from './types';

const DISCLAIMER =
  'Educational summary only; not legal advice. Rules vary by contract wording, worker status, and local law; check official guidance or a qualified adviser.';

function result(segments: DaysOffSegment[]): DaysOffResult {
  return { segments, disclaimer: DISCLAIMER };
}

const MATRIX: Record<DaysOffCountry, Record<DaysOffContract, DaysOffSegment[]>> = {
  us: {
    'full-time': [
      {
        text: 'In the U.S., workers are not legally entitled to any paid holiday at all. However, in reality, most US employers offer around ',
      },
      { text: '10 to 15 paid-off days', emphasis: true },
      { text: ' to their full-time workers.' },
    ],
    'part-time': [
      {
        text: 'U.S. federal law (including the FLSA) does not require private employers to provide paid vacation to part-time employees. Any paid days off come from ',
      },
      { text: 'employer policy or agreement', emphasis: true },
      {
        text: ', and when offered are often prorated. Some states or cities set separate paid sick-leave rules that may cover employees.',
      },
    ],
    freelance: [
      {
        text: 'Genuine independent contractors in the U.S. generally have ',
      },
      { text: 'no federal entitlement to paid vacation', emphasis: true },
      {
        text: ' from the hiring client. Time off is usually self-funded unless a written contract says otherwise. Misclassification as a contractor can change employee leave rights.',
      },
    ],
  },
  uk: {
    'full-time': [
      {
        text: 'In the UK, most workers have a statutory minimum of ',
      },
      { text: '5.6 weeks’ paid holiday a year', emphasis: true },
      {
        text: ' (typically 28 days for someone working 5 days a week). Bank holidays may count toward that total depending on the contract. Employers can offer more than the legal minimum.',
      },
    ],
    'part-time': [
      {
        text: 'UK part-time workers are entitled to the same ',
      },
      { text: '5.6 weeks’ statutory paid holiday', emphasis: true },
      {
        text: ', pro-rated to days or hours worked (for example, 3 days a week ≈ 16.8 days a year). They must not be treated less favourably than comparable full-time workers.',
      },
    ],
    freelance: [
      {
        text: 'People who are genuinely self-employed in the UK are ',
      },
      { text: 'not usually entitled to statutory paid holiday', emphasis: true },
      {
        text: '. Freelancers or contractors working through an agency may have “worker” status and then share the 5.6-week entitlement; employment status, not the job title, decides this.',
      },
    ],
  },
  poland: {
    'full-time': [
      {
        text: 'Under a Polish employment contract, full-time employees have a statutory paid annual leave of ',
      },
      { text: '20 days', emphasis: true },
      { text: ' (under 10 years’ counted service) or ' },
      { text: '26 days', emphasis: true },
      {
        text: ' (at least 10 years). Employees cannot waive this leave; education history can count toward the service threshold.',
      },
    ],
    'part-time': [
      {
        text: 'Polish part-time employees on an employment contract receive the same 20- or 26-day annual leave basis, ',
      },
      { text: 'pro-rated to working time and rounded up', emphasis: true },
      {
        text: ' to a full day. Civil-law arrangements are different from employment contracts.',
      },
    ],
    freelance: [
      {
        text: 'People working in Poland on a mandate (umowa zlecenie) or B2B/civil contract generally have ',
      },
      { text: 'no statutory annual leave', emphasis: true },
      {
        text: ' unless the written contract provides paid time off. Paid vacation rights attach mainly to employment contracts (umowa o pracę).',
      },
    ],
  },
};

/** Lookup days-off guidance for country + contract. Pure; no invented numeric guarantees beyond cited norms. */
export function getDaysOffInfo(
  country: DaysOffCountry,
  contract: DaysOffContract
): DaysOffResult {
  return result(MATRIX[country][contract]);
}

export function formatDaysOffPlainText(result: DaysOffResult): string {
  return `${result.segments.map((s) => s.text).join('')}\n\n${result.disclaimer}`;
}
