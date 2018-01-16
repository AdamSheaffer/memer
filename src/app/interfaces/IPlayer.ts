export interface IPlayer {
  uid: string;
  fullName: string;
  username: string;
  photoURL: string;
  isActive: boolean;
  isHost: boolean;
  score: number;
  captions: string[];
  captionPlayed?: string;
}