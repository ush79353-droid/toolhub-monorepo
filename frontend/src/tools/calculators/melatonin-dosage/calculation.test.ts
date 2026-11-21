/**
 * Melatonin dosage engine self-check
 * (run: npx tsx src/tools/calculators/melatonin-dosage/calculation.test.ts)
 */
import {
  CIRCADIN_MAX_DAYS,
  calculateMelatoninDosage,
  parseDurationDays,
} from './calculation';
import { createDefaultInput } from './types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(parseDurationDays('', 'days').days === null, 'blank duration → null');
assert(parseDurationDays('', 'days').error === null, 'blank duration ok');
assert(parseDurationDays('7', 'days').days === 7, '7 days');
assert(parseDurationDays('2', 'weeks').days === 14, '2 weeks → 14 days');
assert(parseDurationDays('-1', 'days').error != null, 'negative rejected');
assert(parseDurationDays('0', 'days').error != null, 'zero rejected');
assert(parseDurationDays('abc', 'days').error != null, 'non-numeric rejected');
assert(CIRCADIN_MAX_DAYS === 91, '13 weeks = 91 days');

const defaults = calculateMelatoninDosage(createDefaultInput());
assert(defaults != null, 'default result');
assert(defaults!.channel === 'dietary_supplement', 'default is supplement channel');
assert(!defaults!.headline.toLowerCase().includes('2 mg once'), 'no invented 2 mg on tablets default');
assert(
  defaults!.durationLines.some((l) => l.toLowerCase().includes('blank')),
  'blank duration called out'
);
assert(defaults!.unitLines.length === 0, 'no invented unit count on blank duration');

const circadin = calculateMelatoninDosage({
  indication: 'poor_sleep_quality',
  medicationType: 'prolonged_release_2mg',
  durationText: '',
  durationUnit: 'days',
});
assert(circadin != null, 'circadin result');
assert(circadin!.channel === 'circadin_ema', 'circadin channel');
assert(circadin!.scheduleLines.some((l) => l.includes('2 mg')), '2 mg labeled');
assert(circadin!.scheduleLines.some((l) => l.includes('13 weeks')), '13 weeks');
assert(circadin!.unitLines.length === 0, 'no tablet count without duration');

const circadinCourse = calculateMelatoninDosage({
  indication: 'poor_sleep_quality',
  medicationType: 'prolonged_release_2mg',
  durationText: '10',
  durationUnit: 'weeks',
});
assert(circadinCourse != null, 'circadin 10 weeks');
assert(circadinCourse!.durationDays === 70, '10 weeks = 70 days');
assert(
  circadinCourse!.unitLines.some((l) => l.includes('70 tablet')),
  '70 tablets for 70 days'
);
assert(
  circadinCourse!.durationLines.some((l) => l.toLowerCase().includes('within')),
  'within 13-week window'
);

const over = calculateMelatoninDosage({
  indication: 'poor_sleep_quality',
  medicationType: 'prolonged_release_2mg',
  durationText: '14',
  durationUnit: 'weeks',
});
assert(over != null, 'over course');
assert(over!.durationDays === 98, '14 weeks = 98 days');
assert(
  over!.durationLines.some((l) => l.toLowerCase().includes('exceeds')),
  'exceeds 13 weeks flagged'
);

const jetLag = calculateMelatoninDosage({
  indication: 'jet_lag',
  medicationType: 'prolonged_release_2mg',
  durationText: '',
  durationUnit: 'days',
});
assert(jetLag != null, 'jet lag + circadin');
assert(jetLag!.channel === 'out_of_scope', 'jet lag out of Circadin scope');
assert(jetLag!.mismatchMessage != null, 'mismatch present');

const kids = calculateMelatoninDosage({
  indication: 'children',
  medicationType: 'tablets_capsules',
  durationText: '',
  durationUnit: 'days',
});
assert(kids != null, 'children result');
assert(kids!.channel === 'out_of_scope', 'children out of scope');
assert(
  kids!.headline.toLowerCase().includes('pediatric') ||
    kids!.headline.toLowerCase().includes('children'),
  'pediatric messaging'
);

const troubleCircadin = calculateMelatoninDosage({
  indication: 'trouble_falling_asleep',
  medicationType: 'prolonged_release_2mg',
  durationText: '7',
  durationUnit: 'days',
});
assert(troubleCircadin != null, 'trouble + circadin');
assert(troubleCircadin!.channel === 'circadin_ema', 'eligible path');
assert(troubleCircadin!.mismatchMessage != null, 'wording parity note');
assert(
  troubleCircadin!.unitLines.some((l) => l.includes('7 tablet')),
  '7 tablets for 7 days'
);

console.log('melatonin-dosage calculation.test.ts: ok');
