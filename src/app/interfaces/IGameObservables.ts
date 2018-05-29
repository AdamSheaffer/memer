import { Observable } from 'rxjs';
import { IGame } from './IGame';
import { IPlayer } from './IPlayer';

export interface IGameObservables {
  game$: Observable<IGame>;
  playerList$: Observable<IPlayer[]>;
  currentPlayer$: Observable<IPlayer>;
}
