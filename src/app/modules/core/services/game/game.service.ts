import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { Game, Player, GameChanges, GameSettings } from '../../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private _gamesCollection: AngularFirestoreCollection<Game>;
  private _gameDoc: AngularFirestoreDocument<Game>;
  private _game$: Observable<Game>;

  get game$() { return this._game$; }

  constructor(private afs: AngularFirestore) {
    this._gamesCollection = this.afs.collection('games');
  }

  init(gameId: string) {
    this._gameDoc = this._gamesCollection.doc(gameId);
    this._game$ = this._gameDoc.valueChanges();
    return this.game$;
  }

  getGameById(gameId: string) {
    return this._gamesCollection.doc<Game>(gameId).snapshotChanges();
  }

  async createNewGame(player: Player, gameSettings: GameSettings): Promise<string> {
    const newGame = this.newGame(player, gameSettings);
    const gameId = await this._gamesCollection.add(newGame).then(ref => ref.id);
    return gameId;
  }

  getOpenGameList(gameCount: number, sfwFilter$: Observable<boolean>): Observable<Game[]> {
    return sfwFilter$.pipe(
      switchMap(sfw => {
        return this.afs.collection('games', ref => {
          let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
          if (sfw) {
            query = ref.where('safeForWork', '==', true);
          }
          return query.where('hasStarted', '==', false).orderBy('beginDate', 'desc').limit(gameCount);
        }).snapshotChanges();
      }),
      map((actions: DocumentChangeAction<Game>[]) => {
        const games = actions.map(a => {
          const game = a.payload.doc.data();
          game.id = a.payload.doc.id;
          return game;
        });
        return games;
      })
    );
  }

  updateGame(changes: GameChanges): Promise<void> {
    return this._gameDoc.update(changes);
  }

  private newGame(host: Player, gameSettings: GameSettings): Game {
    return {
      hasStarted: false,
      beginDate: firebase.firestore.FieldValue.serverTimestamp(),
      hostId: host.uid,
      hostPhotoURL: host.thumbnailURL,
      tagOptions: [],
      gifOptionURLs: [],
      captionDeck: [],
      isVotingRound: false,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      safeForWork: gameSettings.sfw,
      maxPlayers: gameSettings.maxPlayers,
      pointsToWin: gameSettings.pointsToWin,
      reverseRoundFrequency: gameSettings.reverseRoundFrequency,
      timeLimit: gameSettings.roundTimer
    };
  }

}
