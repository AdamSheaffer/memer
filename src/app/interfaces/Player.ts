import { Roles, Meme } from '.';

export interface Player {
  uid: string; // User ID
  gameAssignedId?: string; // ID assigned by each game
  fullName: string;
  username: string;
  photoURL: string;
  thumbnailURL: string;
  isActive: boolean;
  score: number;
  memePlayed?: Meme;
  imageUrlPlayed?: string;
  roles: Roles;
  removed?: boolean;
}

export interface PlayerChanges {
  isActive?: boolean;
  score?: number;
  memePlayed?: Meme;
  removed?: boolean;
}
