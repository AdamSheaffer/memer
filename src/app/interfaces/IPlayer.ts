import { Roles, ICard } from '.';

export interface IPlayer {
  uid: string; // User ID
  gameAssignedId?: string; // ID assigned by each game
  fullName: string;
  username: string;
  photoURL: string;
  thumbnailURL: string;
  isActive: boolean;
  score: number;
  captions: ICard[];
  captionPlayed?: ICard;
  roles: Roles;
}

export interface IPlayerChanges {
  isActive?: boolean;
  score?: number;
  captions?: ICard[];
  captionPlayed?: ICard;
}
