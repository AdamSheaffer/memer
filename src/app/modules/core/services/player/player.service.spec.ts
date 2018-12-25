import { TestBed, inject } from '@angular/core/testing';

import { PlayerService } from './player.service';
import { AngularFirestore } from 'angularfire2/firestore';

describe('PlayerService', () => {
  const afs = jasmine.createSpyObj('AngularFirestore', ['collection']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerService,
        {
          provide: AngularFirestore,
          useValue: afs
        }
      ]
    });
  });

  it('should be created', inject([PlayerService], (service: PlayerService) => {
    expect(service).toBeTruthy();
  }));
});
