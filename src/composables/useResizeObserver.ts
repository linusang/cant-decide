export const useResizeObserver = (el: HTMLElement, onResized: () => void) => {
  const resizedCallback = () => {
    onResized();
  };

  let resizeObserver = new ResizeObserver(resizedCallback);
  resizeObserver.observe(el);

  const disconnect = () => {
    resizeObserver.disconnect();
  };
  return disconnect;
};
