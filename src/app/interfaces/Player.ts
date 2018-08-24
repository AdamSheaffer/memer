import { Roles, Card } from '.';

export interface Player {
  uid: string; // User ID
  gameAssignedId?: string; // ID assigned by each game
  fullName: string;
  username: string;
  photoURL: string;
  thumbnailURL: string;
  isActive: boolean;
  score: number;
  captionPlayed?: Card;
  roles: Roles;
}

export interface IPlayerChanges {
  isActive?: boolean;
  score?: number;
  captionPlayed?: Card;
}
