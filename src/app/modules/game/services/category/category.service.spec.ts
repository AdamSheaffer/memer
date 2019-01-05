import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { of } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Category } from '../../../../interfaces';

const afsCollectionHelper = (snapshotChangesData: any[]) => {
  const data = snapshotChangesData.map((val, i) => {
    return {
      payload: {
        doc: {
          id: `${i + 1}`,
          data: () => val
        }
      }
    };
  });

  return {
    snapshotChanges() {
      return of(data);
    },
    ref: {
      get() {
        const payloads = data.map(d => d.payload.doc);
        return Promise.resolve(payloads);
      }
    }
  };
};

describe('CategoryService', () => {
  let injector: TestBed;
  let service: CategoryService;
  const data: Category[] = [
    { description: 'COOL' },
    { description: 'BEANS' }
  ];

  const afs = jasmine.createSpyObj('AngularFirestore', ['collection']);
  afs.collection.and.returnValue(afsCollectionHelper(data));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        {
          provide: AngularFirestore,
          useValue: afs
        }
      ],
    });

    injector = getTestBed();
    service = injector.get(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all categories as observables with ids set', (done) => {
    service.getAllAsObservable().subscribe(categories => {
      expect(categories[0].description).toBe('COOL');
      expect(categories[1].description).toBe('BEANS');
      expect(categories[0].id).toBe('1');
      expect(categories[1].id).toBe('2');
      done();
    });
  });

  it('should get all as promise with ids set', (done) => {
    service.getAll().then(categories => {
      expect(categories[0].description).toBe('COOL');
      expect(categories[1].description).toBe('BEANS');
      expect(categories[0].id).toBe('1');
      expect(categories[1].id).toBe('2');
      done();
    });
  });
});
