import { Pipe, PipeTransform } from '@angular/core';
import { IPlayer } from '../interfaces/IPlayer';

@Pipe({
  name: 'activePlayers',
  pure: false
})
export class ActivePlayersPipe implements PipeTransform {
  transform(players: IPlayer[]): IPlayer[] {
    return players.filter(p => p.isActive);
  }
}