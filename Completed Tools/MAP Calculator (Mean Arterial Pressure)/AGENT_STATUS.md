# MAP Calculator (Mean Arterial Pressure) — Delivery

- **componentKey:** `MapCalculator`
- **slug:** `map-calculator-mean-arterial-pressure`
- **Mongo:** `6af46f10a27d8d1d4e990242` — `isActive` true, `isDeveloped` true, **`indexable` false** (preserved)
- **Formula:** MAP = (SBP + 2×DBP)/3; PP = SBP − DBP when checkbox on
- **Fixture:** 120/80 → MAP 93.33, PP 40
- **Test:** `npm exec tsx -- src/tools/calculators/map-mean-arterial-pressure/calculation.test.ts` → ok
- **TASKS:** `TOOL-738`
- **Temporary files cleaned:** YES