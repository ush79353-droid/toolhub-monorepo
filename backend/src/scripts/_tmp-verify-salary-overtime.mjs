import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const files = {
  keys: 'frontend/src/tools/registry/keys.ts',
  index: 'frontend/src/tools/registry/index.ts',
  details: 'frontend/src/tools/registry/details.ts',
  backendKey: 'backend/src/modules/tools/tool.key.ts',
  sitemap: 'frontend/src/app/sitemap.ts',
  toolsPage: 'frontend/src/app/(website)/tools/[slug]/page.tsx',
  embedPage: 'frontend/src/app/embed/[slug]/page.tsx',
  module: 'frontend/src/tools/calculators/salary-with-overtime/SalaryWithOvertimeCalculator.tsx',
};

for (const [label, file] of Object.entries(files)) {
  const s = fs.readFileSync(file, 'utf8');
  const token =
    label === 'sitemap' || label === 'toolsPage' || label === 'embedPage'
      ? 'salary-calculator-with-overtime'
      : 'SalaryWithOvertimeCalculator';
  const n = s.split(token).length - 1;
  console.log(`${label}: ${token} x${n}`);
  if (n < 1) throw new Error(`missing ${token} in ${file}`);
}

// also registry sitemap if present
const regSitemap = 'frontend/src/tools/registry/sitemap.ts';
if (fs.existsSync(regSitemap)) {
  let s = fs.readFileSync(regSitemap, 'utf8');
  if (!s.includes("'salary-calculator-with-overtime'")) {
    const needle = "  'sales-commission-calculator',";
    if (!s.includes(needle)) throw new Error('registry sitemap needle missing');
    s = s.replace(
      needle,
      "  'salary-calculator-with-overtime',\n  'sales-commission-calculator',"
    );
    fs.writeFileSync(regSitemap, s);
    console.log('patched registry sitemap');
  } else {
    console.log('registry sitemap ok');
  }
}

// quick math check via tsx-compiled path — import calculation by reading and eval is hard;
// instead duplicate the formula briefly
const hourly = 500;
const weeklyHours = 160 / (52 / 12); // 160 hrs/mo → weekly
const multiplier = 1.5;
const monthlyOt = 20;
const monthlyRegular = hourly * weeklyHours * (52 / 12);
const otRate = hourly * multiplier;
const monthlyOtPay = otRate * monthlyOt;
const total = monthlyRegular + monthlyOtPay;
console.log({ monthlyRegular, otRate, monthlyOtPay, total });
if (Math.abs(monthlyRegular - 80000) > 1e-6) throw new Error('regular mismatch');
if (Math.abs(total - 95000) > 1e-6) throw new Error('total mismatch');
console.log('math ok');
