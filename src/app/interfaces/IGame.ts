import { IPlayer } from "./IPlayer";
import { ICard } from "./ICard";

export interface IGame {
  id?: string;
  hasStarted: boolean;
  players: IPlayer[];
  turn?: string;
  turnUsername?: string;
  tagOptions: string[];
  tagSelection?: string;
  gifOptionURLs: string[];
  gifOptionIndex: number;
  gifSelectionURL?: string;
  roundWinner?: IPlayer;
  captionDeck: ICard[];
  isVotingRound: boolean;
  winner?: IPlayer;
}