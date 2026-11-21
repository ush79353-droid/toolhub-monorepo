/**
 * Aleve dosage engine self-check (run: npx tsx src/tools/calculators/aleve-dosage/calculation.test.ts)
 */
import { calculateAleveDosage, wholeUnitCount } from './calculation';
import { createDefaultInput } from './types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

// Whole units only — never fractional (rejects specimen 500/220 ≈ 2.27).
assert(wholeUnitCount(220, 220) === 1, '220/220 → 1');
assert(wholeUnitCount(440, 220) === 2, '440/220 → 2');
assert(wholeUnitCount(660, 220) === 3, '660/220 → 3');
assert(wholeUnitCount(500, 220) === null, '500/220 must not invent 2.3');
assert(wholeUnitCount(250, 500) === null, '250/500 half-tablet not auto-counted');
assert(wholeUnitCount(500, 500) === 1, '500/500 → 1');
assert(wholeUnitCount(0, 220) === 0, 'zero dose → 0 units');
assert(wholeUnitCount(-1, 220) === null, 'negative rejected');
assert(wholeUnitCount(220, 0) === null, 'zero strength rejected');

const otc = calculateAleveDosage(createDefaultInput());
assert(otc != null, 'default OTC result');
assert(otc!.channel === 'otc', 'default channel otc');
assert(otc!.typicalDosageLine.includes('8 to 12 hours'), 'OTC interval');
assert(otc!.typicalDosageLine.includes('220'), 'OTC 220 mg');
assert(!otc!.typicalDosageLine.includes('500 mg per day'), 'no specimen 500/day');
assert(otc!.hasWholeUnitCount === true, 'OTC whole units');
assert(otc!.maxLines.some((l) => l.includes('3')), 'OTC max 3 units');

const wrongPair = calculateAleveDosage({
  indication: 'acute_gout',
  drugType: 'otc_tablet_220',
});
assert(wrongPair != null, 'gout+otc result');
assert(
  wrongPair!.typicalDosageLine.includes('No OTC Aleve dosage'),
  'gout blocked on OTC'
);
assert(wrongPair!.mismatchMessage != null, 'mismatch message present');

const rx500 = calculateAleveDosage({
  indication: 'pain',
  drugType: 'rx_naproxen_500',
});
assert(rx500 != null, 'rx 500 pain');
assert(rx500!.channel === 'rx', 'rx channel');
assert(rx500!.typicalDosageLine.includes('500 mg'), 'rx initial 500');
assert(rx500!.hasWholeUnitCount === true, '500 mg tablet matches initial');
assert(
  rx500!.unitEquivalenceLine.includes('1 tablet'),
  'initial is 1×500 mg tablet'
);

const rx250Pain = calculateAleveDosage({
  indication: 'pain',
  drugType: 'rx_naproxen_250',
});
assert(rx250Pain != null, 'rx 250 pain');
// 500 mg initial does not divide into 250? Actually 500/250 = 2 whole tablets.
assert(wholeUnitCount(500, 250) === 2, '500 with 250 → 2 tablets');
assert(rx250Pain!.hasWholeUnitCount === true, '250 strength can express 500');

const rxNs = calculateAleveDosage({
  indication: 'pain',
  drugType: 'rx_naproxen_sodium_550',
});
assert(rxNs != null && rxNs.typicalDosageLine.includes('550 mg'), 'NS 550 path');

const otcCaplet = calculateAleveDosage({
  indication: 'fever',
  drugType: 'otc_caplet_220',
});
assert(otcCaplet != null && otcCaplet.unitNoun === 'caplet', 'caplet noun');

console.log('aleve-dosage calculation.test.ts: ok');
