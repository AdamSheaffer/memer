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
  captionDeck: string[];
  isVotingRound: boolean;
}