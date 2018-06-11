import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private _safeForWork = false;
  get safeForWork() { return this._safeForWork; }

  constructor() { }

  setSafeForWorkMode(isSFW: boolean) {
    this._safeForWork = isSFW;
  }
}
