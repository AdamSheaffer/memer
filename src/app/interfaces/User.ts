import { Roles, ProfileStats } from '.';

export interface User {
  uid: string;
  fullName: string;
  username: string;
  photoURL: string;
  thumbnailURL: string;
  roles?: Roles;
  profileStats?: ProfileStats;
}
