// Shared handle to the drei ScrollControls scroll container, set once by
// ScrollBridge, so HTML UI outside the Canvas (nav, intro skip, a11y controls)
// can drive scroll position programmatically.
export const scrollHandle: { el: HTMLElement | null } = { el: null };

export function scrollToGlobalT(t: number, smooth = true) {
  const el = scrollHandle.el;
  if (!el) return;
  const max = el.scrollHeight - el.clientHeight;
  el.scrollTo({ top: Math.max(0, Math.min(max, max * t)), behavior: smooth ? "smooth" : "auto" });
}
