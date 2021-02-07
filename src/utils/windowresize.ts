/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Returns a function, that, as long as it continues to be invoked,
 * will not be triggered. The function will be called after it
 * stops being called for N milliseconds. If `immediate` is passed,
 * trigger the function on the leading edge, instead of the trailing.
 * @see https://davidwalsh.name/javascript-debounce-function
 * @param  {Function} func Function to call after delay.
 * @param  {Number} wait Milliseconds to wait before next call.
 * @param  {Boolean} immediate True to not wait.
 */
function debounce(func: Function, wait: number, immediate = false): (e: Event) => any {
  let timeout: number;
  // eslint-disable-next-line func-names
  return function (this: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const later = () => {
      timeout = 0;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && timeout !== 0;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Window resize listener functionality.
 * Add callback functions that will be called on window resize,
 * but debounced to not be called more that every so many milliseconds.
 */
const callbacks: Function[] = [];
const delay = 250;
let debouncedFunction: (e: Event) => any;

export default function addWindowResizeCallback(callback: Function) {
  callbacks.push(callback);
  if (!debouncedFunction) {
    debouncedFunction = debounce(() => {
      callbacks.forEach((callbackFunction) => {
        callbackFunction();
      });
    }, delay);
    window.addEventListener('resize', debouncedFunction);
  }
}
