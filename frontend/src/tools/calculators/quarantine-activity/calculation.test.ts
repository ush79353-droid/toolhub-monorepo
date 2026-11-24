import assert from "node:assert/strict";
import { calculateQuarantineActivity } from "./calculation";
import { createEmptyInput } from "./types";
const input = createEmptyInput();
const r = calculateQuarantineActivity(input);
assert.ok(r != null);
console.log("quarantine-activity calculation.test.ts: ok");
