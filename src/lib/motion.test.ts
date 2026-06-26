import { test } from "node:test";
import assert from "node:assert/strict";
import { velocityToSkew, EASE, DUR } from "./motion.ts";

test("velocityToSkew clamps to +max", () => {
  assert.equal(velocityToSkew(100000), 2.5);
});
test("velocityToSkew clamps to -max", () => {
  assert.equal(velocityToSkew(-100000), -2.5);
});
test("velocityToSkew is ~0 at rest", () => {
  assert.equal(velocityToSkew(0), 0);
});
test("velocityToSkew scales linearly below clamp", () => {
  assert.equal(velocityToSkew(500, 2.5, 0.002), 1);
});
test("tokens are present", () => {
  assert.equal(EASE.snap.length, 4);
  assert.equal(DUR.slow, 0.34);
});
