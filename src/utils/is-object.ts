export function isObject<K extends string | number | symbol, T>(subject: unknown): subject is Record<K, T> {
  return !!(subject && typeof subject === "object")
}
