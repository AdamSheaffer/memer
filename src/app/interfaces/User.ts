import { Roles } from '.';

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
}

export interface UserChanges {
  gamesPlayed?: number;
  gamesWon?: number;
  totalPoints?: number;
}
