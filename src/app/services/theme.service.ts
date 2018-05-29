import { Injectable } from '@angular/core';

@Injectable()
export class ThemeService {
  private _theme: Theme = Theme.LIGHT;

  get theme() { return this._theme; }

  constructor() { }

  changeTheme() {
    this._theme = this._theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
  }

  setDark() {
    this._theme = Theme.DARK;
  }

  setLight() {
    this._theme = Theme.LIGHT;
  }
}

export enum Theme {
  LIGHT = 1,
  DARK
}
