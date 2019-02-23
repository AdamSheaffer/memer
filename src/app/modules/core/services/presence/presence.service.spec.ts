import { TestBed, inject } from '@angular/core/testing';

import { PresenceService } from './presence.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';

describe('PresenceService', () => {
  let angularfireDB: jasmine.SpyObj<AngularFireDatabase>;
  let afs: jasmine.SpyObj<AngularFirestore>;

  beforeEach(() => {
    angularfireDB = jasmine.createSpyObj<AngularFireDatabase>('AngularFireDatabase', ['object']);
    afs = jasmine.createSpyObj<AngularFirestore>('AngularFirestore', ['doc']);

    TestBed.configureTestingModule({
      providers: [
        PresenceService,
        {
          provide: AngularFireDatabase,
          useValue: angularfireDB
        },
        {
          provide: AngularFirestore,
          useValue: afs
        }
      ]
    });
  });

  it('should be created', inject([PresenceService], (service: PresenceService) => {
    expect(service).toBeTruthy();
  }));
});
