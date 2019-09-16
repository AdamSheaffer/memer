// This implementation is taken from the firebase docs:
// https://firebase.google.com/docs/firestore/solutions/presence

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { OnlineStatus, Presence } from '../../../../interfaces/OnlineStatus';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../../../../interfaces';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private databaseOffline: OnlineStatus = {
    state: Presence.OFFLINE,
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  };

  private databaseOnline: OnlineStatus = {
    state: Presence.ONLINE,
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  };

  private firestoreOffline: OnlineStatus = {
    state: Presence.OFFLINE,
    lastChanged: firebase.firestore.Timestamp.fromDate(new Date()),
  };

  private firestoreOnline: OnlineStatus = {
    state: Presence.ONLINE,
    lastChanged: firebase.firestore.Timestamp.fromDate(new Date()),
  };

  userStatusDatabaseRef: firebase.database.Reference;
  userFirestoreRef: AngularFirestoreDocument<User>;
  online$: Observable<boolean>;
  onlineSubscription: Subscription;
  userId: string;

  constructor(private angularfireDB: AngularFireDatabase, private afs: AngularFirestore) { }

  detect(userId: string) {
    if (this.userId === userId) { return; } // We're already tracking
    if (this.onlineSubscription) { this.onlineSubscription.unsubscribe(); } // changing users

    this.userId = userId;
    this.userStatusDatabaseRef = this.angularfireDB.database.ref(`status/${userId}`);
    this.userFirestoreRef = this.afs.doc(`users/${userId}`);

    this.online$ = this.angularfireDB.object<boolean>('.info/connected').valueChanges();
    this.online$.subscribe(value => {
      if (value === false) {
        this.userFirestoreRef.update({ presence: this.firestoreOffline });
        return;
      }

      this.userStatusDatabaseRef.onDisconnect().update(this.databaseOffline).then(() => {
        this.userStatusDatabaseRef.update(this.databaseOnline);
        this.userFirestoreRef.update({ presence: this.firestoreOnline });
      });
    });
  }

  showOffline() {
    if (!this.userStatusDatabaseRef) { return; }
    if (this.onlineSubscription) {
      this.onlineSubscription.unsubscribe();
    }
    this.userId = null;
    this.userStatusDatabaseRef.set(this.databaseOffline);
  }

  addGame(gameId: string, playerId: string) {
    this.userStatusDatabaseRef.update({
      game: gameId,
      player: playerId
    });
  }
}
