import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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

    fixture.detectChanges();
    component.createGame();

    expect(component.gameSettings).toEqual({
      maxPlayers: 4,
      pointsToWin: 5,
      sfw: true
    });
    expect(gameService.createNewGame).toHaveBeenCalled();
  });

  it('should default to correct game settings on creation', () => {
    expect(component.gameSettings).toEqual({
      maxPlayers: 5,
      pointsToWin: 7,
      sfw: false
    });
  });
});
