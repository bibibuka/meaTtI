import assert from "node:assert/strict";
import test from "node:test";

import {
  clamp01,
  progressFromPointer,
  progressFromScroll,
  scrollTopFromProgress,
} from "../scroll-controller.mjs";

test("clamp01 prevents the diver from leaving either end of the rope", () => {
  assert.equal(clamp01(-0.2), 0);
  assert.equal(clamp01(0.42), 0.42);
  assert.equal(clamp01(1.8), 1);
});

test("progressFromScroll maps the usable document range instead of total height", () => {
  assert.equal(progressFromScroll(500, 2_000, 1_000), 0.5);
  assert.equal(progressFromScroll(-40, 2_000, 1_000), 0);
  assert.equal(progressFromScroll(1_400, 2_000, 1_000), 1);
});

test("progressFromScroll stays at the surface when the document cannot scroll", () => {
  assert.equal(progressFromScroll(10, 800, 800), 0);
  assert.equal(progressFromScroll(10, 600, 800), 0);
});

test("scrollTopFromProgress clamps keyboard and drag requests to the page", () => {
  assert.equal(scrollTopFromProgress(0.25, 2_500, 500), 500);
  assert.equal(scrollTopFromProgress(-1, 2_500, 500), 0);
  assert.equal(scrollTopFromProgress(2, 2_500, 500), 2_000);
  assert.equal(scrollTopFromProgress(0.5, 500, 800), 0);
});

test("progressFromPointer maps the pointer to the visible track", () => {
  assert.equal(progressFromPointer(350, 100, 500), 0.5);
  assert.equal(progressFromPointer(20, 100, 500), 0);
  assert.equal(progressFromPointer(700, 100, 500), 1);
  assert.equal(progressFromPointer(350, 100, 0), 0);
});
