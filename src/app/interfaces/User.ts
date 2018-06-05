import { Roles } from '.';

export interface User {
  uid: string;
  fullName: string;
  username: string;
  photoURL: string;
  thumbnailURL: string;
  roles?: Roles;
}
