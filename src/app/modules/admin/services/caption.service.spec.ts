import { TestBed, inject } from '@angular/core/testing';

import { CaptionService } from './caption.service';
import { of } from 'rxjs';
import { Card } from '../../../interfaces';
import { AngularFirestore } from 'angularfire2/firestore';

describe('CaptionService', () => {
  const data: Card[][] = [[
    { top: 'TOP 1', bottom: 'BOTTOM 1' },
    { top: 'TOP 2', bottom: 'BOTTOM 2' },
  ]];

  const afs = jasmine.createSpyObj('AngularFirestore', ['collection']);
  afs.collection.and.returnValue({
    snapshotChanges: () => of(data)
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CaptionService,
        {
          provide: AngularFirestore,
          useValue: afs
        }
      ]
    });
  });

  it('should be created', inject([CaptionService], (service: CaptionService) => {
    expect(service).toBeTruthy();
  }));
});
