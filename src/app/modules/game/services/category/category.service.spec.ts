import { TestBed, inject } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { of } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';

describe('CategoryService', () => {
  const data: string[][] = [['COOL', 'BEANS']];

  const afs = jasmine.createSpyObj('AngularFirestore', ['collection']);
  afs.collection.and.returnValue({
    snapshotChanges: () => of(data)
  });

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
  });

  it('should be created', inject([CategoryService], (service: CategoryService) => {
    expect(service).toBeTruthy();
  }));
});
