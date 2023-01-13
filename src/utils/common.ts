export function makeDebounced(fn: Function, duration = 300) {
  let timerID: number | null;

  return (...args: any[]) => {
    if (timerID) {
      clearTimeout(timerID);
    }
    timerID = setTimeout(() => {
      fn(...args);
      timerID = null;
    }, duration);
  };
}
