import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../../interfaces';

@Pipe({
  name: 'activePlayers',
  pure: false
})
export class ActivePlayersPipe implements PipeTransform {
  transform(players: Player[]): Player[] {
    return players.filter(p => p.isActive);
  }
}
