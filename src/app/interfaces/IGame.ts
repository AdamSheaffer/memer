import { IPlayer } from './IPlayer';
import { ICard } from './ICard';
import { IMessage } from './IMessage';

export interface IGame {
  id?: string;
  beginDate: number;
  hasStarted: boolean;
  players: IPlayer[];
  turn?: string;
  turnUsername?: string;
  tagOptions: string[];
  tagSelection?: string;
  gifOptionURLs: string[];
  gifSelectionURL?: string;
  roundWinner?: IPlayer;
  captionDeck: ICard[];
  isVotingRound: boolean;
  winner?: IPlayer;
  messages: IMessage[];
}
