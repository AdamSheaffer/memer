import { TestBed, inject, fakeAsync } from '@angular/core/testing';

import { CaptionService } from './caption.service';
import { of } from 'rxjs';
import { Card } from '../../../interfaces';
import { AngularFirestore } from 'angularfire2/firestore';

describe('CaptionService', () => {
  const data = [
    {
      payload: {
        doc: {
          id: '1',
          data() {
            return { top: 'TOP 1', bottom: 'BOTTOM 1' };
          }
        }
      }
    },
    {
      payload: {
        doc: {
          id: '2',
          data() {
            return { top: 'TOP 2', bottom: 'BOTTOM 2' };
          }
        }
      }
    }
  ];

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

  it('should be created', inject([CaptionService], fakeAsync((service: CaptionService) => {
    service.captions$.subscribe();
    expect(service).toBeTruthy();
  })));
});
