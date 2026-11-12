# Ad Placement Standards — OmegaCalculators

> Placeholder advertisement rules for public Tool Detail Pages. No live ad network is integrated yet.

Read with: `AGENTS.md`, `CALCULATOR_STANDARDS.md`, `DESIGN_SYSTEM.md`, `EMBED_STANDARDS.md`.

## 1. Scope

- Ads belong on normal `/tools/[slug]` pages only.
- **Never** render ads on `/embed/[slug]`.
- Do not place ads inside calculator forms, results, charts, tables, or FAQ answers.
- Do not load AdSense, other ad networks, trackers, or pixels until a dedicated live integration task.

## 2. Architecture

| Piece | Path |
| :--- | :--- |
| Types | `frontend/src/lib/ads/types.ts` |
| Placement config + global mode | `frontend/src/lib/ads/placements.ts` |
| UI component | `frontend/src/components/ads/AdSlot.tsx` |
| Wiring | Shared `frontend/src/app/(website)/tools/[slug]/page.tsx` only |

Future calculators inherit placements automatically through the shared tool page.

## 3. Modes

`AdDisplayMode`:

- `placeholder` — current default (`ADS_DISPLAY_MODE`)
- `disabled` — render nothing
- `live` — reserved; must mount consented AdSense units later (do not invent publisher/slot IDs)

## 4. Placements

| Id | Default | Notes |
| :--- | :--- | :--- |
| `tool_top_banner` | on | After breadcrumbs; leaderboard-style reserved height |
| `tool_article_middle` | on | Between intro card and guide article |
| `tool_article_bottom` | off | Available after guide; keep off unless layout needs it |
| `tool_bottom_banner` | on | After main grid, before site footer |
| `tool_sidebar_optional` | off | Do not fight sticky calculator |

Target density: about **2–3** visible slots per typical tool page.

## 5. Placeholder design

- Light canvas (`#F7F8F6` / muted)
- Dashed `border-border`, `rounded-xl`
- Centered accessible label: “Advertisement”
- Optional short placement description
- No fake creatives, brands, sponsorship claims, or motion

## 6. Future Google Ads integration points

When implementing live mode:

1. Add consented script loading (never without a consent gate).
2. Store real publisher / slot IDs in secure env (never commit secrets).
3. Map each `AdPlacementId` to a configured slot.
4. Keep layout wrappers (`AdSlot`) so page structure does not rebuild.
5. Follow current Google publisher policies and local privacy law.

Do not claim placeholders are Google-approved units.

## 7. Admin

Centralized frontend config is enough for dummy placeholders.
A future admin toggles module may flip `enabled` per placement — do not store HTML/scripts in MongoDB.

## 8. Testing checklist

- Loan + Auto Loan pages show placeholders only outside the calculator
- Embed pages show zero ad slots
- Sticky aside still works; no nested sticky ads
- No horizontal overflow at 320–1440px
- Reserved min-heights reduce CLS
