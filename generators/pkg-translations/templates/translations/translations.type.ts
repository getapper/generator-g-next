// https://react.i18next.com/latest/trans-component#alternative-usage-components-array

export type Translations = Readonly<{}>;

export type MakeStringValues<T extends Record<string, unknown>> = {
  readonly [K in keyof T]: string;
};
