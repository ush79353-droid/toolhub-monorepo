import 'dotenv/config';
import mongoose from 'mongoose';

const slugs = [
  'loan-interest-calculator',
  'times-interest-earned-ratio-calculator',
  'interest-rate-parity-calculator',
  'debt-calculator',
  'after-tax-cost-of-debt-calculator',
  'debt-avalanche-calculator',
  'debt-service-coverage-ratio-calculator-dscr',
  'debt-snowball-calculator',
  'debt-to-asset-ratio-calculator',
  'debt-to-equity-calculator',
  'debt-to-capital-ratio-calculator',
  'net-debt-calculator',
  'ebitda-margin-calculator',
  'gross-margin-calculator',
  'margin-and-markup-calculator',
  'margin-and-vat-calculator',
  'margin-calculator-classic',
  'margin-call-calculator',
  'margin-of-safety-calculator',
  'operating-margin-calculator',
  'annuity-calculator',
  'annuity-payout-calculator',
  'deferred-annuity-calculator',
  'future-value-of-annuity-calculator',
  'growing-annuity-calculator',
  'immediate-annuity-calculator',
  'lottery-annuity-calculator',
  'present-value-of-annuity-calculator',
  'variable-annuity-calculator',
  'overtime-calculator',
  'california-overtime-calculator',
  'florida-overtime-calculator',
  'georgia-overtime-calculator',
  'illinois-overtime-calculator',
  'new-york-overtime-calculator',
  'overtime-paycheck-calculator',
  'salary-calculator-with-overtime',
  'texas-overtime-calculator',
  'gross-rent-multiplier-calculator',
  'net-effective-rent-calculator',
  'rent-increase-calculator',
  'rent-or-buy-calculator',
  'car-interest-calculator',
  'tds-interest-calculator',
  'second-stimulus-check-calculator-heals-act',
  'second-stimulus-check-calculator-900-billion-bill',
];

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
await mongoose.connect(uri);
const col = mongoose.connection.collection('tools');
for (const slug of slugs) {
  const d = await col.findOne(
    { slug },
    { projection: { slug: 1, componentKey: 1, isActive: 1, isDeveloped: 1, indexable: 1 } },
  );
  if (!d) {
    console.log('MISSING\t' + slug);
  } else {
    console.log(
      [d.slug, d.componentKey, 'A=' + d.isActive, 'D=' + d.isDeveloped, 'I=' + d.indexable].join(
        '\t',
      ),
    );
  }
}
await mongoose.disconnect();
