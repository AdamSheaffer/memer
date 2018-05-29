import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { IPlayer } from '../interfaces/IPlayer';
import { IGame } from '../interfaces/IGame';
import { ICard } from '../interfaces/ICard';
import { IGameObservables } from '../interfaces/IGameObservables';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable()
export class GameService {

  private _gamesCollection: AngularFirestoreCollection<IGame>;
  private _gameDoc: AngularFirestoreDocument<IGame>;
  private _game$: Observable<IGame>;

  get game$() { return this._game$; }

  constructor(private afs: AngularFirestore) {
    this._gamesCollection = this.afs.collection('games');
  }

  async createNewGame(player: IPlayer): Promise<string> {
    const newGame = this.newGame(player);
    const gameId = await this._gamesCollection.add(newGame).then(ref => ref.id);
    return gameId;
  }

  // I don't want to get a random game anymore. Users should be able to select
  // an open game. Get rid of this method
  findOpenGameId(): Observable<string> {
    const gamesCollection = this.afs.collection('games', ref => {
      return ref.orderBy('beginDate').where('hasStarted', '==', false).limit(1);
    });

    return gamesCollection.snapshotChanges().pipe(
      take(1),
      map((actions: DocumentChangeAction<IGame>[]) => {
        const ids = actions.map(a => a.payload.doc.id);
        return ids[0];
      })
    );
  }

  getOpenGameList(gameCount: number): Observable<IGame[]> {
    const gamesCollection = this.afs.collection('games', ref => {
      return ref.orderBy('beginDate').where('hasStarted', '==', false).limit(gameCount);
    });

    return gamesCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<IGame>[]) => {
        const games$ = actions.map(a => a.payload.doc.data());
        return games$;
      })
    );
  }

  joinGameWithId(id: string, player: IPlayer): Observable<IGame> {
    this._gameDoc = this.afs.doc<IGame>(`games/${id}`);
    this._game$ = this._gameDoc.valueChanges();

    this.joinIfNotInGame(player);

    return this.game$;
  }

  updateGame(changes: any): Promise<void> {
    return this._gameDoc.update(changes);
  }

  once(fn: (game: IGame) => void) {
    this._game$.pipe(take(1)).subscribe(fn);
  }

  private newGame(host: IPlayer): IGame {
    return {
      hasStarted: false,
      beginDate: (Date.now() * -1),
      hostId: host.uid,
      players: [],
      tagOptions: [],
      gifOptionURLs: [],
      captionDeck: [],
      isVotingRound: false,
      messages: [],
    };
  }

  private joinIfNotInGame(player: IPlayer): void {
    this._game$.pipe(take(1)).subscribe(game => {
      const players = game.players;
      const hasAlreadyJoined = players.some(p => p.uid === player.uid);

      if (!hasAlreadyJoined) {
        players.push(player);
        this._gameDoc.update({ players });
      }
    });
  }

}
