export enum Presence {
  ONLINE = 'Online',
  OFFLINE = 'Offline'
}

export interface OnlineStatus {
  state: Presence;
  lastChanged: Object;
}
