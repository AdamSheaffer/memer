import { ICard } from './ICard';

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
}

export interface IPlayerChanges {
  isActive?: boolean;
  score?: number;
  captions?: ICard[];
  captionPlayed?: ICard;
}
