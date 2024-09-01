// Detects if device is on iOS
export function isIos() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

// Detects if device is in standalone mode
export function isInStandaloneMode() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return "standalone" in window.navigator && window.navigator.standalone;
}

export function isIphone() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone/.test(userAgent);
}

export function isIpad() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /ipad/.test(userAgent);
}
