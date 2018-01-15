import { IPlayer } from "./IPlayer";

export interface IGame {
  id?: string;
  hasStarted: boolean;
  players: IPlayer[];
  turn: number;
}