---
trigger: always_on
---

# Screenshot-First Functional Parity & Simplicity (Antigravity)

ADR-023. Governs the functional scope of every calculator.

Whenever a calculator is requested with a reference screenshot or specification:

1. **Screenshot determines WHAT the calculator does:** The screenshot is the single authoritative source for functional scope. Do not invent unrequested inputs, extra calculation modes, advanced settings drawers, or unnecessary charts/dashboards.
2. **Auto Loan determines HOW it looks:** Auto Loan (`/tools/auto-loan-calculator`) is our **visual design master, NOT our functional master**. Reuse its colors, typography, input dimensions (`h-11`), spacing, card styling, and tool-detail page shell. Never copy its field count, advanced sections, charts, or payment breakdowns into unrelated calculators.
3. **Pre-Implementation Parity Checklist:**
   - [ ] Screenshot inputs identified
   - [ ] Screenshot outputs identified
   - [ ] Only necessary fields included
   - [ ] No unnecessary advanced settings (conditional settings hidden behind checkboxes/disclosures)
   - [ ] Currency selector included only when justified
   - [ ] Results appropriately compact
   - [ ] Calculation formulas independently verified
   - [ ] ADR-018 module architecture followed
   - [ ] Auto Loan visual standards followed
   - [ ] Original guide, SEO, ads and embed integrated
   - [ ] Tests and responsive QA completed
   - [ ] Tool registered and automatically activated after successful verification
   - [ ] Public calculator route verified
   - [ ] Three Git commits created (UI, engine/+FX, registration/SEO/Brain/cleanup)
4. **Currency Selector Rule:** Include a currency selector ONLY when:
   - The reference screenshot explicitly provides currency selection; OR
   - The user explicitly requests currency selection; OR
   - Currency conversion is genuinely essential to the calculator's requested functionality.
   If a calculator uses one fixed currency, format numbers consistently without a dropdown.
5. **Results Simplicity Rule:** Results match the calculator's actual purpose. Prioritize primary answer, essential supporting values, and short explanation. Avoid forced charts, comparison bars, or sprawling metric dashboards. Detailed schedules or breakdowns belong behind optional disclosure controls (collapsed by default).
6. **Verified activation:** After parity, tests, and registry succeed, activate the existing catalog row (`isDeveloped` / `isActive` / eligible `indexable`) and confirm `/tools/{slug}` works — or report an admin blocker. See `.agents/rules/tool-activation.md`.
