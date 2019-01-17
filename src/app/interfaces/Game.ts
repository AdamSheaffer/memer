import { Meme, Player, Card, Round } from '.';
import * as firebase from 'firebase/app';

export interface Game {
  id?: string;
  beginDate: firebase.firestore.FieldValue;
  hasStarted: boolean;
  hostId: string;
  hostPhotoURL: string;
  turn?: string;
  turnUsername?: string;
  tagOptions: string[];
  tagSelection?: string;
  gifOptionURLs: string[];
  memeTemplate?: Meme;
  roundWinner?: Player;
  captionDeck: Card[];
  isVotingRound: boolean;
  winner?: Player;
  lastUpdated: firebase.firestore.FieldValue;
  safeForWork: boolean;
  maxPlayers: number;
  pointsToWin: number;
  round?: Round;
  reverseRoundFrequency?: number;
}

export interface GameChanges {
  hasStarted?: boolean;
  hostId?: string;
  turn?: string;
  turnUsername?: string;
  tagOptions?: string[];
  tagSelection?: string;
  gifOptionURLs?: string[];
  memeTemplate?: Meme;
  roundWinner?: Player;
  captionDeck?: Card[];
  isVotingRound?: boolean;
  winner?: Player;
  lastUpdated?: firebase.firestore.FieldValue;
  round?: Round;
  reverseRoundFrequency?: number;
}
