import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game, Card, Player } from '../../../../interfaces';
import { CaptionService } from '../../../admin/services/caption.service';
import shuffle from 'lodash/shuffle';
import chunk from 'lodash/chunk';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private _gameDoc: AngularFirestoreDocument<Game>;
  private _cardCollection: AngularFirestoreCollection<Card>;
  private _deck$: Observable<Card[]>;

  constructor(private afs: AngularFirestore, private captionService: CaptionService) {
  }

  init(gameId: string) {
    this._gameDoc = this.afs.collection('games').doc(gameId);
    this._cardCollection = this._gameDoc.collection('deck');

    this._deck$ = this._cardCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const card = a.payload.doc.data() as Card;
          card.id = a.payload.doc.id;
          return card;
        });
      })
    );
  }

  getShuffledDeck() {
    return this.captionService.getAll()
      .then(cards => {
        return shuffle(cards);
      });
  }

  createPlayerHandsFromDeck(deck: Card[], playerCount: number) {
    const handSize = Math.floor(deck.length / playerCount);
    const hands = chunk(deck, handSize);
    // If the deck can't be split evenly, lodash will add the remaining elements in the last array
    // I'll consider these cards as extra and they'll be gotten rid of
    while (hands.length > playerCount) {
      hands.pop();
    }
    return hands;
  }

}
