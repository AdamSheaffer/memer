import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../../interfaces';
import { shuffle } from 'lodash';

@Pipe({
  name: 'shuffle'
})
export class ShufflePipe implements PipeTransform {
  // This isn't really shuffling... Just ordering by caption arbitrarily.
  transform(players: Player[]): Player[] {
    const playersCopy = [...players];
    return shuffle(playersCopy);
  }

}
