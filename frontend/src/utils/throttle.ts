/** 简易节流（替代 lodash.throttle） */
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  wait = 1000,
) {
  let last = 0;
  let timer: number | undefined;

  return (...args: A) => {
    const now = Date.now();
    const remaining = wait - (now - last);

    if (remaining <= 0) {
      if (timer) {
        window.clearTimeout(timer);
        timer = undefined;
      }
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = window.setTimeout(() => {
        last = Date.now();
        timer = undefined;
        fn(...args);
      }, remaining);
    }
  };
}
