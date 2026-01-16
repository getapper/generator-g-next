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

  /**
   * Sets a nested value in an object using a path string with "/" separators.
   * Creates intermediate objects if they don't exist.
   * @param obj - The target object
   * @param path - Path string with "/" separators (e.g., "key1/key2/key3")
   * @param value - The value to set
   */
  static setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split("/");
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  /**
   * Gets a nested value from an object using a path string with "/" separators.
   * Returns undefined if the path doesn't exist.
   * @param obj - The source object
   * @param path - Path string with "/" separators (e.g., "key1/key2/key3")
   * @returns The value at the path, or undefined if not found
   */
  static getNestedValue(obj: any, path: string): any {
    const keys = path.split("/");
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return undefined;
      }
      current = current[key];
    }

    return current;
  }
}
