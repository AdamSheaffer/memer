import { Pipe, PipeTransform } from '@angular/core';
import { shuffle } from 'lodash';

@Pipe({
  name: 'shuffle',
  pure: true
})
export class ShufflePipe implements PipeTransform {
  transform(items: any[]): any {
    if (!items) {
      return items;
    }

    return shuffle(items);
  }
}