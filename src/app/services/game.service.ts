import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GameService {

  private gamesCollection: AngularFirestoreCollection<any>

  constructor(private afs: AngularFirestore) {
    this.gamesCollection = this.afs.collection('games');
  }

  gamesSnapshotChanges() {
    return this.gamesCollection.snapshotChanges();
  }

  gamesValueChanges() {
    return this.gamesCollection.valueChanges();
  }

  addGame(user): Promise<firebase.firestore.DocumentReference> {
    return this.gamesCollection.add({
      hasStarted: false,
      players: [user]
    });
  }

  findOpenGameId(): Observable<string> {
    const gamesCollection = this.afs.collection('games', ref => ref.where('hasStarted', '==', false).limit(1));
    return gamesCollection.snapshotChanges()
      .take(1)
      .map(actions => {
        const ids = actions.map(a => a.payload.doc.id);
        return ids[0];
      });
  }
}
