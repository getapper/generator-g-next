import { NavigateFunction } from "react-router";

export class DomNavigation {
  private _navigate: NavigateFunction;

  constructor() {
    this._navigate = null;
  }

  set navigate(n: NavigateFunction) {
    this._navigate = n;
  }

  get navigate(): NavigateFunction {
    return this._navigate;
  }
}

export default new DomNavigation();
