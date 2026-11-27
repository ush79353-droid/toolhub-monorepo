# OMEGA ISSUED TOOLS — SIMPLE DEVELOPMENT GUIDE (Roman Urdu / Hinglish)

**Audience:** Project owner  
**Date:** 2026-11-27  
**Total Issued:** 10  
**Important:** Abhi development start nahi hui — pehle ye roadmap samajhne ke liye report hai.

---

## Short overall picture

Bhai, Issued mein ab **10** calculators hain.

- **3** pehle se code ban chuka hai — dobara develop nahi karna; sirf duplicate folder clean/reconcile.
- **2** (Alcohol Unit, CIWA) prompt + screenshot complete hain aur formula clear hai — pehle MongoDB connection theek karke phir develop.
- **4** (Addiction, Body Shape, Face Shape, Metastatic Prostate) ke liye reliable formula / clinical / classification table chahiye — bina uske guess nahi karna.
- **1** (Quiz Protein Creatinine) ka sawal-jawab prompt mein clear hai, lekin MongoDB mein authorized record missing / unconfirmed hai.

Abhi live MongoDB is machine se connect nahi ho raha (`DNS` error) — isliye IDs dubara confirm nahi ho sake.

---

### Calculator: Addiction Calculator

**Abhi kya status hai?**  
Bilkul undeveloped — koi frontend calculator module nahi bana.

**Issue kya hai?**  
Pehle MongoDB connect nahi hua, isliye kaam ruk gaya. Ab bhi Mongo DNS fail hai. Saath mein har addiction type aur country ke liye verified “kitna life lost” data bhi confirm karna zaroori hai.

**Ye issue kyun aaya?**  
Catalog ID verify kiye baghair coding allowed nahi, aur screenshot/prompt ke numbers invent karna medical/educational rules ke against hai.

**Kya hum isko solve kar sakte hain?**  
Pehle verified formula/data chahiye. Mongo connection bhi theek hona chahiye.

**Is calculator ko develop kaise karenge?**

1. Pehle published / approved substance minutes aur country life-expectancy tables confirm karenge.  
2. MongoDB connect karke exact `_id` / slug verify karenge.  
3. Screenshot ke fields (type, minutes/dose, uses/day, age, country) UI mein banayenge.  
4. Verified formula se results (life expectancy, duration, total life lost) calculate karenge + strong disclaimer.  
5. Registry + backend key + authorized assign.  
6. Tests/pass ke baad local commits aur Completed move.

**Humein kya chahiye?**  
Verified formula/data (substance + country baselines). MongoDB access.

**Kya user ko kuch provide karna padega?**  
YES — approved evidence pack / tables (ya clear source jo invent na ho).

**Estimated difficulty:** HARD  

**Next recommended action:** User se authoritative life-lost + country LE pack approve karwao; Mongo DNS fix parallel.

---

### Calculator: Adrenal Washout Calculator (duplicate-queue)

**Abhi kya status hai?**  
Already developed — code, registry, aur teen Git commits maujood hain.

**Issue kya hai?**  
Same calculator ka doosra queue folder aa gaya tha jab tool pehle complete ho chuka tha.

**Ye issue kyun aaya?**  
Duplicate Pending/Progress seed; agent ne rebuild avoid karke Issued reconcile kiya.

**Kya hum isko solve kar sakte hain?**  
Haan, existing files se solve ho sakta hai (dobara develop nahi).

**Is calculator ko develop kaise karenge?**

1. Confirm karo `adrenal-washout` module aur commits theek hain (already verified).  
2. Jab Mongo chaley to live flags (`isDeveloped` / `isActive`) read-only check.  
3. Issued duplicate folder ko authorized cleanup/reconcile process se hatao / archive.  
4. Naya calculator mat banao.

**Humein kya chahiye?**  
Kuch nahi — existing implementation sufficient. Optional: Mongo read-back.

**Kya user ko kuch provide karna padega?**  
NO

**Estimated difficulty:** EASY  

**Next recommended action:** Duplicate Issued folder reconcile; no rebuild.

---

### Calculator: Albumin Creatinine Ratio Calculator - duplicate-pending

**Abhi kya status hai?**  
Already developed aur registered.

**Issue kya hai?**  
Completion ke baad duplicate task folder Issued mein reh gaya.

**Ye issue kyun aaya?**  
Queue mein second copy aa gayi thi; rebuild forbidden tha.

**Kya hum isko solve kar sakte hain?**  
Haan, existing files se.

**Is calculator ko develop kaise karenge?**

1. `albumin-creatinine-ratio` module + commits verify (already present).  
2. Mongo flags optional read-back jab DNS theek ho.  
3. Duplicate Issued entry reconcile.  
4. Rebuild skip.

**Humein kya chahiye?**  
Kuch nahi.

**Kya user ko kuch provide karna padega?**  
NO

**Estimated difficulty:** EASY  

**Next recommended action:** Reconcile duplicate folder only.

---

### Calculator: Alcohol Unit Calculator

**Abhi kya status hai?**  
Undeveloped — lekin prompt + screenshot complete, formula clear.

**Issue kya hai?**  
MongoDB DNS fail ki wajah se catalog `_id` confirm nahi ho saka, isliye coding start nahi hui.

**Ye issue kyun aaya?**  
Activation rules kehta hai pehle unique Mongo row verify karo; connection toot gaya.

**Kya hum isko solve kar sakte hain?**  
Haan, lekin pehle technical repair chahiye (Mongo/DNS). Spec already enough.

**Is calculator ko develop kaise karenge?**

1. Mongo connection restore + slug/`_id` verify (historical hint: `…9902f4`).  
2. Screenshot drinks + country grams UI banayenge.  
3. UK formula `mL × ABV% / 1000` + regional definitions implement.  
4. Fixture: 500 mL 5% beer → 2.5 UK units.  
5. Registry / backend key / tool:assign.  
6. Local three commits + Completed.

**Humein kya chahiye?**  
MongoDB connectivity / identity confirm. Screenshots already hain.

**Kya user ko kuch provide karna padega?**  
NO (materials ke liye). Network/Mongo environment theek hona chahiye.

**Estimated difficulty:** MEDIUM  

**Next recommended action:** Fix Atlas DNS, verify catalog row, then authorize development claim.

---

### Calculator: Body Shape Calculator

**Abhi kya status hai?**  
Undeveloped.

**Issue kya hai?**  
Saat body shapes ka exact numeric decision table Omni page par complete publish nahi; invent karna mana hai.

**Ye issue kyun aaya?**  
Bina verified thresholds ke wrong clothing labels ship ho sakte the.

**Kya hum isko solve kar sakte hain?**  
Pehle verified formula/data chahiye. Repo mein **Body Type Calculator** ka Lee/calculator.net table already hai — lekin Body Shape ke liye reuse se pehle aapki approval chahiye.

**Is calculator ko develop kaise karenge?**

1. User se confirm: Body Type wala table reuse allowed hai ya Omni-specific table dena hai.  
2. High-hip vs full-hip rules clear karo.  
3. Screenshot fields (bust/waist/high hip/hip) UI.  
4. Approved table se classification + tests (borderline cases).  
5. Mongo identity + registry + assign.  
6. Commits + Completed.

**Humein kya chahiye?**  
Verified decision table **ya** Body Type reuse approval.

**Kya user ko kuch provide karna padega?**  
YES

**Estimated difficulty:** HARD (jab tak table approve na ho); MEDIUM after approval  

**Next recommended action:** Owner se Body Type reuse vs new table decision lo.

---

### Calculator: BUN Creatinine Ratio Calculator - duplicate-queue-reconciled

**Abhi kya status hai?**  
Already developed + registered + commits present.

**Issue kya hai?**  
Duplicate queue entry after genuine completion.

**Ye issue kyun aaya?**  
Doosra agent pehle complete kar chuka tha; naya claim rebuild nahi kar sakta tha.

**Kya hum isko solve kar sakte hain?**  
Haan, existing files se.

**Is calculator ko develop kaise karenge?**

1. Module `bun-creatinine-ratio` confirm.  
2. Optional Mongo read-back.  
3. Issued duplicate reconcile.  
4. No rebuild.

**Humein kya chahiye?**  
Kuch nahi.

**Kya user ko kuch provide karna padega?**  
NO

**Estimated difficulty:** EASY  

**Next recommended action:** Duplicate reconcile only.

---

### Calculator: CIWA Calculator

**Abhi kya status hai?**  
Undeveloped; prompt + screenshot ready.

**Issue kya hai?**  
Mongo DNS fail — `_id` verify nahi hua, coding start nahi hui.

**Ye issue kyun aaya?**  
tool:assign se pehle catalog verify zaroori hai.

**Kya hum isko solve kar sakte hain?**  
Haan, lekin pehle technical repair (Mongo). CIWA-Ar scale publicly known hai (10 items, max 67).

**Is calculator ko develop kaise karenge?**

1. Mongo row verify (historical hint: `…9902fb`).  
2. 10 dropdown items + orientation max 4 / others max 7.  
3. Score total + educational clinical disclaimer (no medication orders).  
4. Tests for each item + max score.  
5. Registry + assign + commits.

**Humein kya chahiye?**  
Mongo connectivity. Original CIWA-Ar descriptors from approved clinical source (standard scale).

**Kya user ko kuch provide karna padega?**  
NO for screenshots/prompt; optional clinical source confirmation if you want a specific wording pack.

**Estimated difficulty:** MEDIUM  

**Next recommended action:** Mongo fix → develop CIWA-Ar worksheet.

---

### Calculator: Face Shape Calculator

**Abhi kya status hai?**  
Undeveloped.

**Issue kya hai?**  
Seven face shapes ke liye reliable numeric rules / jawline mapping verified nahi.

**Ye issue kyun aaya?**  
Public Omni text qualitative hai; random website thresholds Omega ke liye authoritative nahi.

**Kya hum isko solve kar sakte hain?**  
Pehle verified formula/data chahiye.

**Is calculator ko develop kaise karenge?**

1. Approved heuristic table lo (tolerances, tie-breaks, jawline length vs width, optional sex effect).  
2. Screenshot inputs UI.  
3. Classification engine + borderline tests.  
4. Mongo + registry + assign.  
5. Commits + Completed.

**Humein kya chahiye?**  
Verified decision heuristics.

**Kya user ko kuch provide karna padega?**  
YES

**Estimated difficulty:** HARD / BLOCKED without table  

**Next recommended action:** User se approved face-shape rule pack.

---

### Calculator: Metastatic Prostate Cancer Prognosis Calculator

**Abhi kya status hai?**  
Undeveloped; **Session 9** clinical evidence pack complete. Remains **Issued**. No engine. Live Mongo re-verify this session blocked (`querySrv EBADRESP`); historical `_id` `6af46f12a27d8d1d4e9902d7`.

**Issue kya hai?**  
Omni composite incomplete: Albertsen Gleason rates + Zhang/Huncharek RRs published, but SSA vintage, mets/health multipliers, hazard-merge equation, and fixtures **missing**. Secondary clones invent mets×2 / health 0.85–1.50 — not approvable. Albertsen = localized cohort, not metastatic-first. Title vs mets=No UI conflict.

**Ye issue kyun aaya?**  
Patient-facing prognosis invent karna forbidden (clinical safety gate). Papers combine ≠ validated calculator.

**Kya hum isko solve kar sakte hain?**  
Only after owner approves an exact model + coefficient/fixture pack (or retires the tool).

**Is calculator ko develop kaise karenge?**

1. Owner approval of exact model (see `brain/reports/OMEGA-METASTATIC-PROSTATE-CLINICAL-EVIDENCE-PACK-composer-mpc-s9.md`).  
2. Full coefficients + SSA vintage + merge equation + fixtures.  
3. Title vs metastatic eligibility confirm.  
4. UI per screenshot + strong educational disclaimer.  
5. Engine tests against approved fixtures only.  
6. Mongo assign only after correctness.  
7. Commits + Completed.

**Humein kya chahiye?**  
Clinical/product-owner MODEL_APPROVAL + complete coefficient pack.

**Kya user ko kuch provide karna padega?**  
YES

**Estimated difficulty:** HARD / BLOCKED  

**Next recommended action:** Do not code until MODEL_APPROVAL; use Session 9 evidence pack.

---

### Calculator: Quiz Protein Creatinine Ratio Calculator

**Abhi kya status hai?**  
Undeveloped quiz. Prompt mein 5 answers already likhe hain. (Note: normal Protein Creatinine **Ratio** calculator alag hai aur already coded hai — quiz usko replace nahi karega.)

**Issue kya hai?**  
Live MongoDB mein is quiz ka authorized catalog record nahi mila / create allowed nahi.

**Ye issue kyun aaya?**  
Bina `_id` ke tool:assign aur public activation nahi ho sakti; naya row invent karna forbidden.

**Kya hum isko solve kar sakte hain?**  
Pehle MongoDB authorization chahiye (seed/restore row). Uske baad quiz easy hai.

**Is calculator ko develop kaise karenge?**

1. Admin/authorized catalog row create ya restore (name/slug/pillar).  
2. 5 MCQs exact wording + distractors.  
3. Score only when all answered (`correct/5`).  
4. Registry key alag rakho (`QuizProteinCreatinine…`) — non-quiz PCR se mix mat karo.  
5. Assign + activate policy ke mutabiq.  
6. Commits + Completed.

**Humein kya chahiye?**  
MongoDB record authorization.

**Kya user ko kuch provide karna padega?**  
YES — catalog row create/restore ki ijazat (answers already in prompt).

**Estimated difficulty:** MEDIUM (blocked until Mongo row exists); EASY after  

**Next recommended action:** Authorize quiz catalog seed, then develop quiz module.

---

## Quick YES/NO — user input required?

| Calculator | User input? | What |
| --- | --- | --- |
| Addiction | YES | Evidence / life-lost tables |
| Adrenal Washout duplicate | NO | — |
| Albumin ACR duplicate | NO | — |
| Alcohol Unit | NO | (env Mongo fix) |
| Body Shape | YES | Rule table or Body Type reuse approval |
| BUN duplicate | NO | — |
| CIWA | NO | (env Mongo fix) |
| Face Shape | YES | Heuristic table |
| Metastatic Prostate | YES | Clinical coefficient pack |
| Quiz Protein Creatinine | YES | Mongo catalog authorization |
