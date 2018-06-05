import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { IGame, IPlayer, IGameChanges } from '../../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private _gamesCollection: AngularFirestoreCollection<IGame>;
  private _gameDoc: AngularFirestoreDocument<IGame>;
  private _game$: Observable<IGame>;

  get game$() { return this._game$; }

  constructor(private afs: AngularFirestore) {
    this._gamesCollection = this.afs.collection('games');
  }

  init(gameId: string) {
    this._gameDoc = this._gamesCollection.doc(gameId);
    this._game$ = this._gameDoc.valueChanges();
    return this.game$;
  }

  async createNewGame(player: IPlayer): Promise<string> {
    const newGame = this.newGame(player);
    const gameId = await this._gamesCollection.add(newGame).then(ref => ref.id);
    return gameId;
  }

  getOpenGameList(gameCount: number): Observable<IGame[]> {
    const gamesCollection = this.afs.collection('games', ref => {
      return ref.orderBy('beginDate').where('hasStarted', '==', false).limit(gameCount);
    });

    return gamesCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<IGame>[]) => {
        const games$ = actions.map(a => {
          const game = a.payload.doc.data();
          game.id = a.payload.doc.id;
          return game;
        });
        return games$;
      })
    );
  }

  updateGame(changes: IGameChanges): Promise<void> {
    return this._gameDoc.update(changes);
  }

  private newGame(host: IPlayer): IGame {
    return {
      hasStarted: false,
      beginDate: (Date.now() * -1),
      hostId: host.uid,
      hostPhotoURL: host.thumbnailURL,
      tagOptions: [],
      gifOptionURLs: [],
      captionDeck: [],
      isVotingRound: false,
      lastUpdated: Date.now(),
    };
  }

}
