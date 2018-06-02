import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { IMessage } from '../interfaces/IMessage';
import { IPlayer } from '../interfaces/IPlayer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _messageCollection: AngularFirestoreCollection<IMessage>;
  private _messages$: Observable<IMessage[]>;

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

  sendMessage(player: IPlayer, content: string) {
    const msg: IMessage = {
      photoURL: player.photoURL,
      username: player.username,
      userUID: player.uid,
      timeStamp: Date.now(),
      content
    };

    return this._messageCollection.add(msg);
  }

  postAdminMessage(content: string) {
    const msg: IMessage = {
      photoURL: 'assets/logo.png',
      username: 'MEMER',
      userUID: null,
      timeStamp: Date.now(),
      content
    };

    return this._messageCollection.add(msg);
  }
}
