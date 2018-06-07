import * as firebase from 'firebase/app';

export class Message {
  content: string;
  username: string;
  photoURL: string;
  userUID: string;
  timeStamp: firebase.firestore.FieldValue;
}
