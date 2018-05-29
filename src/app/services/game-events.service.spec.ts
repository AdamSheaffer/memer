import { TestBed, inject } from '@angular/core/testing';

import { GameEventsService } from './game-events.service';

describe('GameEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameEventsService]
    });
  });

  it('should be created', inject([GameEventsService], (service: GameEventsService) => {
    expect(service).toBeTruthy();
  }));
});
