import { Pipe, PipeTransform } from '@angular/core';
import { shuffle } from 'lodash';

@Pipe({
  name: 'shuffle',
  pure: false
})
export class ShufflePipe implements PipeTransform {
  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
      return items;
    }

    return shuffle(items);
  }
}