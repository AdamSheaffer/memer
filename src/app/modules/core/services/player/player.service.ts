import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, filter, take, takeWhile } from 'rxjs/operators';
import { Player, PlayerChanges, Card } from '../../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private _playerCollection: AngularFirestoreCollection<Player>;
  private _players$: Observable<Player[]>;

  get players$() { return this._players$; }

  constructor(private afs: AngularFirestore) { }

  init(gameId: string, playerId: string) {
    this._playerCollection = this.afs.collection('games')
      .doc(gameId)
      .collection('players');

    this._players$ = this._playerCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const player = a.payload.doc.data() as Player;
          player.gameAssignedId = a.payload.doc.id;
          return player;
        });
      })
    );

    return this.players$;
  }

  join(player: Player, gameHasStarted: boolean) {
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
        const gameAssignedId = snapshot.docs[0].id;
        player.gameAssignedId = gameAssignedId;
        this.update(player, { isActive: true });
        return gameAssignedId; // already in game. Return their id
      });
  }

  addPlayer(player: Player) {
    return this._playerCollection.add(player).then(ref => ref.id);
  }

  remove(player: Player) {
    const changes: PlayerChanges = { removed: true, isActive: false };
    return this.update(player, changes);
  }

  update(player: Player, changes: PlayerChanges) {
    return this._playerCollection.doc(player.gameAssignedId).update(changes);
  }

  updateAll(players: Player[], changes: PlayerChanges) {
    const batch = this.afs.firestore.batch();

    players.forEach(p => {
      const ref = this._playerCollection.doc(p.gameAssignedId).ref;
      batch.update(ref, changes);
    });

    return batch.commit();
  }

  getCurrentPlayersHand(playerId: string, cardsShown: number) {
    const handCollection = this.getPlayerHandCollection(playerId);
    return handCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const card = a.payload.doc.data();
          card.id = a.payload.doc.id;
          return card;
        });
      }),
      map(cards => {
        return cards.slice(0, cardsShown);
      })
    );
  }

  dealToAllPlayers(playerIds: string[], hands: Card[][]) {
    if (playerIds.length !== hands.length) {
      throw new Error(`Game has ${playerIds.length} but ${hands.length} hands`);
    }

    playerIds.forEach((playerId, index) => {
      const batch = this.afs.firestore.batch();
      const handCollection = this.getPlayerHandCollection(playerId);
      const hand = hands[index];
      hand.forEach(card => {
        const id = this.afs.createId();
        const ref = handCollection.doc(id).ref;
        batch.set(ref, card);
      });
      batch.commit();
    });
  }

  submitCaption(playerId: string, card: Card) {
    const handCollection = this.getPlayerHandCollection(playerId);
    return handCollection.doc(card.id).delete();
  }

  emptyAllPlayerHands(playerIds: string[]) {
    const promises = playerIds.map(pid => {
      return this.emptyPlayerHand(pid);
    });
    return Promise.all(promises);
  }

  emptyPlayerHand(playerId: string) {
    const handCollection = this.getPlayerHandCollection(playerId);

    return handCollection.ref.get().then(snapshot => {
      const batch = this.afs.firestore.batch();
      snapshot.forEach(doc => batch.delete(doc.ref));
      batch.commit();
    });
  }

  private getPlayerHandDocumentRefs(playerId: string) {
    const handCollection = this.getPlayerHandCollection(playerId);
  }

  private getPlayerHandCollection(playerId: string) {
    return this._playerCollection.doc(playerId).collection<Card>('cards');
  }

  private resetPlayer(player: Player) {
    player.memePlayed = null;
    player.score = 0;
  }
}
