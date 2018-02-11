import { Pipe, PipeTransform } from '@angular/core';
import { shuffle } from 'lodash';
import { IPlayer } from '../interfaces/IPlayer';

@Pipe({
  name: 'shufflePlayers',
  pure: true
})
export class ShufflePlayersPipe implements PipeTransform {
  private _cachedData: IPlayer[];

  transform(players: IPlayer[]): any {
    if (!players || !players.length) {
      return players;
    }

    if (players.every(p => this.playerIsInCache(p, this._cachedData))) {
      return this._cachedData;
    }

    this._cachedData = shuffle(players);
    return this._cachedData;
  }

  private playerIsInCache(player: IPlayer, cache: IPlayer[]) {
    if (!cache || !cache.length) return false;
    return !!cache.find(p => p.uid === player.uid);
  }
}