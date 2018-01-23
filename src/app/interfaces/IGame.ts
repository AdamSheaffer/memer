import { IPlayer } from "./IPlayer";

export interface IGame {
  id?: string;
  hasStarted: boolean;
  players: IPlayer[];
  turn?: string;
  tagOptions: string[];
  tagSelection?: string;
  gifOptionURLs: string[];
  gifOptionIndex: number;
  gifSelectionURL?: string;
  roundWinner?: IPlayer;
  captionDeck: string[];
  isVotingRound: boolean;
  winner?: IPlayer;
}