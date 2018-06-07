import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../../interfaces';

@Pipe({
  name: 'currentUser'
})
export class CurrentUserPipe implements PipeTransform {

  transform(players: Player[], uid: string): Player {
    return players.find(p => p.uid === uid);
  }

}
