const fs = require('fs');
const path = require('path');

const dir = path.resolve(
  __dirname,
  '../../../frontend/src/tools/calculators/mortgage-taxes-insurance'
);

function rewrite(file, fn) {
  const p = path.join(dir, file);
  let s = fs.readFileSync(p, 'utf8');
  s = fn(s);
  fs.writeFileSync(p, s);
}

function rebrand(s) {
  return s
    .replaceAll('HomeLoanCalculator', 'MortgageTaxesInsuranceCalculator')
    .replaceAll('HomeLoanForm', 'MortgageTaxesInsuranceForm')
    .replaceAll('HomeLoanGuideArticle', 'MortgageTaxesInsuranceGuideArticle')
    .replaceAll('HomeLoanInput', 'MortgageTaxesInsuranceInput')
    .replaceAll('HomeLoanResult', 'MortgageTaxesInsuranceResult')
    .replaceAll('HomeLoanFieldErrors', 'MortgageTaxesInsuranceFieldErrors')
    .replaceAll('HomeLoanCanonicalInput', 'MortgageTaxesInsuranceCanonicalInput')
    .replaceAll('HomeLoanCanonicalResult', 'MortgageTaxesInsuranceCanonicalResult')
    .replaceAll('HomeLoanValidation', 'MortgageTaxesInsuranceValidation')
    .replaceAll('validateHomeLoanInput', 'validateMortgageTaxesInsuranceInput')
    .replaceAll('calculateHomeLoan', 'calculateMortgageTaxesInsurance')
    .replaceAll('formatHomeLoanMoney', 'formatMortgageTaxesMoney')
    .replaceAll('formatHomeLoanPercent', 'formatMortgageTaxesPercent')
    .replaceAll('HOME_LOAN_', 'MORTGAGE_TAXES_')
    .replaceAll('home-loan', 'mortgage-taxes-insurance')
    .replaceAll('hl-', 'mti-')
    .replaceAll('Home loan', 'Mortgage')
    .replaceAll('home loan', 'mortgage')
    .replaceAll('Home Loan', 'Mortgage with Taxes & Insurance')
    .replaceAll("'hl-", "'mti-");
}

for (const file of fs.readdirSync(dir)) {
  if (!/\.(ts|tsx)$/.test(file)) continue;
  rewrite(file, rebrand);
}

console.log('rebranded', fs.readdirSync(dir));
