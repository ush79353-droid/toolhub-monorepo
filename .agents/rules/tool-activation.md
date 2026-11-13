---
trigger: always_on
description: "Automatic activation for developed Omega Calculators (ADR-022)."
---

# Tool activation (Antigravity)

ADR-022. This does not change ADR-016, ADR-017, ADR-018, ADR-019, or ADR-021.

A calculator is not delivered until its existing catalog record is active and `/tools/{slug}` renders the registered component.

- Register `keys.ts`, `registry/index.ts`, `registry/details.ts`, and `backend/.../tool.key.ts` before activation.
- Set `isActive` on that existing MongoDB tool. Set `isDeveloped` only when that field is already on the tool schema.
- Leave `embedEnabled` unset or true. Set it false only when an admin disables embed.
- Add the slug to `IMPLEMENTED_TOOL_SLUGS`. Sitemap eligibility still requires `isActive`, `indexable`, and `sitemapInclude`.
- Do not activate a catalog row that has no calculator module. Do not create a placeholder component to make a row active.
- Do not turn an admin-disabled tool back on unless the task says to.
- An unregistered or empty `componentKey` stays off the public route (`notFound()`).
