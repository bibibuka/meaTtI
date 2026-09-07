/**
 * Haptic feedback utility for mobile touch devices.
 * Uses navigator.vibrate with automatic device support detection.
 */
export function triggerHaptic(pattern: number | number[] = 10) {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  if (!("vibrate" in navigator) || typeof navigator.vibrate !== "function") return;

  try {
    navigator.vibrate(pattern);
  } catch {
    // Ignore in browsers where vibrate permissions are denied
  }
}

export const haptic = {
  /** Subtle micro-tick for chip clicks, tab switches, thumbnail selections (8ms) */
  tick: () => triggerHaptic(8),

  /** Distinct tap for accordion opening, button clicks, case slide transitions (16ms) */
  tap: () => triggerHaptic(16),

  /** Double feedback pulse for drawer/modal open/close (10ms, pause 30ms, 12ms) */
  toggle: () => triggerHaptic([10, 30, 12]),

  /** Pleasant confirmation pulse for form submissions (12ms, pause 40ms, 20ms) */
  success: () => triggerHaptic([12, 40, 20]),
};
