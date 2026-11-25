# Meal Calorie Calculator — AGENT STATUS

**Status:** CLAIMED / IN PROGRESS (session limit)  
**Agent:** cursor-composer  
**Claimed:** 2026-11-22 via atomic Tools → In Progress move + OWNER.lock  

## Spec summary (from prompt)

- Default 2,000 kcal/day; Calculate required calories unchecked; Meals per day = Three.
- Results example: Breakfast 650 (600–700), Lunch 750 (700–800), Dinner 600 (500–700).
- Three-mode shares ≈ 32.5% / 37.5% / 30%; bounds 30–35 / 35–40 / 25–35.
- Apply shares to total and reconcile rounded central allocations; ranges independent.
- When required-calories checked, reuse verified maintenance inputs if found.

## Progress

- Folder claimed exclusively.
- Prompt read; Mongo lookup started this session (confirm `_id`/slug before coding).
- Module not yet implemented — **resume development here**; do not reclaim while OWNER.lock present.

## Next steps

1. Finish Mongo verify (`slug` likely `meal-calorie-calculator`).
2. Implement ADR-018 module + three commits + `tool:assign` + move to Completed Tools.
