export type Modify<R, T> = Omit<R, keyof T> & T;

export class JsUtility {
  /**
   * Simple object check.
   * @param item
   * @returns {boolean}
   */
  static isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  /**
   * Deep merge two objects.
   * @param target
   * @param ...sources
   */
  static mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (JsUtility.isObject(target) && JsUtility.isObject(source)) {
      for (const key in source) {
        if (JsUtility.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          JsUtility.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return JsUtility.mergeDeep(target, ...sources);
  }

  /**
   * Given an object obj {} and a string of separated for keys by dots
   * like "key1.key2.key3", it will return the object property under obj.key1.key2.key3
   * @param obj
   * @param str
   */
  static accessObjectByDotSeparatedKeys(obj: Object, str: string) {
    return str
      .split(".")
      .reduce((o, i) => (o ?? {})?.[i] ?? (o ?? {})?.[parseInt(i, 10)], obj);
  }
}
