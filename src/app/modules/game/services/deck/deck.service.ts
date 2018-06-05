import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
  DocumentReference
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { shuffle } from 'lodash';
import { IGame, ICard, IPlayer } from '../../../../interfaces';
import { cards } from '../../../../data/cards';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private _gameDoc: AngularFirestoreDocument<IGame>;
  private _cardCollection: AngularFirestoreCollection<ICard>;
  private _deck$: Observable<ICard[]>;

  private _url = '../assets/captions/captin-cards.json';

  constructor(private afs: AngularFirestore) {
  }

  init(gameId: string) {
    this._gameDoc = this.afs.collection('games').doc(gameId);
    this._cardCollection = this._gameDoc.collection('deck');

    this._deck$ = this._cardCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const card = a.payload.doc.data() as ICard;
          card.id = a.payload.doc.id;
          return card;
        });
      })
    );
  }

  setDeck() {
    const batch = this.afs.firestore.batch();

    this.getDeck().map(card => {
      card.id = this.afs.createId();
      return card;
    }).forEach(card => {
      const ref = this._cardCollection.doc(card.id).ref;
      batch.set(ref, card);
    });

    return batch.commit();
  }

  getDeck(): ICard[] {
    return shuffle(cards);
  }

  getCards(count: number) {
    return this._gameDoc.collection<ICard>('deck', r => r.limit(count))
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .then(captions => {
        const cardRefs = captions.map(c => this.getCardRef(c.id));
        this.removeCardsFromDeck(cardRefs);
        return captions;
      });
  }

  getCardRef(cardId: string) {
    return this._cardCollection.doc(cardId).ref;
  }

  // IS THERE A WAY TO DO THIS BETTER WITHOUT USING SIDE EFFECTS?
  deal(deck: ICard[], players: IPlayer[], numOfCards: number): void {
    players.forEach(p => {
      const cardsFromDeck = deck.splice(0, numOfCards);
      p.captions.push(...cardsFromDeck);
    });
  }

  private removeCardsFromDeck(cardRefs: DocumentReference[]) {
    const batch = this.afs.firestore.batch();
    cardRefs.forEach(r => {
      batch.delete(r);
    });
    batch.commit();
  }

}
