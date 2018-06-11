import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Card } from '../../../interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { cards } from '../../../data/cards';
import { PromiseState } from 'q';

@Injectable({
  providedIn: 'root'
})
export class CaptionService {
  private _captionCollection: AngularFirestoreCollection<Card>;
  captions$: Observable<Card[]>;

  constructor(private afs: AngularFirestore) {
    this._captionCollection = this.afs.collection('captions');
    this.captions$ = this._captionCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const caption = a.payload.doc.data() as Card;
          caption.id = a.payload.doc.id;
          return caption;
        });
      })
    );
  }

  getAll() {
    return this._captionCollection.ref.get().then(snapshot => {
      const allCards: Card[] = [];
      snapshot.forEach(function (doc) {
        const card = doc.data() as Card;
        card.id = doc.id;
        allCards.push(card);
      });
      return allCards;
    });
  }

  delete(caption: Card) {
    if (!caption.id) {
      throw new Error('Caption does not have an ID');
    }
    const ref = this._captionCollection.doc(caption.id).ref;
    return ref.delete();
  }

  add(caption: Card): Promise<Card> {
    return this._captionCollection.add(caption).then(c => {
      const newCaption = Object.assign({}, caption);
      newCaption.id = c.id;
      return newCaption;
    });
  }

  update(caption: Card) {
    if (!caption.id) {
      throw new Error('Caption does not have an ID');
    }
    const ref = this._captionCollection.doc(caption.id).ref;
    return ref.set(caption, { merge: true });
  }

  load() {
    const deck = cards;
    const batch = this.afs.firestore.batch();

    deck.map(card => {
      card.id = this.afs.createId();
      card.createdBy = 'James';
      return card;
    }).forEach(card => {
      const ref = this._captionCollection.doc(card.id).ref;
      batch.set(ref, card);
    });

    batch.commit();
  }
}
