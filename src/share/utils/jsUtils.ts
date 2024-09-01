export function deepCopy<T>(obj: T): T {
  const json = JSON.stringify(obj);
  return JSON.parse(json) as T;
}
