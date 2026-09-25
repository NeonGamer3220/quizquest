import { useState, useCallback } from "react";

export function useToast() {
  const [msg, setMsg] = useState(null);
  const toast = useCallback((text) => {
    setMsg(text);
    window.clearTimeout(window.__toastTimer);
    window.__toastTimer = window.setTimeout(() => setMsg(null), 2200);
  }, []);
  return [msg, toast];
}
