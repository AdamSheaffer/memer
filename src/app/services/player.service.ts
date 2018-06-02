import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from 'angularfire2/firestore';
import { IPlayer, IPlayerChanges } from '../interfaces/IPlayer';
import { Observable } from 'rxjs';
import { map, filter, take, takeWhile } from 'rxjs/operators';
import { ICard } from '../interfaces/ICard';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private _playerCollection: AngularFirestoreCollection<IPlayer>;
  private _players$: Observable<IPlayer[]>;

  get players$() { return this._players$; }

  constructor(private afs: AngularFirestore) { }

  init(gameId: string, playerId: string) {
    this._playerCollection = this.afs.collection('games')
      .doc(gameId)
      .collection('players');

    this._players$ = this._playerCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const player = a.payload.doc.data() as IPlayer;
          player.gameAssignedId = a.payload.doc.id;
          return player;
        });
      })
    );

    return this.players$;
  }

  join(player: IPlayer, gameHasStarted: boolean) {
    const ref = this._playerCollection.ref;
    return ref.where('uid', '==', player.uid).limit(1).get()
      .then(snapshot => {
        const playerIsNewToGame = snapshot.empty;
        if (playerIsNewToGame) {
          if (gameHasStarted) {
            throw new Error('This game has already started and cannot be joined');
          }
          this.resetPlayer(player); // reset player and add to game
          return this.addPlayer(player);
        }
        return snapshot.docs[0].id; // already in game. Return their id
      });
  }

  addPlayer(player: IPlayer) {
    return this._playerCollection.add(player).then(ref => ref.id);
  }

  remove(player: IPlayer) {
    return this._playerCollection.doc(player.gameAssignedId).delete();
  }

  update(player: IPlayer, changes: IPlayerChanges) {
    return this._playerCollection.doc(player.gameAssignedId).update(changes);
  }

  updateAll(players: IPlayer[], changes: IPlayerChanges) {
    const batch = this.afs.firestore.batch();

    players.forEach(p => {
      const ref = this._playerCollection.doc(p.gameAssignedId).ref;
      batch.update(ref, changes);
    });

    return batch.commit();
  }

  dealToAllPlayers(cards: ICard[], cardsPerPlayer: number) {
    // For now, it's going to be the responsibility of the caller
    // to make sure they pass in the correct amount of cards.
    // otherwise, throw an error
    const batch = this.afs.firestore.batch();

    this._playerCollection.ref.get().then(snapshot => {
      const playerCount = snapshot.docs.length;

      if (!this.hasTheCorrectAmountOfCards(cards.length, playerCount, cardsPerPlayer)) {
        throw new Error(`Incorrect number of cards passed. ${cards.length} cards and ${playerCount} players`);
      }

      snapshot.docs.forEach(q => {
        const ref = q.ref;
        const captions = cards.splice(0, cardsPerPlayer);
        batch.update(ref, { captions });
      });

      batch.commit();
    });

  }

  private resetPlayer(player: IPlayer) {
    player.captionPlayed = null;
    player.captions = [];
    player.score = 0;
  }

  private hasTheCorrectAmountOfCards(cardCount: number, playerCount: number, cardsPerPlayer: number) {
    return (playerCount * cardsPerPlayer) === cardCount;
  }
}
