import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GameSetupComponent } from './game-setup.component';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../modules/core/services';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GameSetupComponent', () => {
  let component: GameSetupComponent;
  let fixture: ComponentFixture<GameSetupComponent>;
  let gameService: jasmine.SpyObj<GameService>;

  beforeEach(async(() => {
    gameService = jasmine.createSpyObj<GameService>('GameService', ['createNewGame']);
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {
          provide: GameService,
          useValue: gameService
        }
      ],
      declarations: [ GameSetupComponent ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.cancelled, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set up a game with user specified settings', () => {
    gameService.createNewGame.and.returnValue(Promise.resolve('some-game-Id'));
    const hostEl = fixture.nativeElement;

    const numberOfPlayersInput = hostEl.querySelector('.player-count-page input');
    numberOfPlayersInput.value = 4;
    numberOfPlayersInput.dispatchEvent(new Event('input'));

    const pointsToWinInput = hostEl.querySelector('.scoring-page input');
    pointsToWinInput.value = 5;
    pointsToWinInput.dispatchEvent(new Event('input'));

    component.gameSettings.sfw = true;
    component.gameSettings.reverseRoundFrequency = 0.25;

    fixture.detectChanges();
    component.createGame();

    expect(component.gameSettings).toEqual({
      maxPlayers: 4,
      pointsToWin: 5,
      sfw: true,
      reverseRoundFrequency: 0.25
    });
    expect(gameService.createNewGame).toHaveBeenCalled();
  });

  it('should default to correct game settings on creation', () => {
    expect(component.gameSettings).toEqual({
      maxPlayers: 5,
      pointsToWin: 7,
      sfw: false,
      reverseRoundFrequency: 0.25
    });
  });

  it('should emit a cancel event to exit', () => {
    component.cancel();
    expect(component.cancelled.emit).toHaveBeenCalled();
  });

  it('should prevent creating multiple games', () => {
    gameService.createNewGame.and.returnValue(Promise.resolve('some-game-Id'));
    component.createGame();
    component.createGame();
    component.createGame();

    expect(gameService.createNewGame).toHaveBeenCalledTimes(1);
  });

  it('should allow calling createNewGame a second time if it originally fails', fakeAsync(() => {
    gameService.createNewGame.and.returnValue(Promise.reject('failed'));
    component.createGame();

    tick();

    gameService.createNewGame.and.returnValue(Promise.resolve('some-game-id'));
    component.createGame();

    expect(gameService.createNewGame).toHaveBeenCalledTimes(2);
  }));
});
