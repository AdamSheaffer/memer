import { Pipe, PipeTransform } from '@angular/core';
import { IPlayer } from '../interfaces/IPlayer';

@Pipe({
  name: 'currentUser'
})
export class CurrentUserPipe implements PipeTransform {

  transform(players: IPlayer[], uid: string): IPlayer {
    return players.find(p => p.uid === uid);
  }

}
