import { IPlayer } from './IPlayer';
import { Card } from './Card';

export interface Game {
  id?: string;
  beginDate: number;
  hasStarted: boolean;
  hostId: string;
  hostPhotoURL: string;
  turn?: string;
  turnUsername?: string;
  tagOptions: string[];
  tagSelection?: string;
  gifOptionURLs: string[];
  gifSelectionURL?: string;
  roundWinner?: IPlayer;
  captionDeck: Card[];
  isVotingRound: boolean;
  winner?: IPlayer;
  lastUpdated: number;
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
  roundWinner?: IPlayer;
  captionDeck?: Card[];
  isVotingRound?: boolean;
  winner?: IPlayer;
  lastUpdated?: number;
}
