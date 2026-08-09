# Diver Scroll Prototype — Design

## Goal

Replace the visible scrollbar thumb on a standalone white test page with a hand-drawn scuba diver. The diver must track document scroll, be draggable, and leave a rope behind to visualize completed distance.

## Chosen approach

Use one isolated static page under `public/diver-scroll/`. This avoids the site's shared Header, Footer, route transition, and global smooth-scroll behavior while keeping the prototype available from the existing Next.js dev server.

The page uses native document scrolling as the source of truth. A small ES module maps scroll range to a fixed right-side track and handles Pointer Events plus keyboard control. No dependency is added.

## Visual language

- White page, black Geist-like system typography, and the existing Tailwind v4 transition blue (`#155dfc`) with pale sky-blue secondary marks.
- SVG-only illustration with no raster asset: approximately 2 px monoline strokes, `round` caps and joins, no heavy fills, and deliberately simple geometry like the boats, fin, ring, and raft in `Header.tsx`.
- The diver descends upright, feet first, while holding the rope: mask, a tall cylinder behind the back, bent arms, torso, legs, and two fins. No facial detail or realism.
- The rope is a lightly irregular vertical SVG path. Its strong blue segment ends at the diver; the faint segment below shows remaining travel.

## Motion

- Signature interaction: scroll or drag moves the diver 1:1 along the rope.
- Breathing trail: every 3 seconds, the diver releases a quick burst of 7–10 bubbles. The first bubbles rise higher than the last ones (16 px down to 8 px), while every bubble stays at its release point and fades after 1.5 seconds.
- Buoyancy: the body drifts by about 2 px with a small ±1.5° rotation.
- Active descent/ascent: fins alternate more quickly and the body leans a few degrees in the current direction.
- Reduced motion leaves a static diver and updates position without decorative movement.

## Interaction and accessibility

- Wheel, touch scrolling, Page Up/Down, and browser navigation remain native.
- Drag uses Pointer Events and pointer capture; no inertia or spring is added.
- The diver exposes `role="scrollbar"`, current percentage, orientation, and Arrow/Page/Home/End keyboard controls.
- Focus is visible. The control uses `touch-action: none` only on the draggable diver, not on the page.
- The native scrollbar is hidden only inside this standalone document.

## Verification

- Node's built-in test runner verifies clamp and range mapping.
- A Playwright smoke test verifies the page, scroll sync, keyboard movement, drag-to-bottom, console cleanliness, and screenshots at desktop/mobile sizes.
- Final checks: unit test, ESLint on the module, Next production build, reduced-motion screenshot, and manual visual review of the generated captures.
