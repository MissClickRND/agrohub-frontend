export function patchPassiveInside(
  root: HTMLElement,
  events: Array<keyof DocumentEventMap> = ["touchstart", "touchmove", "wheel"]
): () => void {
  const orig = EventTarget.prototype.addEventListener;

  function patched(
    this: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    const isTargetNode = (this as any) instanceof Node;
    const insideRoot = isTargetNode ? root.contains(this as Node) : false;
    const isScrollEvt = events.includes(type as keyof DocumentEventMap);

    const hasExplicitPassive =
      typeof options === "object" &&
      options !== null &&
      "passive" in (options as AddEventListenerOptions);

    if (insideRoot && isScrollEvt && !hasExplicitPassive) {
      const newOpts: AddEventListenerOptions =
        typeof options === "object" && options !== null
          ? { ...options, passive: true }
          : { passive: true };
      // @ts-expect-error - call with spread options
      return orig.call(this, type, listener, newOpts);
    }
    // @ts-expect-error - pass-through
    return orig.call(this, type, listener, options);
  }

  EventTarget.prototype.addEventListener = patched as any;

  return () => {
    EventTarget.prototype.addEventListener = orig;
  };
}
