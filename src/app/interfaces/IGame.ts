import { IPlayer } from "./IPlayer";

export interface IGame {
  id?: string;
  hasStarted: boolean;
  players: IPlayer[];
  turn?: string;
  tagOptions: string[];
  tagSelection?: string;
  gifOptionURLs: string[];
  gifSelectionURL?: string;
  roundWinner?: IPlayer;
  captionDeck: string[];
  isVotingRound: boolean;
  winner?: IPlayer;
}