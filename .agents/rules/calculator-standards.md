---
trigger: always_on
---

# Calculator Standards (Antigravity)

Before building or changing any calculator:

1. Read `AGENTS.md`
2. Read `brain/TOOL_DETAIL_PAGE_STANDARDS.md` and `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`
3. Read `brain/CALCULATOR_STANDARDS.md`
4. Read `brain/SEO_STANDARDS.md`
5. Read `brain/DESIGN_SYSTEM.md`
6. Read relevant architecture docs (`FRONTEND.md`, `ARCHITECTURE.md`)

Rules:

- Reuse the Loan Calculator page shell / sticky aside / shared currency / SEO pipeline.
- Do not hardcode per-tool SEO metadata in calculator components.
- Do not invent a second sticky, currency, clipboard, or metadata system.
- Keep calculator-specific math/validation local; keep presentation conventions shared.
- Preserve Ponytail minimalism: extend existing helpers before adding abstractions.
