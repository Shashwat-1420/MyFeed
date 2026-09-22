/*
 * Celebration shim.
 *
 * The web build used `canvas-confetti`, which has no React Native equivalent
 * without pulling in a canvas dependency. To keep the call sites (Reviewed /
 * Saved celebrations) unchanged and the bundle lean, this is intentionally a
 * no-op on native.
 *
 * TODO(Phase C polish): replace with a lightweight Animated confetti burst so
 * the "Mark as Reviewed" moment still feels rewarding on-device.
 */
export function celebrate(_options?: Record<string, unknown>): void {
  // no-op on native
}

export default celebrate;