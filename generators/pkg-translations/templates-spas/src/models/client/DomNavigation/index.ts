import { NavigateFunction } from "react-router";
import { Locales } from "@/models/common/Translation";

export class DomNavigation {
  private _navigate: NavigateFunction;
  private _locale: Locales;

  constructor() {
    this._navigate = null;
    this._locale = null;
  }

  set navigate(n: NavigateFunction) {
    this._navigate = n;
  }

  get navigate(): NavigateFunction {
    return this._navigate;
  }

  set locale(l: Locales) {
    this._locale = l;
  }

  get locale(): Locales {
    return this._locale;
  }
}

export default new DomNavigation();
