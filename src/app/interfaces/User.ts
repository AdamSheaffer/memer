import { Roles } from '.';
import { OnlineStatus } from './OnlineStatus';

export interface User {
  uid: string;
  fullName: string;
  username: string;
  photoURL: string;
  thumbnailURL: string;
  roles?: Roles;
  gamesPlayed?: number;
  gamesWon?: number;
  totalPoints?: number;
  presence?: OnlineStatus;
}

export interface UserChanges {
  gamesPlayed?: number;
  gamesWon?: number;
  totalPoints?: number;
}
