# Diver Scroll Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated white prototype page whose draggable scrollbar thumb is a schematic animated scuba diver and whose completed track is a rope.

**Architecture:** A static HTML page owns the long-form test canvas. A scoped stylesheet draws the layout and motion, while one browser-native ES module maps document scroll to the controller and exposes pure range helpers for Node tests.

**Tech Stack:** HTML, CSS, inline SVG, ES modules, Pointer Events, Node `node:test`, Python Playwright for browser QA.

## Global Constraints

- Keep every project change inside `public/diver-scroll/`.
- Add no npm dependency.
- Match the existing transition doodles: blue monoline, no realism, round caps/joins.
- Keep scroll and drag mapping linear and interruptible.
- Respect `prefers-reduced-motion`.

---

### Task 1: Scroll range mapping

**Files:**
- Create: `public/diver-scroll/tests/scroll-controller.test.mjs`
- Create: `public/diver-scroll/scroll-controller.mjs`

**Interfaces:**
- Produces: `clamp01(value)`, `progressFromScroll(scrollTop, scrollHeight, viewportHeight)`, `scrollTopFromProgress(progress, scrollHeight, viewportHeight)`, and `progressFromPointer(clientY, trackTop, trackHeight)`.

- [x] **Step 1: Write the failing test** with hand-derived expectations for normal, zero-range, and out-of-bounds values.
- [x] **Step 2: Run `node --test public/diver-scroll/tests/scroll-controller.test.mjs`** and confirm failure is caused by the missing module.
- [x] **Step 3: Implement the four pure helpers** with direct arithmetic and one clamp.
- [x] **Step 4: Re-run the Node test** and confirm all cases pass.

### Task 2: Standalone page and controller

**Files:**
- Create: `public/diver-scroll/index.html`
- Create: `public/diver-scroll/diver-scroll.css`
- Modify: `public/diver-scroll/scroll-controller.mjs`
- Create: `public/diver-scroll/tests/prototype_smoke.py`

**Interfaces:**
- Consumes: the four range helpers from Task 1.
- Produces: a focusable `[role="scrollbar"]`, `#rope-progress`, and native document scrolling at `/diver-scroll/index.html`.

- [x] **Step 1: Write a failing Playwright smoke test** that expects the controller, scroll sync, keyboard movement, drag-to-bottom, and no console/page errors.
- [x] **Step 2: Run the smoke test against the dev server** and confirm it fails because the page is not implemented.
- [x] **Step 3: Build semantic HTML and the inline SVG diver**, including sparse depth sections that make scrolling easy to judge.
- [x] **Step 4: Add scoped CSS** for the white canvas, hidden native scrollbar, rope, breathing bubbles, buoyancy, fin movement, focus, responsive sizes, and reduced motion.
- [x] **Step 5: Add controller behavior** using one requestAnimationFrame scroll sync, pointer capture, resize recalculation, and Arrow/Page/Home/End support.
- [x] **Step 6: Re-run unit and smoke tests** until both pass without warnings or console errors.

### Task 3: Visual and production verification

**Files:**
- Modify only the prototype files above if verification exposes an issue.

- [x] **Step 1: Capture desktop, mid-scroll, dragged-bottom, mobile, and reduced-motion screenshots.**
- [x] **Step 2: Inspect each capture** for line weight, rope/diver alignment, clipping, overlap, readability, and unintended native scrollbar visibility.
- [x] **Step 3: Run `npx eslint public/diver-scroll/scroll-controller.mjs` and `npm run build`.**
- [x] **Step 4: Run the complete unit and browser checks once more after any polish.**
- [x] **Step 5: Request an independent code/design review and address all critical or important findings.**
