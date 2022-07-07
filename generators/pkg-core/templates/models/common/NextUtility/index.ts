export type INextUtility = {};

export class NextUtility implements INextUtility {
  static get isServer(): boolean {
    return typeof window === "undefined";
  }

  static get isClient(): boolean {
    return !NextUtility.isServer;
  }
}
