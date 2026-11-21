/**
 * Assert self-check for Subscription Waste Calculator.
 * Run: npx tsx src/tools/calculators/subscription-waste/calculation.test.ts
 */
import {
  calculateSubscriptionWasteResult,
  shareSubscriptionWasteText,
  toMonthlyEquivalent,
} from './calculation';
import {
  createBlankInput,
  createDefaultInput,
  createEntryId,
  createExampleInput,
  type SubscriptionEntry,
} from './types';
import { validateSubscriptionWasteInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

assert(toMonthlyEquivalent(20, 'monthly') === 20, 'monthly');
assert(toMonthlyEquivalent(120, 'yearly') === 10, 'yearly /12');
assert(Math.abs((toMonthlyEquivalent(10, 'weekly') ?? 0) - (520 / 12)) < 1e-9, 'weekly');
assert(toMonthlyEquivalent(30, 'quarterly') === 10, 'quarterly /3');
assert(toMonthlyEquivalent(-1, 'monthly') === null, 'neg rejected');

const example = createExampleInput();
const result = calculateSubscriptionWasteResult(example);
assert(result.totalMonthlySpending === 85, 'example monthly 85');
assert(result.totalAnnualSpending === 1020, 'example annual 1020');

const spotify = result.lines.find((l) => l.displayName.includes('Spotify'));
assert(spotify !== undefined && spotify.monthlyEquivalent === 10, 'spotify 10');

const cloud = result.lines.find((l) => l.displayName.includes('Google One'));
assert(cloud !== undefined && cloud.monthlyEquivalent === 10, 'cloud yearly→10');

const withCancel: typeof example = {
  ...example,
  entries: {
    ...example.entries,
    'music-audio': example.entries['music-audio'].map((e) =>
      e.serviceKey.includes('Spotify')
        ? { ...e, selectedForCancellation: true }
        : e,
    ),
  },
};
const savings = calculateSubscriptionWasteResult(withCancel);
assert(savings.potentialMonthlySavings === 10, 'cancel monthly 10');
assert(savings.potentialAnnualSavings === 120, 'cancel annual 120');
assert(savings.totalMonthlySpending === 85, 'cancel keeps total spending');

const validated = validateSubscriptionWasteInput(example);
assert(validated.isValid && validated.result !== null, 'example valid');

const blank = validateSubscriptionWasteInput(createBlankInput());
assert(blank.incomplete, 'blank incomplete');

const defaults = calculateSubscriptionWasteResult(createDefaultInput());
assert(defaults.totalMonthlySpending === 65, 'default Netflix+Prime 65');

const partial = validateSubscriptionWasteInput({
  ...createBlankInput(),
  entries: {
    ...createBlankInput().entries,
    'streaming-tv': [
      {
        id: createEntryId(),
        serviceKey: 'Netflix',
        customName: '',
        amount: '',
        billingFrequency: 'monthly',
        selectedForCancellation: false,
      } satisfies SubscriptionEntry,
    ],
  },
});
assert(!partial.isValid, 'amount missing invalid');

assert(
  shareSubscriptionWasteText(result).includes('Subscription Waste Calculator'),
  'share',
);

console.log('subscription-waste calculation.test.ts: all asserts passed');
