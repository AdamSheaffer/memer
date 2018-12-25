// import { TestBed, inject } from '@angular/core/testing';

// import { GameService } from './game.service';
// import { Game } from '../../../../interfaces';
// import { of } from 'rxjs';
// import { AngularFirestore } from 'angularfire2/firestore';

// describe('GameService', () => {
//   const data: Game[][] = [[
//     {
//       id: '1',
//       beginDate: { isEqual: () => true },
//       safeForWork: false,
//       lastUpdated: { isEqual: () => true },
//       hasStarted: true,
//       hostId: '1',
//       hostPhotoURL: 'foo.jpg',
//       tagOptions: [],
//       gifOptionURLs: [],
//       captionDeck: [],
//       isVotingRound: false,
//       maxPlayers: 8,
//       pointsToWin: 10
//     }
//   ]];

//   const afs = jasmine.createSpyObj('AngularFirestore', ['collection']);
//   afs.collection.and.returnValue({
//     snapshotChanges: () => of(data),
//     doc: (gameId) => data[0].find(g => g.id === gameId)
//   });

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         GameService,
//         {
//           provide: AngularFirestore,
//           useValue: afs
//         }
//       ]
//     });
//   });

//   it('should be created', inject([GameService], (service: GameService) => {
//     expect(service).toBeTruthy();
//   }));
// });
