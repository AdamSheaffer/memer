import { Pipe, PipeTransform } from '@angular/core';
import * as firebase from 'firebase/app';

@Pipe({
  name: 'fromFBDate'
})
export class FromFBDatePipe implements PipeTransform {

  transform(value: firebase.firestore.Timestamp): Date {
    return value.toDate();
  }

}
