import { Player } from './Player';
import { Card } from './Card';
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
  gifSelectionURL?: string;
  roundWinner?: Player;
  captionDeck: Card[];
  isVotingRound: boolean;
  winner?: Player;
  lastUpdated: firebase.firestore.FieldValue;
  safeForWork: boolean;
  maxPlayers: number;
  pointsToWin: number;
}

export interface GameChanges {
  hasStarted?: boolean;
  hostId?: string;
  turn?: string;
  turnUsername?: string;
  tagOptions?: string[];
  tagSelection?: string;
  gifOptionURLs?: string[];
  gifSelectionURL?: string;
  roundWinner?: Player;
  captionDeck?: Card[];
  isVotingRound?: boolean;
  winner?: Player;
  lastUpdated?: firebase.firestore.FieldValue;
}
