import { Injectable } from '@angular/core';
import { cards } from '../data/cards';
import { ICard } from '../interfaces/ICard';
import { Observable } from 'rxjs';
import { shuffle } from 'lodash';
import { IPlayer } from '../interfaces/IPlayer';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class DeckService {
  private _cardCollection: AngularFirestoreCollection<ICard>;
  private _deck$: Observable<ICard[]>;

  private _url = '../assets/captions/captin-cards.json';

  constructor(private afs: AngularFirestore) {
  }

  init(gameId: string) {
    this._cardCollection = this.afs.collection('games')
      .doc(gameId)
      .collection('deck');

    this._deck$ = this._cardCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const card = a.payload.doc.data() as ICard;
          card.id = a.payload.doc.id;
          return card;
        });
      })
    );

    const batch = this.afs.firestore.batch();

    this.getDeck().map(card => {
      card.id = this.afs.createId();
      return card;
    }).forEach(card => {
      const ref = this._cardCollection.doc(card.id).ref;
      batch.set(ref, card);
    });

    batch.commit();
  }

  getDeck(): ICard[] {
    return shuffle(cards);
  }

  // IS THERE A WAY TO DO THIS BETTER WITHOUT USING SIDE EFFECTS?
  deal(deck: ICard[], players: IPlayer[], numOfCards: number): void {
    players.forEach(p => {
      const cardsFromDeck = deck.splice(0, numOfCards);
      p.captions.push(...cardsFromDeck);
    });
  }

}
