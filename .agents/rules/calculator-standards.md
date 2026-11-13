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

- Reuse the Auto Loan Calculator page shell / sticky sidebar / shared currency / SEO pipeline. ADR-016 owns the visual shell. ADR-018 owns the module layout. The module lock does not restyle the page.
- Follow `brain/ARCHITECTURE.md` §7: `calculation.ts`, `validation.ts`, `types.ts`, `detail.tsx`, `calculation.test.ts`, lazy `registry/index.ts`, and `registry/details.ts`. Mirror the key in `backend/src/modules/tools/tool.key.ts`.
- Complete the playbook checklist before calling the calculator done: architecture, reusable components, pure engine, validation, tests, SEO, embed, responsive QA.
- Commit finished milestones under ADR-019 (`.agents/rules/git-commits.md`). One commit is enough for a very small tool. Do not pad history. The delivery report lists each commit and its checks.
- Do not add `app/(website)/tools/<slug>/page.tsx`. Unregistered keys call `notFound()`.
- Import `StickyCalculatorAside` and `TableOfContents` from `calculators/auto-loan/`. Do not copy them.
- Do not hardcode per-tool SEO metadata in calculator components.
- Do not invent a second sticky, currency, clipboard, metadata, ad, or embed system. Real conversion uses ADR-017 rates through ADR-021 (`.agents/rules/currency-conversion.md`). A denomination selector does not convert numbers.
- Keep calculator-specific math and validation in pure modules. Keep presentation conventions shared.
- Preserve Ponytail minimalism: extend existing helpers before adding abstractions.
- For iframe embedding, follow `brain/EMBED_STANDARDS.md` and `.agents/rules/embed-standards.md`.
