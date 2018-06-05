// I'm adding this pipe because in order to sort descending by date,
// I'm multiplying Date.now() by -1. This gets absolute values for these

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs'
})
export class AbsPipe implements PipeTransform {

  transform(value: number): number {
    return Math.abs(value);
  }

}
