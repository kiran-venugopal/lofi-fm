export function makeDebounced(fn: Function, duration = 300) {
  let timerID: NodeJS.Timeout | undefined;

  return (...args: any[]) => {
    if (timerID) {
      clearTimeout(timerID);
    }
    timerID = setTimeout(() => {
      fn(...args);
      timerID = undefined;
    }, duration);
  };
}
