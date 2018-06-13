import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Message, Player } from '../../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _messageCollection: AngularFirestoreCollection<Message>;
  private _messages$: Observable<Message[]>;

  gameId: string;
  get messages$() { return this._messages$; }

  constructor(private afs: AngularFirestore) {
  }

  init(gameId: string) {
    this._messageCollection = this.afs.collection('games')
      .doc(gameId)
      .collection('messages', ref => {
        return ref.orderBy('timeStamp');
      });

    this._messages$ = this._messageCollection.valueChanges();
  }

  sendMessage(player: Player, content: string) {
    const msg: Message = {
      photoURL: player.photoURL,
      username: player.username,
      userUID: player.uid,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      content
    };

    return this._messageCollection.add(msg);
  }

  postAdminMessage(content: string) {
    const msg: Message = {
      photoURL: 'assets/header_logo_thumb.png',
      username: 'MEMER',
      userUID: null,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      content
    };

    return this._messageCollection.add(msg);
  }
}
