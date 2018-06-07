import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Card, User } from '../../../interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { cards } from '../../../data/cards';

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

  delete(caption: Card) {
    if (!caption.id) {
      throw new Error('Caption does not have an ID');
    }
    const ref = this._captionCollection.doc(caption.id).ref;
    return ref.delete();
  }

  add(caption: Card, user: User) {
    caption.createdBy = user.username;
    return this._captionCollection.add(caption);
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
