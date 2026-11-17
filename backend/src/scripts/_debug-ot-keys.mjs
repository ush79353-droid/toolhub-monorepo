import { execSync } from 'node:child_process';
import fs from 'node:fs';

for (const p of [
  'backend/src/modules/tools/tool.key.ts',
  'frontend/src/tools/registry/tool.key.ts',
]) {
  const head = execSync(`git show HEAD:${p}`, { encoding: 'utf8' });
  const work = fs.readFileSync(p, 'utf8');
  const re = /OpportunityCostCalculator[\s\S]{0,120}ParkingRatioCalculator/g;
  console.log('====', p);
  console.log('HEAD pair', JSON.stringify((head.match(re) || [])[0]));
  console.log(
    'WORK exact quote',
    work.includes("  'OvertimeCalculator',")
  );
  console.log('WORK pair', JSON.stringify((work.match(re) || [])[0]));
  console.log(
    'diff',
    execSync(`git diff HEAD -- "${p}"`, { encoding: 'utf8' }).slice(0, 800)
  );
}
