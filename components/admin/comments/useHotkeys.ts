import { useEffect } from "react";

type HotkeyHandlers = {
  onNext: () => void;
  onPrev: () => void;
  onApprove: () => void;
  onHide: () => void;
  onToggleSelect: () => void;
  onToggleHelp: () => void;
  onEscape?: () => void;
};

const isEditable = (target: EventTarget | null) => {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
};

export function useHotkeys(enabled: boolean, handlers: HotkeyHandlers) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditable(event.target)) return;

      switch (event.key) {
        case "j":
          event.preventDefault();
          handlers.onNext();
          break;
        case "k":
          event.preventDefault();
          handlers.onPrev();
          break;
        case "a":
          event.preventDefault();
          handlers.onApprove();
          break;
        case "h":
          event.preventDefault();
          handlers.onHide();
          break;
        case "x":
          event.preventDefault();
          handlers.onToggleSelect();
          break;
        case "?":
          event.preventDefault();
          handlers.onToggleHelp();
          break;
        case "Escape":
          handlers.onEscape?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, handlers]);
}
