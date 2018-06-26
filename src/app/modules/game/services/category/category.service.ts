import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Category } from '../../../../interfaces';
import { map } from 'rxjs/operators';
// import { CATEGORIES } from '../../../../data/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private _categoryCollection: AngularFirestoreCollection<Category>;
  private _categoriesCache: Category[];

  constructor(private afs: AngularFirestore) {
    this._categoryCollection = this.afs.collection('categories');
  }

  getAll() {
    return this._categoryCollection.ref.get().then(snapshot => {
      const allCategories: Category[] = [];
      snapshot.forEach(function (doc) {
        const cat = doc.data() as Category;
        cat.id = doc.id;
        allCategories.push(cat);
      });
      this._categoriesCache = allCategories;
      return allCategories;
    });
  }

  getAllAsObservable() {
    return this._categoryCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const cat = a.payload.doc.data() as Category;
          cat.id = a.payload.doc.id;
          return cat;
        });
      })
    );
  }

  getNCategories(n: number) {
    if (this._categoriesCache) {
      const categoryCount = this._categoriesCache.length;
      const randomIndexes = this.randomNumbersWithMax(categoryCount, n);
      const categories = randomIndexes.map(i => this._categoriesCache[i]);
      return Promise.resolve(categories);
    }
    return this.getAll().then((allCategories) => {
      const categoryCount = allCategories.length;
      const randomIndexes = this.randomNumbersWithMax(categoryCount, n);
      return randomIndexes.map(i => allCategories[i]);
    });
  }

  delete(category: Category) {
    if (!category.id) {
      throw new Error('Caption does not have an ID');
    }
    const ref = this._categoryCollection.doc(category.id).ref;
    return ref.delete();
  }

  add(category: Category): Promise<Category> {
    return this._categoryCollection.add(category).then(ref => {
      const newCategory = Object.assign({}, category);
      newCategory.id = ref.id;
      return newCategory;
    });
  }

  update(category: Category) {
    if (!category.id) {
      throw new Error('Caption does not have an ID');
    }
    const ref = this._categoryCollection.doc(category.id).ref;
    return ref.set(category, { merge: true });
  }

  // UNCOMMENT TO ENABLE LOADING NEW CATEGORIES
  // load() {
  //   const allCategories = CATEGORIES;
  //   const batch = this.afs.firestore.batch();

  //   allCategories.forEach(cat => {
  //     const id = this.afs.createId();
  //     const ref = this._categoryCollection.doc(id).ref;
  //     batch.set(ref, cat);
  //   });

  //   return batch.commit();
  // }

  private randomNumbersWithMax(max: number, count: number, ): number[] {
    const rands = [];
    while (rands.length < count) {
      const rand = Math.round(Math.random() * max);
      if (rands.includes(rand)) { continue; }
      rands.push(rand);
    }
    return rands;
  }

}
