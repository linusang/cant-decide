export const useResizeObserver = (el: HTMLElement, onResized: () => void) => {
  const resizedCallback = () => {
    onResized();
  };

  const resizeObserver = new ResizeObserver(resizedCallback);
  resizeObserver.observe(el);

  const disconnect = () => {
    resizeObserver.disconnect();
  };
  return disconnect;
};
