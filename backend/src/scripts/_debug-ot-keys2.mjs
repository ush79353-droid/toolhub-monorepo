import { execSync } from 'node:child_process';

const head = execSync('git show HEAD:frontend/src/tools/registry/keys.ts', {
  encoding: 'utf8',
});
console.log(
  'exact OT',
  /(^|\n|\r\n)  'OvertimeCalculator',\r?\n/.test(head)
);
console.log(
  'Opportunity slice',
  JSON.stringify(
    head.slice(
      head.indexOf("  'OpportunityCostCalculator',"),
      head.indexOf("  'OpportunityCostCalculator',") + 120
    )
  )
);
const next = head.replace(
  /  'OpportunityCostCalculator',\r?\n/g,
  "  'OpportunityCostCalculator',\n  'OvertimeCalculator',\n"
);
console.log(
  'after insert exact',
  /(^|\n|\r\n)  'OvertimeCalculator',\r?\n/.test(next)
);
console.log(
  'count OT quote',
  (next.match(/'OvertimeCalculator'/g) || []).length
);
console.log(
  'slice after',
  JSON.stringify(
    next.slice(
      next.indexOf("  'OpportunityCostCalculator',"),
      next.indexOf("  'OpportunityCostCalculator',") + 160
    )
  )
);
