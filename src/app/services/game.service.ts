import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { IPlayer } from '../interfaces/IPlayer';
import { IGame } from '../interfaces/IGame';
import 'rxjs/operators/mergeMap';

@Injectable()
export class GameService {

  private gamesCollection: AngularFirestoreCollection<IGame>;
  private gameDoc: AngularFirestoreDocument<IGame>;
  private game$: Observable<IGame>;

  constructor(private afs: AngularFirestore) {
    this.gamesCollection = this.afs.collection('games');
  }

  addGame(): Promise<firebase.firestore.DocumentReference> {
    const game = this.createGame();
    return this.gamesCollection.add(game);
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

  getGameById(id: string): Observable<IGame> {
    this.gameDoc = this.afs.doc<IGame>(`games/${id}`);
    this.game$ = this.gameDoc.valueChanges();
    return this.game$;
  }

  join(player: IPlayer) {
    this.game$.take(1).subscribe(g => {
      if (!g.players || !g.players.length) {
        player.isHost = true;
        g.turn = player.uid;
      }
      const existingPlayer = g.players.find(p => player.uid === p.uid);
      if (existingPlayer) {
        player = existingPlayer;
      } else {
        g.players.push(player);
        this.updateGame(g);
      }
    });
  }

  votingEnd() {
    return this.game$.filter(this.everyoneVoted);
  }

  updateGame(game: IGame): Promise<void> {
    return this.gameDoc.update(game);
  }

  currentPlayer(uid: string) {
    return this.game$.switchMap(g => g.players)
      .filter(p => p.uid === uid);
  }

  private everyoneVoted(game: IGame) {
    if (!game) return;

    return game.hasStarted &&
      !!game.gifSelectionURL &&
      !game.isVotingRound &&
      game.players.every(p => !!p.captionPlayed || game.turn === p.uid);
  }

  private createGame(): IGame {
    return {
      hasStarted: false,
      players: [],
      tagOptions: [],
      gifOptionURLs: [],
      captionDeck: [],
      isVotingRound: false,
      gifOptionIndex: 0
    }
  }
}
