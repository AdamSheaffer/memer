import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../../interfaces';

@Pipe({
  name: 'shuffle'
})
export class ShufflePipe implements PipeTransform {
  // This isn't really shuffling... Just ordering by caption arbitrarily.
  transform(players: Player[]): Player[] {
    return players.sort((a, b) => {
      const captionA = a.captionPlayed ? a.captionPlayed.bottom : null;
      const captionB = b.captionPlayed ? b.captionPlayed.bottom : null;
      if (captionA < captionB) {
        return -1;
      }
      if (captionA > captionB) {
        return 1;
      }
      return 0;
    });
  }

}
