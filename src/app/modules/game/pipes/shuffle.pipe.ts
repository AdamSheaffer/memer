import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../../interfaces';
import shuffle from 'lodash/shuffle';

@Pipe({
  name: 'shuffle'
})
export class ShufflePipe implements PipeTransform {
  transform(players: Player[]): Player[] {
    const playersCopy = [...players];
    return shuffle(playersCopy);
  }

}
