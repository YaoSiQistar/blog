export function rafThrottle<T extends (...args: any[]) => void>(fn: T): (...args: Parameters<T>) => void {
  let frame = 0;
  let lastArgs: Parameters<T> | null = null;

  const run = () => {
    frame = 0;
    if (!lastArgs) return;
    const args = lastArgs;
    lastArgs = null;
    fn(...args);
  };

  return (...args: Parameters<T>) => {
    lastArgs = args;
    if (frame) return;
    if (typeof window === "undefined") {
      run();
      return;
    }
    frame = window.requestAnimationFrame(run);
  };
}